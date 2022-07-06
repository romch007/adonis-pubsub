import { test } from '@japa/runner'
import { PubSubManager } from '../src/PubSubManager'
import { fs, setup } from '../test-helpers'

test.group('Mail Provider', (group) => {
  group.each.teardown(async () => {
    await fs.cleanup()
  })

  test('register pubsub provider', async ({ assert }) => {
    const app = await setup('web', {
      pubsub: 'mqtt',
      pubsubs: {
        mqtt: {},
      },
    })
    assert.instanceOf(app.container.resolveBinding('Romch007/PubSub'), PubSubManager)
    assert.deepEqual(app.container.resolveBinding('Romch007/PubSub')['application'], app)
    assert.deepEqual(
      app.container.resolveBinding('Romch007/PubSub'),
      app.container.resolveBinding('Romch007/PubSub')
    )
  })
})
