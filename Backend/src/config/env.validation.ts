import { Transform, plainToInstance, instanceToPlain } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  Matches,
  Max,
  Min,
  validateSync,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const ENVIRONMENTS = ['development', 'production', 'test'];

/**
 * A browser sends its origin as `scheme://host[:port]`: lowercase, no trailing
 * slash, no path, and no port when it is the default one. CORS compares the text
 * exactly, so the configured value must be written in that same canonical form.
 */
@ValidatorConstraint({ name: 'isOrigin' })
class IsOriginConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string') return false;
    try {
      return new URL(value).origin === value;
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be only the site origin, like http://localhost:3000 (lowercase, no trailing slash, no path, no default port).`;
  }
}

// class-validator runs the decorators from the bottom up, and we stop at the
// first failure, so the check closest to each property runs first.
class EnvironmentVariables {
  @IsIn(ENVIRONMENTS, {
    message: `NODE_ENV must be one of: ${ENVIRONMENTS.join(', ')}.`,
  })
  @IsNotEmpty({ message: 'NODE_ENV is required.' })
  NODE_ENV!: string;

  @Matches(/^postgres(?:ql)?:\/\/[^/]+\/[^/?#]+(?:[?#].*)?$/i, {
    message: 'DATABASE_URL must include a database name.',
  })
  @IsUrl(
    {
      protocols: ['postgres', 'postgresql'],
      require_protocol: true,
      require_tld: false,
    },
    { message: 'DATABASE_URL must be a valid PostgreSQL URL.' },
  )
  @IsString({ message: 'DATABASE_URL must be text.' })
  @IsNotEmpty({ message: 'DATABASE_URL is required.' })
  DATABASE_URL!: string;

  @Validate(IsOriginConstraint)
  @IsUrl(
    {
      protocols: ['http', 'https'],
      require_protocol: true,
      require_tld: false,
    },
    { message: 'FRONTEND_URL must be a valid HTTP or HTTPS URL.' },
  )
  @IsString({ message: 'FRONTEND_URL must be text.' })
  @IsNotEmpty({ message: 'FRONTEND_URL is required for CORS.' })
  FRONTEND_URL!: string;

  @Transform(({ value }) =>
    value === undefined || value === '' ? 4000 : Number(value),
  )
  @Max(65535, { message: 'PORT must not exceed 65535.' })
  @Min(1, { message: 'PORT must be at least 1.' })
  @IsInt({ message: 'PORT must be an integer.' })
  PORT = 4000;
}

/** Validate and transform environment variables during ConfigModule startup. */
export function validate(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const environment = plainToInstance(EnvironmentVariables, config);
  const errors = validateSync(environment, { stopAtFirstError: true });

  if (errors.length > 0) {
    const messages = errors.flatMap((error) =>
      Object.values(error.constraints ?? {}),
    );
    throw new Error(`Environment validation failed:\n${messages.join('\n')}`);
  }

  return instanceToPlain(environment);
}
