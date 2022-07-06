/// <reference path="../../adonis-typings/pubsub.ts" />

import { GooglePubSubConfig, GooglePubSubDriverContract } from '@ioc:Romch007/PubSub'
import * as google from '@google-cloud/pubsub'
import { EmitterContract } from '@ioc:Adonis/Core/Event'

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
    this.mapTopic(topic)
    const googleTopic = this.topicMappings.get(topic)!
    await googleTopic.publishMessage({ data: Buffer.from(message) })
  }

  public subscribe(topic: string): void {
    this.mapSubscription(topic)
    const googleSubscription = this.subscriptionMappings.get(topic)!
    googleSubscription.on('message', (message) => {
      this.emitter.emit('pubsub:message', { topic, message: message.data })
    })
  }

  private mapTopic(topic: string) {
    if (!this.topicMappings.has(topic)) {
      const googleTopic = this.client.topic(topic)
      this.topicMappings.set(topic, googleTopic)
    }
  }

  private mapSubscription(topic: string) {
    if (!this.subscriptionMappings.has(topic)) {
      this.mapTopic(topic)
      const googleTopic = this.topicMappings.get(topic)!
      const googleSubscription = googleTopic.subscription(this.config.subscriptionFormat(topic))
      this.subscriptionMappings.set(topic, googleSubscription)
    }
  }

  public close(): void | Promise<void> {
    return this.client.close()
  }
}
