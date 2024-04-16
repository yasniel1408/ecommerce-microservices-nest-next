import { Catch, ExceptionFilter, ArgumentsHost, Logger } from '@nestjs/common';
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

    const rpcException: RpcExceptionType =
      exception.getError() as RpcExceptionType;

    const logger = new Logger('API Gateway - CustomExceptionFilter');

    if (
      typeof rpcException === 'object' &&
      exception instanceof RpcException &&
      rpcException?.statusCode
    ) {
      logger.error('rpcException', rpcException);
      return response.status(rpcException.statusCode).json(rpcException);
    }

    logger.error('rpcException', rpcException);
    response.status(400).json({
      statusCode: 400,
      message: 'Bad Request',
    });
  }
}
