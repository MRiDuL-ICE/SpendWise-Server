import { IsNumber, IsEnum, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExpenseType } from './create-expense.dto';

export class UpdateExpenseDto {
    @ApiProperty({
        description: 'The updated amount of money for the expense',
        example: 100.25,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    amount?: number;

    @ApiProperty({
        description: 'The updated type of the expense, either INCOME or EXPENSE',
        enum: ExpenseType,
        example: ExpenseType.INCOME,
        required: false,
    })
    @IsEnum(ExpenseType)
    @IsOptional()
    type?: ExpenseType;

    @ApiProperty({
        description: 'Updated notes or comments about the expense',
        example: 'Updated note for grocery purchase',
        required: false,
    })
    @IsString()
    @IsOptional()
    note?: string;
}