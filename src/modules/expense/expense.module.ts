import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    imports: [HttpModule, AuthModule],
    controllers: [ExpenseController],
    providers: [ExpenseService, PrismaService],
})
export class ExpenseModule { }