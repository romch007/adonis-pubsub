import { test } from '@japa/runner'
import dotenv from 'dotenv'
import { join } from 'path'

import { MqttDriver } from '../src/Drivers/Mqtt'
import { fs, setup, wait } from '../test-helpers'

let mqtt: MqttDriver

test.group('Mqtt driver', (group) => {
  group.setup(() => {
    dotenv.config({ path: join(__dirname, '..', '.env') })
  })

  group.each.teardown(async () => {
    await mqtt.close()
    await fs.cleanup()
  })

  test('publish and subscribe using mqtt driver', async ({ assert }, done) => {
    const app = await setup()
    const emitter = app.container.resolveBinding('Adonis/Core/Event')
    mqtt = new MqttDriver(
      {
        host: process.env.MQTT_HOST!,
        port: Number(process.env.MQTT_PORT!),
        username: process.env.MQTT_USERNAME!,
        password: process.env.MQTT_PASSWORD!,
      },
      emitter
    )
    const topic = 'test'
    const message = Buffer.from('fazefazef')

    mqtt.subscribe(topic)
    emitter.on('pubsub:message', ({ topic: receivedTopic, message: receivedMessage }) => {
      assert.equal(topic, receivedTopic)
      assert.isTrue(message.equals(receivedMessage))
      done()
    })

    await wait(200)

    await mqtt.publish(topic, message)
  }).waitForDone()
})
