/// <reference path="../../adonis-typings/pubsub.ts" />

import MQTT, { AsyncMqttClient } from 'async-mqtt'
import { MqttConfig, MqttDriverContract } from '@ioc:Romch007/PubSub'

export class MqttDriver implements MqttDriverContract {
  public name: 'mqtt' = 'mqtt'
  private client: AsyncMqttClient

  constructor(config: MqttConfig) {
    this.client = MQTT.connect({
      ...config,
      protocol: 'mqtt',
    })
  }

  public publish(topic: string, message: Buffer): Promise<void> {
    return this.client.publish(topic, message)
  }

  public subscribe(topic: string): void {
    this.client.subscribe(topic)
  }
}
