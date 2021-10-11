import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './interceptors/transform/transform.interceptor';

const PORT = process.env.PORT || 8080;
const PREFIX = process.env.PREFIX || '/';
export const IS_DEV = process.env.NODE_ENV !== 'production';

async function bootstrap() {
  const logger: Logger = new Logger('main.ts');
  console.log(IS_DEV, 'Is it a development environment');
  const app = await NestFactory.create(AppModule, {
    // Enable log level printing
    logger: IS_DEV ? ['log', 'debug', 'error', 'warn'] : ['error', 'warn'],
  });
  //Allow cross-domain requests
  app.enableCors();
  // Add prefix to request
  app.setGlobalPrefix(PREFIX);

  // Configuration api document information (not production environment configuration document)
  if (IS_DEV) {
    const options = new DocumentBuilder()
      .setTitle('Authority system management  API documentation')
      .setDescription('Authority system management  API interface documentation')
      .setBasePath(PREFIX)
      .addBearerAuth({ type: 'apiKey', in: 'header', name: 'token' })
      .setVersion('0.0.1')
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(`${PREFIX}/docs`, app, document);
    // Direct browser access http://localhost:5000/api-json
    SwaggerModule.setup('api', app, document);
  }
  // Web vulnerability
  app.use(helmet());

  // Filters for global registration errors(Error exception)
  app.useGlobalFilters(new HttpExceptionFilter());
  // Register interceptor globally(Successful return format)
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(PORT, () => {
    logger.log(
      `The service has been started, please visit for the interface: http://wwww.localhost:${PORT}/${PREFIX}`,
    );
    logger.log(
      `The service has been started, please visit the document: http://wwww.localhost:${PORT}/${PREFIX}/docs`,
    );
  });
}

bootstrap();
