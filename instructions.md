The package has been configured successfully. The configuration for PubSub relies on certain environment variables and it is usually a good practice to validate the presence of those environment variables.

Open the `env.ts` file and define validate the environment variables based upon the drivers you are using

### Variables for the MQTT driver

```ts
MQTT_HOST: Env.schema.string({ format: 'host' }),
MQTT_PORT: Env.schema.number(),
MQTT_USERNAME: Env.schema.string(),
MQTT_PASSWORD: Env.schema.string(),
```

### Variables for the Google PubSub driver

```ts
GOOGLE_PROJECT_ID: Env.schema.string(),
```
