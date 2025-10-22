import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { appConfig } from "src/config/app.config";
import { AuthService } from "./auth.service";
import { PrismaClient } from "@prisma/client";
import { JwtStrategy } from "./jwt.strategy";

@Module({
    imports: [
        HttpModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            global: true,
            secret: appConfig.jwtSecret,
            signOptions: { expiresIn: '1h' }
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, PrismaClient, JwtStrategy],
    exports: [PassportModule, JwtModule],
})
export class AuthModule { }
