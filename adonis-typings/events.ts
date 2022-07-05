declare module '@ioc:Adonis/Core/Event' {
  interface EventsList {
    'pubsub:message': { topic: string; message: Buffer }
  }
}
