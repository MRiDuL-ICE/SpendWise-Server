import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaClient } from '@prisma/client';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [HttpModule, AuthModule],
    controllers: [ExpenseController],
    providers: [ExpenseService, PrismaClient],
})
export class ExpenseModule { }