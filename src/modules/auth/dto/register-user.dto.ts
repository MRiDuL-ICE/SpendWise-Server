import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class RegisterUserDto {
    @ApiProperty({
        description: 'user Name',
        example: 'John Doe'
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'user Email',
        example: 'your@example.com'
    })
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'user Password',
        example: '11111#$'
    })
    @IsNotEmpty()
    @Length(8, 20)
    password: string;
}