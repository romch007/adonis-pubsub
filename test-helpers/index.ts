import { join } from 'path'
import { Filesystem } from '@poppinss/dev-utils'
import { Application } from '@adonisjs/application'

export const fs = new Filesystem(join(__dirname, '__app'))

export async function setupApp(providers?: string[]) {
  const app = new Application(fs.basePath, 'web', {
    providers: ['@adonisjs/encryption', '@adonisjs/http-server'].concat(providers ?? []),
  })
  await fs.add('.env', '')
  await fs.add(
    'config/app.ts',
    `
    export const appKey = 'verylongandrandom32charsecretkey'
    export const http = {
      trustProxy: () => true,
      cookie: {},
    }
  `
  )

  await app.setup()
  await app.registerProviders()
  await app.bootProviders()
}
