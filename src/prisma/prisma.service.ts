/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import {PrismaClient} from '@prisma/client';
// import { config } from 'process';

@Injectable()
export class PrismaService  extends PrismaClient {
  constructor( configService : ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get("DATABASE_URL"),
        },
      },
    });
  }
}
