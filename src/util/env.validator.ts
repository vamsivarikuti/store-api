import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export enum EnvVars {
  NODE_ENV = 'NODE_ENV',
  MONGO_URL = 'MONGO_URL',
  DB_NAME = 'DB_NAME',
  JWT_SECRET = 'JWT_SECRET',
  ACCESS_TOKEN_VALIDITY_IN_SEC = 'ACCESS_TOKEN_VALIDITY_IN_SEC',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  [EnvVars.NODE_ENV]: Environment;

  @IsString()
  [EnvVars.MONGO_URL]: string;

  @IsString()
  [EnvVars.DB_NAME]: string;

  @IsString()
  [EnvVars.JWT_SECRET]: string;

  @IsNumber()
  [EnvVars.ACCESS_TOKEN_VALIDITY_IN_SEC]: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
