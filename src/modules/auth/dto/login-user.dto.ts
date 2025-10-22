import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginUserDto {
    @ApiProperty({
        description: 'user Email',
        example: 'your@example.com'
    })
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'user password',
        example: '11111#$'
    })
    @IsNotEmpty()
    password: string;
}