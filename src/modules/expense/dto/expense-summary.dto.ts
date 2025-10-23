import { ApiProperty } from '@nestjs/swagger';

export class ExpenseSummaryDto {
    @ApiProperty({
        description: 'Total amount of all INCOME transactions for the user',
        example: 12000,
    })
    totalIncome: number;

    @ApiProperty({
        description: 'Total amount of all EXPENSE transactions for the user',
        example: 14500,
    })
    totalExpense: number;

    @ApiProperty({
        description: 'Balance calculated as totalIncome - totalExpense',
        example: -2500,
    })
    balance: number;

    @ApiProperty({
        description: 'Status of the balance: Negative if totalExpense > totalIncome, otherwise Positive',
        example: 'Negative',
    })
    balanceStatus: string;
}