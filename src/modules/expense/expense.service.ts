import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto, ExpenseType } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FilterExpenseDto } from './dto/filter-expense.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExpenseService {
    constructor(private prisma: PrismaService) { }

    /**
     * Creates a new expense.
     *
     * Validates existence and ownership of the user before creating the expense.
     * If the expense type is EXPENSE and the amount is greater than 5000, sets isLarge to true.
     *
     * @param {CreateExpenseDto} createExpenseDto - The data to create the expense with.
     * @param {number} userId - The id of the user who owns the expense.
     * @returns {Promise<{ message: string, data: Expense, responseCode: number }>} - A promise that resolves to an object with the create result.
     */
    async createExpense(createExpenseDto: CreateExpenseDto, userId: number) {

        try {
            const isLarge = createExpenseDto.type === ExpenseType.EXPENSE && createExpenseDto.amount > 5000;

            const expense = await this.prisma.expense.create({
                data: {
                    ...createExpenseDto,
                    isLarge,
                    userId,
                },
            });

            return {
                success: true,
                message: 'Expense created successfully',
                data: expense,
                responseCode: 201
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                responseCode: 401
            }
        }
    }

    /**
     * Retrieves all expenses for the given user with optional filtering.
     *
     * @param {number} userId - The id of the user who owns the expenses.
     * @param {FilterExpenseDto} filters - Optional filters to apply to the query.
     * @returns {Promise<{ message: string, data: Expense[], count: number, responseCode: number }>} - A promise that resolves to an object with the fetch result.
     */
    async findAllExpenses(userId: number, filters: FilterExpenseDto) {
        try {
            const where: any = { userId };
            if (filters.type) {
                where.type = filters.type;
            }
            if (filters.category) {
                where.category = filters.category;
            }



            const expenses = await this.prisma.expense.findMany({
                where,
                orderBy: { createdAt: 'desc' },
            });

            if (expenses.length === 0) {
                // throw new NotFoundException('No expenses found');
                return {
                    message: 'No expenses found',
                    data: [],
                    count: 0
                };
            }
            return {
                success: true,
                message: 'Expenses fetched successfully',
                data: expenses,
                count: expenses.length,
                responseCode: 200
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                responseCode: 401
            }
        }
    }


    /**
     * Fetches an expense by its id.
     * 
     * @throws {NotFoundException} - If the expense is not found.
     * @throws {UnauthorizedException} - If the expense does not belong to the user.
     * 
     * @returns {Promise<{ message: string, data: Expense, responseCode: number }>} - A promise that resolves to an object with the fetched expense.
     */
    async findOneExpense(id: number, userId: number) {
        try {
            const expense = await this.prisma.expense.findUnique({
                where: { id },
            });

            if (!expense) {
                throw new NotFoundException('Expense not found');
            }
            if (expense.userId !== userId) {
                throw new UnauthorizedException('Access denied');
            }
            return {
                success: true,
                message: 'Expense fetched successfully',
                data: expense,
                responseCode: 200
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                responseCode: 401
            }
        }
    }

    /**
     * Updates an expense.
     *
     * Validates existence and ownership of the expense before updating.
     * If the expense type is EXPENSE and the amount is greater than 5000, sets isLarge to true.
     *
     * @param {number} id - The id of the expense to update.
     * @param {UpdateExpenseDto} updateExpenseDto - The data to update the expense with.
     * @param {number} userId - The id of the user who owns the expense.
     * @returns {Promise<{ message: string, data: Expense, responseCode: number }>} - A promise that resolves to an object with the update result.
     */
    async updateExpense(id: number, updateExpenseDto: UpdateExpenseDto, userId: number) {
        try {
            await this.findOneExpense(id, userId);

            const isLarge =
                updateExpenseDto.type === ExpenseType.EXPENSE &&
                updateExpenseDto.amount !== undefined &&
                updateExpenseDto.amount > 5000;


            await this.prisma.expense.update({
                where: { id },
                data: {
                    ...updateExpenseDto,
                    isLarge,
                },
            });

            return {
                success: true,
                message: 'Expense updated successfully',
                responseCode: 200
            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
                responseCode: 401
            }
        }

    }

    /**
     * Deletes an expense.
     *
     * @param {number} id - The expense id.
     * @param {number} userId - The user id.
     * @returns {Promise<{ message: string }>} - A promise that resolves to an object with the delete result.
     */

    async deleteExpense(id: number, userId: number) {
        try {
            await this.findOneExpense(id, userId);
            await this.prisma.expense.delete({ where: { id } });
            return { message: 'Expense deleted successfully' };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                responseCode: 401
            };
        }
    }



    /**
     * Calculates the summary of user's expenses.
     *
     * @param {number} userId - The user id.
     * @returns {Promise<{ totalIncome: number, totalExpense: number, balance: number, balanceStatus: string }>} - A promise that resolves to an object with the summary result.
     */

    async getSummary(userId: number) {
        try {
            const [incomeResult, expenseResult] = await Promise.all([
                this.prisma.expense.aggregate({
                    where: { userId, type: ExpenseType.INCOME },
                    _sum: { amount: true },
                }),
                this.prisma.expense.aggregate({
                    where: { userId, type: ExpenseType.EXPENSE },
                    _sum: { amount: true },
                }),
            ]);

            const totalIncome = incomeResult._sum.amount || 0;
            const totalExpense = expenseResult._sum.amount || 0;
            const balance = totalIncome - totalExpense;
            const balanceStatus = totalExpense > totalIncome ? 'Negative' : 'Positive';

            return {
                success: true,
                message: 'Summary fetched successfully',
                totalIncome,
                totalExpense,
                balance,
                balanceStatus,
                responseCode: 200,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                responseCode: 401
            }
        }
    }
}