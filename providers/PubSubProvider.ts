import { ApplicationContract } from '@ioc:Adonis/Core/Application'

/**
 * Mail provider to register mail specific bindings
 */
export default class PubSubProvider {
  constructor(protected app: ApplicationContract) {}
  public static needsApplication = true

  /**
   * Register bindings with the container
   */
  public register() {
    this.app.container.singleton('Romch007/PubSub', () => {
      const config = this.app.container.resolveBinding('Adonis/Core/Config').get('pubsub', {})
      const { PubSubManager } = require('../src/PubSub/PubSubManager')
      return new PubSubManager(this.app, config)
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

  public async shutdown() {}
}