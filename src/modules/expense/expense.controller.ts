import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FilterExpenseDto } from './dto/filter-expense.dto';
import { JwtAuthGuard } from 'src/common/guard/auth.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@Controller('expenses')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class ExpenseController {
    constructor(private expenseService: ExpenseService) { }

    @Post()
    /**
     * Creates a new expense.
     *
     * Validates existence and ownership of the user before creating the expense.
     * If the expense type is EXPENSE and the amount is greater than 5000, sets isLarge to true.
     *
     * @param {CreateExpenseDto} createExpenseDto - The data to create the expense with.
     * @param {Request} req - The request object.
     * @returns {Promise<{ message: string, data: Expense, responseCode: number }>} - A promise that resolves to an object with the create result.
     */
    @ApiResponse({ status: 201, description: 'Expense created successfully' })
    create(@Body() createExpenseDto: CreateExpenseDto, @Request() req) {
        return this.expenseService.createExpense(createExpenseDto, req.user.userId);
    }

    @Get()
    /**
     * Fetches all expenses belonging to the user.
     * 
     * @param {Request} req - The request object.
     * @param {FilterExpenseDto} filters - The filters to apply to the expenses.
     * @returns {Promise<{ message: string, data: Expense[], responseCode: number }>} - A promise that resolves to an object with the fetched expenses.
     */
    @ApiResponse({ status: 200, description: 'Expenses fetched successfully' })
    findAll(@Request() req, @Query() filters: FilterExpenseDto) {
        return this.expenseService.findAllExpenses(req.user.userId, filters);
    }

    @Patch(':id')
    /**
     * Updates an expense.
     *
     * Validates existence and ownership of the expense before updating.
     * If the expense type is EXPENSE and the amount is greater than 5000, sets isLarge to true.
     *
     * @param {string} id - The id of the expense to update.
     * @param {UpdateExpenseDto} updateExpenseDto - The data to update the expense with.
     * @param {Request} req - The request object.
     * @returns {Promise<{ message: string, data: Expense, responseCode: number }>} - A promise that resolves to an object with the update result.
     */
    @ApiResponse({ status: 200, description: 'Expense updated successfully' })
    update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto, @Request() req) {
        return this.expenseService.updateExpense(+id, updateExpenseDto, req.user.userId);
    }

    @Delete(':id')
    /**
     * Deletes an expense.
     *
     * Validates existence and ownership of the expense before deleting.
     *
     * @param {string} id - The id of the expense to delete.
     * @param {Request} req - The request object.
     * @returns {Promise<{ message: string, responseCode: number }>} - A promise that resolves to an object with the delete result.
     */
    @ApiResponse({ status: 200, description: 'Expense deleted successfully' })
    delete(@Param('id') id: string, @Request() req) {
        return this.expenseService.deleteExpense(+id, req.user.userId);
    }

    @Get('summary')
    @ApiResponse({ status: 200, description: 'Summary of expenses and income' })
    /**
     * Returns a summary of all expenses and income for the user.
     *
     * The summary includes the total income, total expenses, balance and balance status.
     *
     * @returns {Promise<{ totalIncome: number, totalExpenses: number, balance: number, balanceStatus: string }>} - A promise that resolves to an object with the summary.
     */
    getSummary(@Request() req) {
        return this.expenseService.getSummary(req.user.userId);
    }
}