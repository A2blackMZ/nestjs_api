/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsEmail} from "class-validator" 
export class ResetPasswordDemandDto {
  
  @IsEmail()
  readonly email : string;
  // @IsNotEmpty()
  // readonly password : string;

}