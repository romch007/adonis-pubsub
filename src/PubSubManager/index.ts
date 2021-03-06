/// <reference path="../../adonis-typings/pubsub.ts" />
import { Manager } from '@poppinss/manager'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

import {
  PubSubDriversList,
  PubSubManagerContract,
  PubSubDriverContract,
  MqttConfig,
  PubSubConfig,
  FakeImplementationCallback,
  GooglePubSubConfig,
  RedisConfig,
} from '@ioc:Romch007/PubSub'
import { FakePubSub } from '../Fake'
import { Exception } from '@poppinss/utils'

export class PubSubManager
  extends Manager<
    ApplicationContract,
    PubSubDriverContract,
    PubSubDriverContract,
    { [P in keyof PubSubDriversList]: PubSubDriversList[P]['implementation'] }
  >
  implements PubSubManagerContract
{
  protected singleton = true

  private fakeCallback: FakeImplementationCallback = (_, driver, config) => {
    const { FakeDriver } = require('../Drivers/Fake')
    return new FakeDriver(driver, config, this.emitter)
  }

  private fakeDriver = new FakePubSub()

  public fakes = this.fakeDriver.fakes

  private emitter = this.application.container.resolveBinding('Adonis/Core/Event')
  private logger = this.application.container.resolveBinding('Adonis/Core/Logger')

  constructor(public application: ApplicationContract, private config: PubSubConfig) {
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

  protected createGoogle(_: string, config: GooglePubSubConfig) {
    const { GooglePubSubDriver } = require('../Drivers/Google')
    return new GooglePubSubDriver(config, this.emitter)
  }

  protected createRedis(_: string, config: RedisConfig) {
    if (!this.application.container.hasBinding('Adonis/Addons/Redis')) {
      throw new Exception('"@adonisjs/redis" is required to use the "redis" pubsub provider')
    }

    const Redis = this.application.container.use('Adonis/Addons/Redis')
    const { RedisDriver } = require('../Drivers/Redis')
    return new RedisDriver(config, this.emitter, Redis)
  }

  public fake(drivers?: keyof PubSubDriversList | keyof PubSubDriversList[]) {
    drivers = drivers || this.getDefaultMappingName()
    const driversToFake = Array.isArray(drivers) ? drivers : [drivers]

    driversToFake.map((driver) => {
      if (!this.fakeDriver.isFaked(driver)) {
        this.logger.trace({ driver: driver }, 'pubsub driver faking')
        this.fakeDriver.fakes.set(
          driver,
          this.fakeCallback(this, driver, this.getMappingConfig(driver))
        )
      }
    })
    return this.fakeDriver
  }

  public restore(drivers?: keyof PubSubDriversList | keyof PubSubDriversList[]) {
    drivers = drivers || this.getDefaultMappingName()
    const driversToFake = Array.isArray(drivers) ? drivers : [drivers]

    driversToFake.map((driver) => {
      if (this.fakeDriver.isFaked(driver)) {
        this.logger.trace({ driver: driver }, 'pubsub driver restoring')
        this.fakeDriver.restore(driver)
      }
    })
  }

  public restoreAll() {
    this.fakeDriver.fakes = new Map()
  }

  public use(driver?: keyof PubSubDriversList): any {
    driver = driver || this.getDefaultMappingName()
    if (this.fakeDriver.isFaked(driver)) {
      return this.fakeDriver.use(driver)
    }
    return super.use(driver)
  }

  public setFakeImplementation(callback: FakeImplementationCallback) {
    this.fakeCallback = callback
  }

  public publish(topic: string, message: Buffer): Promise<void> {
    return this.use().publish(topic, message)
  }

  public subscribe(topic: string): void {
    return this.use().subscribe(topic)
  }

  public async close(name?: keyof PubSubDriversList): Promise<void> {
    const driver = name ? this.use(name) : this.use()
    await driver.close()
  }

  public async closeAll(): Promise<void> {
    await Promise.all(
      Array.from(this['mappingsCache'].keys()).map((name: string) => this.close(name as any))
    )
  }
}
