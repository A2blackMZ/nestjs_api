/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import {ConfigModule} from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailerModule } from './mailer/mailer.module';
import { MailerService } from './mailer/mailer.service';

@Module({
  imports: [ConfigModule.forRoot({isGlobal : true}),AuthModule, PrismaModule, MailerModule],
  // controllers: [AppController],
  // providers: [AppService, MailerService],
})
export class AppModule {}
