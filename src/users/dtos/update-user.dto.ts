import { IsEmail, IsString, IsOptional } from "class-validator";

export class updateUserDto {

    @IsString()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    password: string;
}