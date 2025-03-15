/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { SignupDto } from './dto/signupDto';
import { ResetPasswordDemandDto } from './dto/resetPasswordDemandDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';
import { JwtService } from "@nestjs/jwt";
import { SigninDto } from './dto/signinDto';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmationDto';
import { DeleteAccountDto } from './dto/deleteAccountDto';

@Injectable()
export class AuthService {
  
  constructor (
    private readonly prismaService : PrismaService,
    private readonly mailerService : MailerService,
    private readonly jwtService : JwtService,
    private readonly configService : ConfigService,
  ) {}

  async signup(signupDto: SignupDto) {
    const {email, password, username} = signupDto;
    // ** Vérifier si l'utilisateur est déjà inscrit
    const user = await this.prismaService.user.findUnique({where : {email}})
    if(user) throw new ConflictException("User already exists"); 
    // ** Hasher le mot de passe de l'utilisateur
    const hash = await bcrypt.hash(password, 10);
    // ** Enregistrer l'utilisateur dans la base de données
    await this.prismaService.user.create({data : { email, username, password : hash },});
    // **Envoyer un email de 
    await this.mailerService.sendSignupConfirmation(email);
    // ** Retourner un message de succès
    // throw new Error('Method not implemented.');
    return { data :  "User successfuly created" };
  }

  async signin(signinDto: SigninDto) {
    const {email, password} = signinDto;
    // ** Vérifier si l'utilisateur est déjà inscrit
    const user = await this.prismaService.user.findUnique({where : {email}});
    if(!user) {
      throw new NotFoundException('User not found !')
    }
    // ** Comparer le mot de passe 
    const match = await bcrypt.compare(password, user.password);
    if(!match) throw new UnauthorizedException('Invalid credentials');
    // ** Retourner un token jwt
    const payload = {
      sub : user.userId,
      email : user.email,
    }
    const token = this.jwtService.sign(payload, {
      expiresIn : '2h',
      secret : this.configService.get("SECRET_KEY"),
    });

    return {
      token,
      user : {
        username : user.username,
        email : user.email
      }
    }
  }

  async resetPasswordDemand(resetPasswordDemandDto: ResetPasswordDemandDto) {
    const { email } = resetPasswordDemandDto;
    const user = await this.prismaService.user.findUnique({ where : {email} });
    if(!user) {
      throw new NotFoundException('User not found !')
    }
    const code = speakeasy.totp({
      secret : this.configService.get("OTP_CODE") || 'default_secret',
      digits : 5,
      step : 60 * 15,
      encoding : 'base32' 
    })
    const url = "http://localhost:3000/auth/reset-password-confirmation";
    await this.mailerService.sendResetPassword(email, url, code);
    return {data : "Resent password mail has been sent !"}
  }

  async resetPasswordConfirmation(resetPasswordConfirmationDto: ResetPasswordConfirmationDto) {
    const {code, email, password} = resetPasswordConfirmationDto;
    const user = await this.prismaService.user.findUnique({ where : {email} });
    if(!user) {
      throw new NotFoundException('User not found !')
    }
    const match = speakeasy.totp.verify({
      secret : this.configService.get("OTP_CODE") || 'default_secret',
      token : code,
      digits : 5,
      step : 60 * 15,
      encoding : "base32",
    });
    if(!match) {
      throw new UnauthorizedException('Invalid/expired token !')
    }
    const hash = await bcrypt.hash(password, 10)
    await this.prismaService.user.update({ where : {email}, data : {password : hash} });
    return {data : "Password successfuly updated !"}
  }

  async deleteAccount(userId: number, deleteAccountDto: DeleteAccountDto) {
    const { password } = deleteAccountDto;
    const user = await this.prismaService.user.findUnique({ where : {userId} });
    if(!user) {
      throw new NotFoundException('User not found !')
    }
    // ** Comparer le mot de passe
    const match = await bcrypt.compare(password, user.password);
    if(!match) {
      throw new UnauthorizedException('Invalid credentials !')
    }
    await this.prismaService.user.delete({ where : {userId} });
    return {data : "User successfuly deleted !"}
  }
}
