import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/exceptions/base.exception.filter';
import { HttpExceptionFilter } from './common/exceptions/http.exception.filter';
import { generateDocument } from './doc';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { RoleGuard } from './guards/role.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(
    session({
      secret: 'tqt_ams_server',
      name: 'roletang_id',
      // 最长一天
      cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
      resave: false,
      saveUninitialized: true,
    }),
  );
  // 全局返回格式
  app.useGlobalInterceptors(new TransformInterceptor());
  // 异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());
  // validate 参数格式 => dto 校验
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new RoleGuard());
  generateDocument(app);
  await app.listen(3000);
}
bootstrap();
