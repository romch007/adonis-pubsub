/// <reference path="../../adonis-typings/pubsub.ts" />

import { EmitterContract } from '@ioc:Adonis/Core/Event'
import { RedisConfig, RedisDriverContract } from '@ioc:Romch007/PubSub'
import {
  RedisManagerContract,
  RedisConnectionContract,
  RedisClusterConnectionContract,
} from '@ioc:Adonis/Addons/Redis'
import { Exception } from '@poppinss/utils'

export class RedisDriver implements RedisDriverContract {
  public name: 'redis' = 'redis'

  /**
   * Custom connection or query client
   */
  private connection?: string | RedisConnectionContract | RedisClusterConnectionContract

  constructor(
    private config: RedisConfig,
    private emitter: EmitterContract,
    private redis: RedisManagerContract
  ) {}

  /**
   * Returns the singleton instance of the redis connection
   */
  private getRedisConnection(): RedisConnectionContract | RedisClusterConnectionContract {
    /**
     * Use custom connection if defined
     */
    if (this.connection) {
      return typeof this.connection === 'string'
        ? this.redis.connection(this.connection)
        : this.connection
    }

    /**
     * Config must have a connection defined
     */
    if (!this.config.redisConnection) {
      throw new Exception(
        'Missing "redisConnection" property for auth redis provider inside "config/pubsub" file',
        500,
        'E_INVALID_AUTH_REDIS_CONFIG'
      )
    }

    return this.redis.connection(this.config.redisConnection)
  }

  /**
   * Define custom connection
   */
  public setConnection(
    connection: string | RedisConnectionContract | RedisClusterConnectionContract
  ): this {
    this.connection = connection
    return this
  }

  public async publish(topic: string, message: Buffer): Promise<void> {
    await this.getRedisConnection().publish(topic, message.toString())
  }

  public subscribe(topic: string): void {
    this.getRedisConnection().subscribe(topic, (message) => {
      this.emitter.emit('pubsub:message', { topic, message: Buffer.from(message) })
    })
  }

  public close(): void | Promise<void> {
    return this.getRedisConnection().disconnect()
  }
}
