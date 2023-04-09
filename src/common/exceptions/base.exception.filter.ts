import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 非 HTTP 标准异常的处理。
    const status = exception.getStatus();
    response.status(status).send({
      status,
      timestamp: new Date().toISOString(),
      path: request.url,
      data: exception.message,
      message: 'fail',
    });
  }
}
