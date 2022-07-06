import { EmitterContract } from '@ioc:Adonis/Core/Event'
import { FakeDriverContract, PubSubDriversList } from '@ioc:Romch007/PubSub'

export class FakeDriver implements FakeDriverContract {
  public name: 'fake' = 'fake'

  private subscribedTopics: string[]

  constructor(
    public driver: keyof PubSubDriversList,
    _config: any,
    private emitter: EmitterContract
  ) {}

  public publish(topic: string, message: Buffer): Promise<void> {
    if (this.subscribedTopics.includes(topic)) {
      return this.emitter.emit('pubsub:message', { topic, message })
    }
    return Promise.resolve()
  }

  public subscribe(topic: string): void {
    this.subscribedTopics.push(topic)
  }

  public close(): void | Promise<void> {
    this.subscribedTopics = []
  }
}
