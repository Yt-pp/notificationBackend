import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsOptional() // Makes the field optional
    @IsEmail() // Validates that the input is a valid email
    email?: string;

    @IsOptional()
    @IsString() // Ensures that the value is a string
    name?: string;

    @IsOptional()
    @IsString()
    group?: string;

    @IsOptional()
    @IsString()
    role?: string; // You might consider using an enum for roles
}
