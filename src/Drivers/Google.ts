/// <reference path="../../adonis-typings/pubsub.ts" />

import { GooglePubSubConfig, GooglePubSubDriverContract } from '@ioc:Romch007/PubSub'
import * as google from '@google-cloud/pubsub'
import { EmitterContract } from '@ioc:Adonis/Core/Event'
import { Exception } from '@poppinss/utils'

export class GooglePubSubDriver implements GooglePubSubDriverContract {
  public name: 'google' = 'google'
  private client: google.PubSub
  private topicMappings: Map<string, google.Topic>
  private subscriptionMappings: Map<string, google.Subscription>

  constructor(private config: GooglePubSubConfig, private emitter: EmitterContract) {
    this.client = new google.PubSub(config)
    this.topicMappings = new Map()
    this.subscriptionMappings = new Map()
  }

  public async publish(topic: string, message: Buffer): Promise<void> {
    const googleTopic = this.mapTopic(topic)
    await googleTopic.publishMessage({ data: Buffer.from(message) })
  }

  public subscribe(topic: string): void {
    const googleSubscription = this.mapSubscription(topic)

    googleSubscription.on('message', (message) => {
      this.emitter.emit('pubsub:message', { topic, message: message.data })
    })
  }

  private mapTopic(topic: string): google.Topic {
    if (!this.topicMappings.has(topic)) {
      const googleTopic = this.client.topic(topic)
      this.topicMappings.set(topic, googleTopic)
    }
    return this.topicMappings.get(topic)!
  }

  private mapSubscription(topic: string): google.Subscription {
    if (!this.subscriptionMappings.has(topic)) {
      const googleTopic = this.mapTopic(topic)
      const googleSubscription = googleTopic.subscription(this.config.subscriptionFormat(topic))
      this.subscriptionMappings.set(topic, googleSubscription)
      googleSubscription.on('error', (err: Error) => {
        throw new Exception(err.message, 500, 'E_GOOGLE_PUBSUB_EXCEPTION')
      })
    }
    return this.subscriptionMappings.get(topic)!
  }

  public close(): void | Promise<void> {
    return this.client.close()
  }
}
