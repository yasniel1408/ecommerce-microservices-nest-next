import { UseInterceptors } from '@nestjs/common';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';

export function ValidateResponseDto(dto): MethodDecorator & ClassDecorator {
  return UseInterceptors(new SerializeInterceptor(dto));
}
