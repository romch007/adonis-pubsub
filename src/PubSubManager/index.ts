/// <reference path="../../adonis-typings/pubsub.ts" />

import { Manager } from '@poppinss/manager'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

import {
  PubSubManagerContract,
  PubSubDriverContract,
  PubSubDrivers,
  PubSubDriversList,
} from '@ioc:Romch007/PubSub'

export class PubSubManager
  extends Manager<
    ApplicationContract,
    PubSubDriverContract,
    PubSubDriverContract,
    { [P in keyof PubSubDriversList]: PubSubDrivers[P]['implementation'] }
  >
  implements PubSubManagerContract {}
