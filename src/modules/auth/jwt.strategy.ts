import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaClient } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { appConfig } from 'src/config/app.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private prisma: PrismaClient) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: appConfig.jwtSecret,
        });
    }

    async validate(payload: { sub: number; email: string }) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });
        if (!user) {
            return null;
        }
        return { userId: payload.sub, email: payload.email };
    }
}