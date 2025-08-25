import { IsNotEmpty, IsString, MinLength, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate } from "class-validator";

@ValidatorConstraint({ name: 'isEmailOrUsername', async: false })
class IsEmailOrUsernameConstraint implements ValidatorConstraintInterface {
    validate(value: any, _args: ValidationArguments) {
        if (typeof value !== 'string' || !value.trim()) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const usernameRegex = /^[a-zA-Z0-9._-]{3,}$/;
        return emailRegex.test(value) || usernameRegex.test(value);
    }

    defaultMessage(_args: ValidationArguments) {
        return 'Identifier must be a valid email or username (letters, numbers, . _ - , min 3 chars)';
    }
}

export class AuthDto {
    @IsNotEmpty({ message: 'Username or email is required' })
    @Validate(IsEmailOrUsernameConstraint)
    username: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}