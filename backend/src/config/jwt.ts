import { env } from './env';

export const jwtConfig = {
  accessToken: {
    secret: env.JWT_SECRET,
    expiresIn: '15m' as const,
  },
  refreshToken: {
    secret: env.JWT_REFRESH_SECRET,
    expiresIn: '7d' as const,
  },
};
