import { ManagerContract } from '@poppinss/manager'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

declare module '@ioc:Romch007/PubSub' {
  export interface PubSubDriverContract {
    name: string
    publish(message: Buffer): Promise<void>
    subscribe(topic: string): void
  }

  export type MqttDriverConfig = {
    host: string
    port: string
    username?: string
    password?: string
  }

  export interface MqttDriverContract extends PubSubDriverContract {}

  export interface PubSubDrivers {
    mqtt: {
      config: MqttDriverConfig
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
        { [P in keyof PubSubDriversList]: PubSubDrivers[P]['implementation'] }
      >,
      Omit<PubSubDriverContract, 'name'> {}

  const PubSub: PubSubManagerContract
  export default PubSub
}
