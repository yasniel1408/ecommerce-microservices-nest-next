import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseDomainError } from 'src/products/domain/errors/base-domain.error';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // puedo agregar verificaciones especificas para cada tipo de error
        if (error instanceof BaseDomainError) {
          return throwError(
            // new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
            new RpcException({
              message: error.message,
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            }),
          );
        }
        return throwError(error);
      }),
    );
  }
}
