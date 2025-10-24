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

  /**
   * Hashes a given password using bcrypt.
   * @param {string} password - The password to hash.
   * @returns {Promise<string>} - A promise that resolves to the hashed password.
   */
  async hashPassword(password: string) {
    const hashPassword = await bcrypt.hash(password, 10)
    return hashPassword
  }

  /**
   * Formats the expiration time in hours given a decoded JWT token.
   * 
   * @param {any} decodedToken - The decoded JWT token.
   * @returns {Promise<string>} - A promise that resolves to the formatted expiration time in hours.
   */
  async formatExpiryInHours(decodedToken: any) {

    const exp = typeof decodedToken === 'number'
      ? decodedToken
      : decodedToken?.exp;

    if (!exp) return 'No expiration found';

    const currentTime = Math.floor(Date.now() / 1000);
    const expiresInSeconds = await exp - currentTime;

    if (expiresInSeconds <= 0) return 'Token already expired';

    const hours = (expiresInSeconds / 3600).toFixed(2);
    return `${hours} hours`;
  }




  /**
   * Registers a new user.
   *
   * @param {RegisterUserDto} registerUser - The user registration data.
   * @returns {Promise<{ success: boolean, message: string, responseCode: number }>} - A promise that resolves to an object with the registration result.
   * @throws {Error} - If the user already exists.
   */
  async registerUser(registerUser: RegisterUserDto) {

    try {
      const isExists = await this.prisma.user.count({
        where: {
          email: registerUser.email
        }
      })

      if (isExists > 0) {
        throw new Error('User already exists')
      }

      await this.prisma.user.create({
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
    } catch (error) {
      return {
        success: false,
        message: error.message,
        responseCode: 401
      }
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

    try {
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
      }

      const isPasswordMatch = await bcrypt.compare(loginUser.password, user.password);

      if (!isPasswordMatch) {
        return {
          success: false,
          message: 'invalid credentials',
          responseCode: 401
        }
      }

      const payload = { sub: user.id, email: user.email };

      const token = this.jwtService.sign(payload);
      const decodedToken = this.jwtService.decode(token);

      return {
        success: true,
        message: 'User logged in successfully',
        accessToken: token,
        expiresIn: await this.formatExpiryInHours(decodedToken.exp),
        responseCode: 200,
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        responseCode: 401
      }
    }
  }

}