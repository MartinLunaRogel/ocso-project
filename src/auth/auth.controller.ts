import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { TOKEN_NAME } from './constants/jwt.constants';
import { Response } from 'express';
import { Cookies } from './decorators/cookies.decorators';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  signup(@Body() createUserDto: CreateUserDto){
    return this.authService.registerUser(createUserDto)
    
  }

  @Post("login")
  async login(@Body() loginUserDto:LoginUserDto, @Res({passthrough: true}) response: Response, @Cookies() cookies: any){
    const token = await this.authService.loginUser(loginUserDto)
    let expireDate = new Date()
    expireDate.setDate(expireDate.getDay() + 7)
    response.cookie(TOKEN_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: expireDate,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return;
  }

  @Patch("/:email")
  updateUser(@Param('email') userEmail: string, @Body() updateUserDto:UpdateUserDto) {
    return this.authService.updateUser(userEmail, updateUserDto)
  }
}
