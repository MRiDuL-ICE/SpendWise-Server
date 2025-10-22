import { IsEnum, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExpenseType } from './create-expense.dto';

export class FilterExpenseDto {
    @ApiProperty({
        description: 'Filter expenses by type, either INCOME or EXPENSE',
        enum: ExpenseType,
        example: ExpenseType.EXPENSE,
        required: false,
    })
    @IsEnum(ExpenseType)
    @IsOptional()
    type?: ExpenseType;

    @ApiProperty({
        description: 'Filter expenses by category',
        example: 'TRAVEL',
        required: false,
    })
    @IsString()
    @IsOptional()
    category?: string;
}