/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Controller, Post } from '@nestjs/common';
import { Body, Delete, Req, UseGuards } from '@nestjs/common/decorators';
import { SignupDto } from './dto/signupDto';
import { SigninDto } from './dto/signinDto';
import { ResetPasswordDemandDto } from './dto/resetPasswordDemandDto';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmationDto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DeleteAccountDto } from './dto/deleteAccountDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService : AuthService) {}
  @Post("signup")
  signup(@Body() signupDto : SignupDto) {
    return this.authService.signup(signupDto);
  }
  @Post("signin")
  signin(@Body() signinDto : SigninDto) {
    return this.authService.signin(signinDto);
  }
  @Post("reset-password")
  resetPasswordDemand(@Body() resetPasswordDemandDto : ResetPasswordDemandDto) {
    return this.authService.resetPasswordDemand(resetPasswordDemandDto);
  }

  @Post("reset-password-confirmation")
  resetPasswordConfiguration(@Body() resetPasswordConfirmationDto : ResetPasswordConfirmationDto) {
    return this.authService.resetPasswordConfirmation(resetPasswordConfirmationDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("delete")
  deleteAccount(@Req() request : Request, @Body() deleteAccountDto : DeleteAccountDto) {
    if (!request.user) {
      throw new Error('User not found in request');
    }
    const userId = request.user["userId"];
    return this.authService.deleteAccount(userId, deleteAccountDto);
  }
}
