import { test } from '@japa/runner'
import dotenv from 'dotenv'
import { join } from 'path'

import { MqttDriver } from '../src/Drivers/Mqtt'
import { fs, setup } from '../test-helpers'

test.group('Mqtt drier', (group) => {
  group.setup(() => {
    dotenv.config({ path: join(__dirname, '..', '.env') })
  })

  group.each.teardown(async () => {
    await fs.cleanup()
  })

  test('publish using mqtt driver', async ({ assert }) => {
    assert.plan(1)
    const app = await setup()
    const emitter = app.container.resolveBinding('Adonis/Core/Event')
    const mqtt = new MqttDriver(
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
    await mqtt.publish(topic, message)
    emitter.on('pubsub:message', ({ topic: receivedTopic, message: receivedMessage }) => {
      assert.equal(topic, receivedTopic)
      assert.equal(message, receivedMessage)
    })
  }).skip()
})
