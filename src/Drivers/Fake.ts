// import { FakeDriverContract, PubSubDriversList } from '@ioc:Romch007/PubSub'

// export class FakeDriver implements FakeDriverContract {
//   public name: 'fake' = 'fake'

//   private subscribedTopics: string[]

//   constructor(public driver: keyof PubSubDriversList, private config: any) {}

//   public publish(topic: string, message: Buffer): Promise<void> {
//     return Promise.resolve()
//   }
//   public subscribe(topic: string): void {
//     this.subscribedTopics.push(topic)
//   }
// }
