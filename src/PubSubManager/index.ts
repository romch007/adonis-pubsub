/// <reference path="../../adonis-typings/pubsub.ts" />
import { Manager } from '@poppinss/manager'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

import {
  PubSubDriversList,
  PubSubManagerContract,
  PubSubDriverContract,
  MqttConfig,
  PubSubConfig,
} from '@ioc:Romch007/PubSub'
import { EmitterContract } from '@ioc:Adonis/Core/Event'

export abstract class PubSubManager
  extends Manager<
    ApplicationContract,
    PubSubDriverContract,
    PubSubDriverContract,
    { [P in keyof PubSubDriversList]: PubSubDriversList[P]['implementation'] }
  >
  implements PubSubManagerContract
{
  protected singleton = true

  constructor(
    public application: ApplicationContract,
    public emitter: EmitterContract,
    private config: PubSubConfig
  ) {
    super(application)
  }

  protected getDefaultMappingName(): keyof PubSubDriversList {
    return this.config.pubsub
  }

  protected getMappingConfig(mappingName: string): any {
    return this.config.pubsubs[mappingName]
  }

  protected getMappingDriver(mappingName: string): string | undefined {
    const config = this.getMappingConfig(mappingName)
    return config && config.driver
  }

  protected createMqtt(_: string, config: MqttConfig) {
    const { MqttDriver } = require('../Drivers/Mqtt')
    return new MqttDriver(config, this.emitter)
  }

  public publish(topic: string, message: Buffer): Promise<void> {
    return this.use().publish(topic, message)
  }

  public subscribe(topic: string): void {
    return this.use().subscribe(topic)
  }
}
