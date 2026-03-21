import { Body, Controller, Get, Post } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { CurrentUser, Public } from './decorators'
import {
  AuthResponseDto,
  LoginDto,
  ProfileResponseDto,
  RegisterDto,
} from './dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiOperation({ summary: 'Register a new user', operationId: 'register' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Public()
  @Post('login')
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiOperation({
    summary: 'Login and receive a JWT token',
    operationId: 'login',
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @Get('me')
  @ApiOkResponse({ type: ProfileResponseDto })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the current authenticated user',
    operationId: 'getProfile',
  })
  getProfile(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId)
  }
}
