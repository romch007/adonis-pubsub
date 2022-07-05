/// <reference path="../../adonis-typings/pubsub.ts" />
import { Manager } from '@poppinss/manager'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

import {
  PubSubDriversList,
  PubSubManagerContract,
  PubSubDriverContract,
} from '@ioc:Romch007/PubSub'

export abstract class PubSubManager
  extends Manager<
    ApplicationContract,
    PubSubDriverContract,
    PubSubDriverContract,
    { [P in keyof PubSubDriversList]: PubSubDriversList[P]['implementation'] }
  >
  implements PubSubManagerContract
{
  public publish(topic: string, message: Buffer): Promise<void> {
    return this.use().publish(topic, message)
  }
  public subscribe(topic: string): void {
    return this.use().subscribe(topic)
  }
}
