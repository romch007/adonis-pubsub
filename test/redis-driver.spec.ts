import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { test } from '@japa/runner'
import dotenv from 'dotenv'
import { join } from 'path'

import { RedisDriver } from '../src/Drivers/Redis'
import { fs, setup, wait } from '../test-helpers'

let app: ApplicationContract

test.group('Redis driver', (group) => {
  group.setup(() => {
    dotenv.config({ path: join(__dirname, '..', 'env') })
  })

  group.each.teardown(async () => {
    await fs.cleanup()
    await app.container.use('Adonis/Addons/Redis').flushdb()
    await app.container.use('Adonis/Addons/Redis').quit()
  })

  test('publish using redis driver', async ({ assert }, done) => {
    app = await setup()

    const emitter = app.container.use('Adonis/Core/Event')
    const redis = app.container.use('Adonis/Addons/Redis')
    const redisDriver = new RedisDriver(
      {
        redisConnection: 'local',
      },
      emitter,
      redis
    )

    const topic = 'example'
    const message = Buffer.from('amessage')

    redis.subscribe(topic, (receivedMessage) => {
      assert.equal(message.toString(), receivedMessage)
      done()
    })

    await wait(200)

    await redisDriver.publish(topic, message)
  }).waitForDone()

  test('subscribe using redis drive', async ({ assert }, done) => {
    app = await setup()

    const emitter = app.container.use('Adonis/Core/Event')
    const redis = app.container.use('Adonis/Addons/Redis')
    const redisDriver = new RedisDriver(
      {
        redisConnection: 'local',
      },
      emitter,
      redis
    )

    const topic = 'example'
    const message = Buffer.from('amessage')

    redisDriver.subscribe(topic)
    emitter.on('pubsub:message', ({ topic: receivedTopic, message: receivedMessage }) => {
      assert.equal(topic, receivedTopic)
      assert.equal(message, receivedMessage.toString())
      done()
    })

    await wait(200)

    await redis.publish(topic, message.toString())
  }).waitForDone()
})
