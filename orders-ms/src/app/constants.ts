export const NATS_SERVICE = 'NATS_SERVICE';

export const natsOptions = {
  name: 'ecommerce.com',
  //queue: 'orders-ms-queue', // nombre de la cola
  maxPingOut: 5, // número máximo de pings salientes
  debug: true, // no usar en producción
  maxReconnectAttempts: -1, // intentar reconectar indefinidamente
  // reconnect: true, // reconectar
  verbose: true,
  reconnectTimeWait: 500, // tiempo de espera entre reconexiones
  // reconnectJitter: 1000, // tiempo de espera entre reconexiones
  // preserveBuffers: true, // preservar buffers
  // json: true, // enviar y recibir mensajes en formato JSON
  timeout: 10000, // tiempo de espera para una respuesta
  waitOnFirstConnect: true,
  queue: 'orders-ms-queue',
};
