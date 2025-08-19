import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async register(@Body() body: AuthDto) {
        return this.authService.register(body.email, body.password);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() body: AuthDto) {
        return this.authService.signIn(body.email, body.password);
    }
}
