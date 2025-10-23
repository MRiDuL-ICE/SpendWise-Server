import { ApiProperty } from '@nestjs/swagger';
import { ExpenseType } from './create-expense.dto';

export class ExpenseResponseDto {
    @ApiProperty({
        description: 'The unique identifier of the expense',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'The title or name of the expense',
        example: 'Grocery Shopping',
    })
    title: string;

    @ApiProperty({
        description: 'The amount of money for the expense',
        example: 7500.50,
    })
    amount: number;

    @ApiProperty({
        description: 'The category of the expense',
        example: 'FOOD',
    })
    category: string;

    @ApiProperty({
        description: 'The type of the expense, either INCOME or EXPENSE',
        enum: ExpenseType,
        example: ExpenseType.EXPENSE,
    })
    type: ExpenseType;

    @ApiProperty({
        description: 'Optional notes or comments about the expense',
        example: 'Weekly grocery purchase',
        required: false,
    })
    note?: string;

    @ApiProperty({
        description: 'Indicates if the expense is large (type is EXPENSE and amount > 5000)',
        example: true,
    })
    isLarge: boolean;

    @ApiProperty({
        description: 'The date and time the expense was created',
        example: '2025-10-22T18:26:00.000Z',
    })
    createdAt: string;

    @ApiProperty({
        description: 'The ID of the user who created the expense',
        example: 1,
    })
    userId: number;
}