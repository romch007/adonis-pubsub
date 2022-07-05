import { PubSubDriversList } from '@ioc:Romch007/PubSub'

type PubSubConfig = {
  pubsubs: {
    [name: string]: {
      [K in keyof PubSubDriversList]: PubSubDriversList[K]['config'] & { driver: K }
    }[keyof PubSubDriversList]
  }
}

export function pubsubConfig<T extends PubSubConfig & { pubsub: keyof T['pubsubs'] }>(
  config: T
): T {
  return config
}

export type InferPubSubFromConfig<T extends PubSubConfig> = {
  [K in keyof T['pubsubs']]: PubSubDriversList[T['pubsubs'][K]['driver']]
}
