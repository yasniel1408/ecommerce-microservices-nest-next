import { UseInterceptors } from '@nestjs/common';
import { ErrorInterceptor } from '../interceptors/erros.interceptor';

export function ValidateErrors(): MethodDecorator & ClassDecorator {
  return UseInterceptors(new ErrorInterceptor());
}
