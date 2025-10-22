import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ExpenseType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
}

export class CreateExpenseDto {
    @ApiProperty({
        description: 'The title or name of the expense',
        example: 'Grocery Shopping',
    })
    @IsString()
    title: string;

    @ApiProperty({
        description: 'The amount of money for the expense',
        example: 75.50,
    })
    @IsNumber()
    amount: number;

    @ApiProperty({
        description: 'The category of the expense',
        example: 'FOOD',
    })
    @IsString()
    category: string;

    @ApiProperty({
        description: 'The type of the expense, either INCOME or EXPENSE',
        enum: ExpenseType,
        example: ExpenseType.EXPENSE,
    })
    @IsEnum(ExpenseType)
    type: ExpenseType;

    @ApiProperty({
        description: 'Optional notes or comments about the expense',
        example: 'Weekly grocery purchase at supermarket',
        required: false,
    })
    @IsString()
    @IsOptional()
    note?: string;
}