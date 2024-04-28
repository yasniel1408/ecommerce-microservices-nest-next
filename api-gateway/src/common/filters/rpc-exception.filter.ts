import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

interface RpcExceptionType extends RpcException {
  statusCode: number;
  message: string;
}

@Catch(RpcException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcException: RpcExceptionType & { code?: string } =
      exception.getError() as RpcExceptionType & { code?: string };

    const logger = new Logger('API Gateway - CustomExceptionFilter');

    // validar si el servicio no esta disponible
    if (
      exception instanceof RpcException &&
      rpcException?.code === 'ECONNREFUSED'
    ) {
      logger.error('rpcException', rpcException);
      return response.status(500).json({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: "Service isn't available, check the connection!!!",
        code: rpcException.code,
      });
    }

    // validar si demora mucho tiempo en responder
    if (
      exception instanceof RpcException &&
      rpcException?.code === 'ETIMEDOUT'
    ) {
      logger.error('rpcException', rpcException);
      return response.status(HttpStatus.GATEWAY_TIMEOUT).json({
        statusCode: HttpStatus.GATEWAY_TIMEOUT,
        message: 'Service is taking too long to respond',
        code: rpcException.code,
      });
    }

    // errores genericos
    if (
      typeof rpcException === 'object' &&
      exception instanceof RpcException &&
      rpcException?.statusCode
    ) {
      logger.error('rpcException', rpcException);
      return response.status(rpcException.statusCode).json(rpcException);
    }

    logger.error('rpcException', rpcException);
    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Bad Request',
    });
  }
}
