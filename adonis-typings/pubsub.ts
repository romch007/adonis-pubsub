declare module '@ioc:Romch007/PubSub' {
  import { ManagerContract } from '@poppinss/manager'
  import { ApplicationContract } from '@ioc:Adonis/Core/Application'

  export interface PubSubDriverContract {
    publish(topic: string, message: Buffer): Promise<void>
    subscribe(topic: string): void
  }

  export type MqttConfig = {
    host: string
    port: string
    username?: string
    password?: string
  }

  export interface MqttDriverContract extends PubSubDriverContract {
    name: 'mqtt'
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
    pubsubs: { [P in keyof PubSubDriversList]: PubSubDrivers[P]['config'] }
  }

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
