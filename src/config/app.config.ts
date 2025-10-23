if (process.env.NODE_ENV !== 'production') {
    import('dotenv').then((dotenv) => dotenv.config());
}

export const appConfig = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    apiBaseUrl: process.env.API_BASE_URL,
    jwtSecret: process.env.JWT_SECRET || '65361bc75c80b552aadda7543982a9be88321e882ae502d4efc97e22695e7ba3',
};