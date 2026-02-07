import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../prisma/prisma.service.js'
import { RegisterDto } from './dto/register.dto.js'
import { LoginDto } from './dto/login.dto.js'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (existing) {
      throw new ConflictException('Email already in use')
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10)

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
    })

    const token = this.generateToken(user.id, user.email)

    return {
      accessToken: token,
      user: { id: user.id, email: user.email, name: user.name },
    }
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password)

    const token = this.generateToken(user.id, user.email)

    return {
      accessToken: token,
      user: { id: user.id, email: user.email, name: user.name },
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return user
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        userRoles: { include: { role: true } },
        userPermissions: { include: { permission: true } },
      },
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user
    return result
  }

  private generateToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email })
  }
}
