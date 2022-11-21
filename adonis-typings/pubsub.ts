declare module '@ioc:Romch007/PubSub' {
  import { ManagerContract } from '@poppinss/manager'
  import { ApplicationContract } from '@ioc:Adonis/Core/Application'

  /*
  |--------------------------------------------------------------------------
  | Drivers Interface
  |--------------------------------------------------------------------------
  */

  /**
   * Shape of the driver contract. Each driver must adhere to
   * this interface
   */
  export interface PubSubDriverContract {
    publish(topic: string, message: Buffer): Promise<void>
    subscribe(topic: string): void
    close(): void | Promise<void>
  }

  /*
  |--------------------------------------------------------------------------
  | Config Helpers
  |--------------------------------------------------------------------------
  */

  /**
   * A shortcut to define `config` and `implementation` keys on the
   * `PubSubDriversList` interface. Using this type is not mandatory and
   * one can define the underlying keys by themselves.
   * For example:
   *
   * ```
   * PubSubDriverList: {
   *   iot: {
   *     config: MqttConfig,
   *     implementation: MqttDriverContract,
   *   }
   * }
   * ```
   *
   * The shortcut is
   *
   * ```
   * PubSubDriverList: {
   *   iot: PubSubDrivers['mqtt']
   * }
   * ```
   */
  export interface PubSubDrivers {
    mqtt: {
      config: MqttConfig
      implementation: MqttDriverContract
    }
    google: {
      config: GooglePubSubConfig
      implementation: GooglePubSubDriverContract
    }
    redis: {
      config: RedisConfig
      implementation: RedisDriverContract
    }
  }

  /**
   * Using declaration merging, one must extend this interface.
   * --------------------------------------------------------
   * MUST BE SET IN THE USER LAND.
   * --------------------------------------------------------
   */
  export interface PubSubDriversList {}

  /**
   * Shape of the pubsub driver config computed from the `PubSubDriversList` interface.
   * The `PubSubDriversList` is extended in the user codebase.
   */
  export type PubSubConfig = {
    pubsub: keyof PubSubDriversList
    pubsubs: { [P in keyof PubSubDriversList]: PubSubDriversList[P]['config'] }
  }

  /*
  |--------------------------------------------------------------------------
  | MQTT driver
  |--------------------------------------------------------------------------
  */

  /**
   * MQTT driver config
   */
  export type MqttConfig = {
    host: string
    port: number
    username?: string
    password?: string
  }

  /**
   * Shape of the mqtt driver
   */
  export interface MqttDriverContract extends PubSubDriverContract {
    name: 'mqtt'
  }

  /*
  |--------------------------------------------------------------------------
  | Google PubSub driver
  |--------------------------------------------------------------------------
  */

  /**
   * Google PubSub driver config
   */
  export type GooglePubSubConfig = {
    projectId: string
    subscriptionFormat: (topic: string) => string
  }

  /**
   * Shape of the Google PubSub driver
   */
  export interface GooglePubSubDriverContract extends PubSubDriverContract {
    name: 'google'
  }

  /*
  |--------------------------------------------------------------------------
  | Google PubSub driver
  |--------------------------------------------------------------------------
  */

  /**
   * Redis driver config
   */
  export type RedisConfig = {
    redisConnection: string
  }

  /**
   * Shape of the Redis driver
   */
  export interface RedisDriverContract extends PubSubDriverContract {
    name: 'redis'
  }

  /*
  |--------------------------------------------------------------------------
  | Fake driver
  |--------------------------------------------------------------------------
  */

  export interface FakeDriverContract extends PubSubDriverContract {
    name: 'fake'
    driver: keyof PubSubDriversList
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

  /*
  |--------------------------------------------------------------------------
  | Manager
  |--------------------------------------------------------------------------
  */

  export interface PubSubManagerContract
    extends ManagerContract<
        ApplicationContract,
        PubSubDriverContract,
        PubSubDriverContract,
        { [P in keyof PubSubDriversList]: PubSubDriversList[P]['implementation'] }
      >,
      Omit<PubSubDriverContract, 'name'> {
    /**
     * Access to the fake instances created so far.
     * @deprecated
     */
    fakes: Map<keyof PubSubDriversList, FakeDriverContract>

    /**
     * Fake the default or a named disk
     */
    fake(driver?: keyof PubSubDriversList | keyof PubSubDriversList[]): FakePubSubContract

    /**
     * Restore fake for the default or a named disk
     */
    restore(driver?: keyof PubSubDriversList | keyof PubSubDriversList[]): void

    /**
     * Restore all fakes
     */
    restoreAll(): void

    /**
     * Define a custom fake implementation. An instance of it
     * will be created anytime a fake is created
     */
    setFakeImplementation(callback: FakeImplementationCallback): void

    /**
     * Close driver
     */
    close(name?: string): Promise<void>

    /**
     * Close all drivers
     */
    closeAll(): Promise<void>
  }

  const PubSub: PubSubManagerContract
  export default PubSub
}
