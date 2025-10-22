import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService
    , private readonly jwtService: JwtService
  ) { }

  // hashing password
  async hashPassword(password: string) {
    const hashPassword = await bcrypt.hash(password, 10)
    return hashPassword
  }

  /**
   * Registers a new user.
   *
   * @param {RegisterUserDto} registerUser - The user registration data.
   * @returns {Promise<{ success: boolean, message: string, responseCode: number }>} - A promise that resolves to an object with the registration result.
   * @throws {Error} - If the user already exists.
   */
  async registerUser(registerUser: RegisterUserDto) {

    const isExists = await this.prisma.user.count({
      where: {
        email: registerUser.email
      }
    })

    if (isExists > 0) {
      throw new Error('User already exists')
    }

    const user = await this.prisma.user.create({
      data: {
        name: registerUser.name,
        email: registerUser.email,
        password: await this.hashPassword(registerUser.password)
      }
    })

    return {
      success: true,
      message: 'User registered successfully',
      responseCode: 201,
    }
  }


  /**
   * Registers a new user.
   *
   * @param {LoginUserDto} loginUser - The user registration data.
   * @returns {Promise<{ success: boolean, message: string, accessToken: string, responseCode: number }>} - A promise that resolves to an object with the registration result.
   * @throws {Error} - If the user credentials are invalid.
   */
  async loginUser(loginUser: LoginUserDto) {

    const user = await this.prisma.user.findUnique({
      where: {
        email: loginUser.email
      }
    })

    if (!user) {
      return {
        success: false,
        message: 'invalid credentials',
        responseCode: 401
      }
      throw new Error('User not found')
    }

    const isPasswordMatch = await bcrypt.compare(loginUser.password, user.password);

    if (!isPasswordMatch) {
      return {
        success: false,
        message: 'invalid credentials',
        responseCode: 401
      }
      throw new Error('Invalid credentials')
    }

    const payload = { sub: user.id, email: user.email };

    return {
      success: true,
      message: 'User logged in successfully',
      accessToken: this.jwtService.sign(payload),
      responseCode: 200,
    }
  }

}