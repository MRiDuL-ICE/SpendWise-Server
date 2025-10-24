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
   * Format the expiration time of a JWT token in a human-readable format.
   *
   * @param {any} decodedToken - The decoded JWT token.
   * @returns {Promise<string>} - A promise that resolves to a string representing the expiration time in the format of "Xh Ym".
   */
  async formatExpiryReadable(decodedToken: any) {
    const currentTime = Math.floor(Date.now() / 1000);
    const expiresIn = await decodedToken.exp - currentTime;

    if (expiresIn <= 0) return 'Token already expired';

    const hours = Math.floor(expiresIn / 3600);
    const minutes = Math.floor((expiresIn % 3600) / 60);

    return `${hours}h ${minutes}m`;
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
        expiresIn: this.formatExpiryReadable(decodedToken.exp),
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