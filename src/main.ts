import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { AppConfigService } from "./config/config.service";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(AppConfigService);

  const trustProxy = config.trustPolicy;
  if (trustProxy) {
    app.set(
      "trust proxy",
      trustProxy
        ? true
        : /^\d+$/.test(trustProxy)
          ? Number(trustProxy)
          : trustProxy,
    );
  }

  app.use(helmet());
  app.use(cookieParser());
  const origins = config.corsOrigins ?? [];
  app.enableCors({
    origin: origins.length ? origins : false,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableShutdownHooks();

  const port = config.port;
  await app.listen(port);
  new Logger("Bootstrap").log(`Listening on :${port}`);
}
bootstrap();
