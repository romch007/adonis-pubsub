declare module '@ioc:Adonis/Core/Application' {
  import { PubSubManagerContract } from '@ioc:Romch007/PubSub'

  export interface ContainerBindings {
    'Romch007/PubSub': PubSubManagerContract
  }
}
