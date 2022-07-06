import { ApplicationContract } from '@ioc:Adonis/Core/Application'

/**
 * Pubsub provider to register pubsub specific bindings
 */
export default class PubSubProvider {
  constructor(protected app: ApplicationContract) {}
  public static needsApplication = true

  /**
   * Register bindings with the container
   */
  public register() {
    this.app.container.singleton('Romch007/PubSub', () => {
      const { PubSubManager } = require('../src/PubSubManager')
      const Config = this.app.container.resolveBinding('Adonis/Core/Config')
      return new PubSubManager(this.app, Config.get('pubsub'))
    })
  }

  /**
   * Setup REPL bindings
   */
  // public boot() {
  //   if (this.app.environment !== 'repl') {
  //     return
  //   }

  //   this.app.container.withBindings(['Adonis/Addons/Repl'], (Repl) => {
  //     const { defineReplBindings } = require('../src/Bindings/Repl')
  //     defineReplBindings(this.app, Repl)
  //   })
  // }

  public async shutdown() {
    await this.app.container.resolveBinding('Romch007/PubSub').closeAll()
  }
}
