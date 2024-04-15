import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

interface RpcExceptionType extends RpcException {
  statusCode: number;
  message: string;
}

@Catch(RpcException)
export class CustomeExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcException: RpcExceptionType =
      exception.getError() as RpcExceptionType;

    if (
      typeof rpcException === 'object' &&
      exception instanceof RpcException &&
      rpcException?.statusCode
    ) {
      return response.status(rpcException.statusCode).json(rpcException);
    }
    const logger = new Logger('API Gateway');

    logger.error('rpcException', rpcException);
    response.status(400).json({
      statusCode: 400,
      message: 'Bad Request',
    });
  }
}
