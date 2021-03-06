/// <reference path="../../adonis-typings/pubsub.ts" />

import MQTT, { AsyncMqttClient } from 'async-mqtt'
import { MqttConfig, MqttDriverContract } from '@ioc:Romch007/PubSub'
import { EmitterContract } from '@ioc:Adonis/Core/Event'

export class MqttDriver implements MqttDriverContract {
  public name: 'mqtt' = 'mqtt'
  private client: AsyncMqttClient

  constructor(config: MqttConfig, emitter: EmitterContract) {
    this.client = MQTT.connect({
      ...config,
      protocol: 'mqtt',
    })
    this.client.on('message', (topic, message, _) => {
      emitter.emit('pubsub:message', { topic, message })
    })
  }

  public publish(topic: string, message: Buffer): Promise<void> {
    return this.client.publish(topic, message)
  }

  public subscribe(topic: string): void {
    this.client.subscribe(topic)
  }

  public close(): void | Promise<void> {
    return this.client.end()
  }
}
