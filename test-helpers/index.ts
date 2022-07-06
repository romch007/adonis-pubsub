import { join } from 'path'
import { Filesystem } from '@poppinss/dev-utils'
import { Application } from '@adonisjs/core/build/standalone'

export const fs = new Filesystem(join(__dirname, 'app'))

export async function setup(environment: 'web' | 'repl' = 'web', pubsubConfig?: any) {
  await fs.add('.env', '')
  await fs.add(
    'config/app.ts',
    `
		export const appKey = 'averylong32charsrandomsecretkey',
		export const http = {
			cookie: {},
			trustProxy: () => true,
		}
	`
  )

  await fs.add(
    'config/redis.ts',
    `
    const redisConfig = {
      connection: 'local',
      connections: {
        local: {}
      }
    }
    export default redisConfig
  `
  )

  await fs.add(
    'config/pubsub.ts',
    `
		const pubsubConfig = ${JSON.stringify(pubsubConfig || {}, null, 2)}
		export default pubsubConfig
	`
  )

  const app = new Application(fs.basePath, environment, {
    providers: ['@adonisjs/core', '@adonisjs/redis', '../../providers/PubSubProvider'],
  })

  await app.setup()
  await app.registerProviders()
  await app.bootProviders()

  return app
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
