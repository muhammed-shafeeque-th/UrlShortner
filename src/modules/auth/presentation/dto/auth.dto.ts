import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

const trimLower = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim().toLowerCase() : value;

export class RegisterDto {
  @Transform(trimLower)
  @IsEmail()
  @IsNotEmpty({message: "email is required"})
  @MaxLength(320)
  email!: string;
  
  @IsString()
  @MinLength(8)
  @IsNotEmpty({message: "password is required"})
  @MaxLength(128)
  password!: string;
}

export class LoginDto {
  @Transform(trimLower) @IsEmail() @IsNotEmpty({message: "email is required"}) @MaxLength(320) email!: string;
  @IsString() @MinLength(1) @MaxLength(128) @IsNotEmpty({message: "password is required"}) password!: string;
}
