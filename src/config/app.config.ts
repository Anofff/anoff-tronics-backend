import { registerAs } from '@nestjs/config';

// One config namespace per concern — never one giant config object.
// This follows Interface Segregation: consumers only inject the config they need.

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  origins: process.env.ALLOWED_ORIGINS?.split(',') ?? ['http://localhost:5173'],
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
}));

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET!,
  expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
  refreshSecret: process.env.JWT_REFRESH_SECRET!,
  refreshExpiry: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  adminSecret: process.env.ADMIN_JWT_SECRET!,
}));

export const paystackConfig = registerAs('paystack', () => ({
  secretKey: process.env.PAYSTACK_SECRET_KEY!,
  publicKey: process.env.PAYSTACK_PUBLIC_KEY!,
  webhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET!,
  baseUrl: 'https://api.paystack.co',
}));

export const cloudinaryConfig = registerAs('cloudinary', () => ({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
  apiKey: process.env.CLOUDINARY_API_KEY!,
  apiSecret: process.env.CLOUDINARY_API_SECRET!,
}));
