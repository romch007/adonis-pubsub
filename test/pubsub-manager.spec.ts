import { test } from '@japa/runner'
import { PubSubManager } from '../src/PubSubManager'

import { fs, setup } from '../test-helpers'

test.group('PubSub Manager', (group) => {
  group.each.teardown(async () => {
    await fs.cleanup()
  })

  test('return driver for a given mapping', async ({ assert }) => {
    const config = {
      pubsub: 'iot',
      pubsubs: {
        iot: {
          driver: 'mqtt',
        },
      },
    }

    const app = await setup()
    const manager = new PubSubManager(app, config as any)
    assert.equal(manager['getMappingDriver']('iot'), 'mqtt')
  })

  test('return default mapping name', async ({ assert }) => {
    const config = {
      pubsub: 'iot',
      pubsubs: {
        iot: {
          driver: 'mqtt',
        },
      },
    }

    const app = await setup()
    const manager = new PubSubManager(app, config as any)
    assert.equal(manager['getDefaultMappingName'](), 'iot')
  })

  test('return config for a mapping name', async ({ assert }) => {
    const config = {
      pubsub: 'iot',
      pubsubs: {
        iot: {
          driver: 'mqtt',
        },
      },
    }

    const app = await setup()
    const manager = new PubSubManager(app, config as any)
    assert.deepEqual(manager['getMappingConfig']('iot'), { driver: 'mqtt' })
  })
})
