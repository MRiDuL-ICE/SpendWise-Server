import dotenv from 'dotenv';
dotenv.config();

export const appConfig = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    apiBaseUrl: process.env.API_BASE_URL,
    jwtSecret: (() => {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET environment variable is not defined');
        }
        return secret;
    })(),
};