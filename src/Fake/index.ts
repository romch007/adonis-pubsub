import { FakeDriverContract, PubSubDriversList, FakePubSubContract } from '@ioc:Romch007/PubSub'

export class FakePubSub implements FakePubSubContract {
  public fakes: Map<keyof PubSubDriversList, FakeDriverContract> = new Map()

  public use(driver: keyof PubSubDriversList): FakeDriverContract {
    return this.fakes.get(driver)!
  }

  public isFaked(driver: keyof PubSubDriversList): boolean {
    return this.fakes.has(driver)
  }

  public restore(driver: keyof PubSubDriversList): void {
    this.fakes.delete(driver)
  }
}
