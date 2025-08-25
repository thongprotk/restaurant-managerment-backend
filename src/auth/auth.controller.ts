import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Public } from './public.decorator';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { GoogleGuard } from './google.guard';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
@Public()
@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly config: ConfigService) { }

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async register(@Body() body: AuthRegisterDto) {
        return this.authService.registerWithRole(body.username, body.email, body.password, body.roles || ['customer']);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() body: AuthDto) {
        return this.authService.signIn(body.username, body.password);
    }

    @Get('google')
    async google(@Req() req: Request, @Res() res: Response, @Query('code') code?: string, @Query('redirectUri') redirectUri?: string) {
        try {
            const clientId = this.config.get<string>('GOOGLE_CLIENT_ID');
            const clientSecret = this.config.get<string>('GOOGLE_CLIENT_SECRET');
            const defaultRedirect = redirectUri || 'http://localhost:3001/api/auth/google';
            const accessType = 'offline';
            const scope = 'profile email';

            if (!clientId || !clientSecret) {
                return res.status(500).json({ message: 'Google client credentials not configured' });
            }

            // If no code, return Google auth url for client to redirect
            if (!code) {
                const googleAuthUrl =
                    `https://accounts.google.com/o/oauth2/v2/auth?` +
                    `client_id=${encodeURIComponent(clientId)}&` +
                    `redirect_uri=${encodeURIComponent(defaultRedirect)}&` +
                    `response_type=code&` +
                    `scope=${encodeURIComponent(scope)}&` +
                    `access_type=${accessType}&` +
                    `prompt=consent`;

                return res.status(200).json({ _url: googleAuthUrl });
            }

            // Exchange code for tokens via AuthService helper
            const tokenData: any = await this.authService.exchangeGoogleCodeForTokens(code as string, defaultRedirect);
            const googleAccessToken = tokenData.access_token;
            const googleRefreshToken = tokenData.refresh_token;

            const googleUser = await this.authService.getGoogleUserInfo(googleAccessToken);

            const user = await this.authService.validateOrCreateGoogleUser(googleUser, googleRefreshToken);
            const jwt = await this.authService.generateJwtForUser(user);

            const cookieOptions = Number(this.config.get<number>('COOKIE_MAX_AGE')) || 7 * 24 * 60 * 60 * 1000;
            res.cookie('refresh_token', jwt.refreshToken, {
                httpOnly: true,
                secure: this.config.get<string>('NODE_ENV') === 'production',
                sameSite: 'lax',
                maxAge: cookieOptions,
            });

            return res.status(200).json({ data: { access_token: jwt.accessToken } });

        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Google OAuth Error:', error);
            // eslint-disable-next-line no-console
            console.error('Error response:', (error as any).response?.data);
            // eslint-disable-next-line no-console
            console.error('Error status:', (error as any).response?.status);

            return res.status(500).json({
                message: 'Google authentication failed',
                error: (error as any).response?.data || (error as any).message
            });
        }
    }
}
