import { join } from 'path'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import * as sinkStatic from '@adonisjs/sink'

/**
 * Prompt choices for the mail driver selection
 */
const DRIVER_PROMPTS = [
  { name: 'mqtt' as const, message: 'MQTT' },
  { name: 'google' as const, message: 'Google PubSub' },
]

/**
 * Environment variables for available drivers
 */
const DRIVER_ENV_VALUES = {
  mqtt: {
    MQTT_HOST: 'localhost',
    MQTT_PORT: '1883',
    MQTT_USERNAME: '<username>',
    MQTT_PASSWORD: '<password>',
  },
  google: {
    GOOGLE_PROJECT_ID: '<project_id>',
  },
}

/**
 * Prompts user to select one or more mail drivers they are planning
 * to use.
 */
function getPubsubDrivers(sink: typeof sinkStatic) {
  return sink
    .getPrompt()
    .multiple('Select the pubsub drivers you are planning to use', DRIVER_PROMPTS, {
      validate(choices) {
        return choices && choices.length
          ? true
          : 'Select atleast one mail driver. You can always change it later'
      },
    })
}

/**
 * Returns the environment variables for the select drivers
 */
function getEnvValues(drivers: (keyof typeof DRIVER_ENV_VALUES)[]) {
  return drivers.reduce((values, driver) => {
    Object.assign(values, DRIVER_ENV_VALUES[driver])
    return values
  }, {})
}

/**
 * Returns absolute path to the stub relative from the templates
 * directory
 */
function getStub(...relativePaths: string[]) {
  return join(__dirname, 'templates', ...relativePaths)
}

export default async function instructions(
  projectRoot: string,
  app: ApplicationContract,
  sink: typeof sinkStatic
) {
  /**
   * Get mail drivers
   */
  const pubsubDrivers = await getPubsubDrivers(sink)

  /**
   * Create the mail config file
   */
  const configPath = app.configPath('pubsub.ts')
  const pubsubConfig = new sink.files.MustacheFile(projectRoot, configPath, getStub('config.txt'))
  pubsubConfig.overwrite = true

  pubsubConfig
    .apply({
      primaryDriver: pubsubDrivers[0],
      mqtt: pubsubDrivers.includes('mqtt'),
      google: pubsubDrivers.includes('google'),
    })
    .commit()
  const configDir = app.directoriesMap.get('config') || 'config'
  sink.logger.action('create').succeeded(`${configDir}/pubsub.ts`)

  /**
   * Create the mail contracts file
   */
  const contractsPath = app.makePath('contracts/pubsub.ts')
  const pubsubContract = new sink.files.MustacheFile(
    projectRoot,
    contractsPath,
    getStub('contract.txt')
  )
  pubsubContract.overwrite = true
  pubsubContract
    .apply({
      mqtt: pubsubDrivers.includes('mqtt'),
      goolgle: pubsubDrivers.includes('google'),
    })
    .commit()
  sink.logger.action('create').succeeded('contracts/pubsub.ts')

  /**
   * Setup .env file
   */
  const env = new sink.files.EnvFile(projectRoot)

  /**
   * Unset all existing env values as should keep the .env file clean
   */
  Object.keys(getEnvValues(['mqtt', 'google'])).forEach((key) => {
    env.unset(key)
  })

  /**
   * Then define the env values for the selected drivers
   */
  const envValues = getEnvValues(pubsubDrivers)
  Object.keys(envValues).forEach((key) => {
    env.set(key, envValues[key])
  })
  env.commit()
  sink.logger.action('update').succeeded('.env,.env.example')
}
