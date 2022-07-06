# adonis-pubsub
> PubSub provider for AdonisJS

[![npm-image]][npm-url] [![license-image]][license-url] [![typescript-image]][typescript-url]

PubSub provider for AdonisJS

Supported brokers:
- MQTT
- Google PubSub
- Redis

## Installation

```
npm install --save adonis-pubsub
```
Configuration:
```
node ace configure adonis-pubsub
```
## Per driver configuration
- ### MQTT configuration
```
npm install --save async-mqtt
```
- ### Google PubSub configuration
```
npm install --save @google-cloud/pubsub
```
- ### Redis configuration

Please configure `@adonisjs/redis` ([docs](https://docs.adonisjs.com/guides/redis)) package and set the appropriate redis connection name in `config/pubsub.ts`

## Usage

```ts
import Event from '@ioc:Adonis/Core/Event'
import Logger from '@ioc:Adonis/Core/Logger'
import PubSub from '@ioc:Romch007/PubSub'

// Subscribe to topic and listen for message
PubSub.subscribe('example')
Event.on('pubsub:message', ({ topic, message }) => {
  Logger.info(`Message from ${topic}: ${message.toString()}`)
})

// Publish message to topic
await PubSub.publish('example', Buffer.from('message data'))
```

[github-actions-image]: https://github.com/adonis-pubsub/actions/workflows/test.yml
[github-actions-url]: https://img.shields.io/github/workflow/status/adonis-pubsub/test?style=for-the-badge "github-actions"

[npm-image]: https://img.shields.io/npm/v/adonis-pubsub.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/adonis-pubsub "npm"

[license-image]: https://img.shields.io/npm/l/adonis-pubsub?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md "license"

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]:  "typescript"
