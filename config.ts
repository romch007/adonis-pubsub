import { PubSubDrivers } from '@ioc:Romch007/PubSub'

type PubSubConfig = {
  pubsubs: {
    [name: string]: {
      [K in keyof PubSubDrivers]: PubSubDrivers[K]['config'] & { driver: K }
    }[keyof PubSubDrivers]
  }
}

export function pubsubConfig<T extends PubSubConfig & { pubsub: keyof T['pubsubs'] }>(
  config: T
): T {
  return config
}

export type InferPubSubFromConfig<T extends PubSubConfig> = {
  [K in keyof T['pubsubs']]: PubSubDrivers[T['pubsubs'][K]['driver']]
}
