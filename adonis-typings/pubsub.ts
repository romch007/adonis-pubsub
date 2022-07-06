declare module '@ioc:Romch007/PubSub' {
  import { ManagerContract } from '@poppinss/manager'
  import { ApplicationContract } from '@ioc:Adonis/Core/Application'

  export interface PubSubDriverContract {
    publish(topic: string, message: Buffer): Promise<void>
    subscribe(topic: string): void
  }

  export type MqttConfig = {
    host: string
    port: number
    username?: string
    password?: string
  }

  export interface MqttDriverContract extends PubSubDriverContract {
    name: 'mqtt'
  }

  export interface FakeDriverContract extends PubSubDriverContract {
    name: 'fake'
  }

  export interface PubSubDrivers {
    mqtt: {
      config: MqttConfig
      implementation: MqttDriverContract
    }
  }

  export interface PubSubDriversList {}

  export type PubSubConfig = {
    pubsub: keyof PubSubDriversList
    pubsubs: { [P in keyof PubSubDriversList]: PubSubDriversList[P]['config'] }
  }

  export interface FakePubSubContract {
    isFaked(driver: keyof PubSubDriversList): boolean
    use(driver: keyof PubSubDriversList): FakeDriverContract
    restore(driver: keyof PubSubDriversList): void
  }

  /**
   * Shape of the fake implementation callback
   */
  export type FakeImplementationCallback = (
    manager: PubSubManagerContract,
    mappingName: keyof PubSubDriversList,
    config: any
  ) => FakeDriverContract

  export interface PubSubManagerContract
    extends ManagerContract<
        ApplicationContract,
        PubSubDriverContract,
        PubSubDriverContract,
        { [P in keyof PubSubDriversList]: PubSubDriversList[P]['implementation'] }
      >,
      Omit<PubSubDriverContract, 'name'> {}

  const PubSub: PubSubManagerContract
  export default PubSub
}
