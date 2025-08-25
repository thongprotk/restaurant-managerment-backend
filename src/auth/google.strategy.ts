import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-google-oauth20';
import { VerifiedCallback } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly authService: AuthService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['email', 'profile'],
        } as StrategyOptions);
    }

    async validate(accessToken: string, _refreshToken: string, profile: any, done: VerifiedCallback): Promise<any> {
        if (!profile || !profile.emails || !profile.name || !profile.photos) {
            throw new Error('Invalid Google profile data');
        }
        const { name, emails, photos } = profile;
        const user = {
            email: emails?.[0]?.value,
            firstName: name?.givenName,
            lastName: name?.familyName,
            picture: photos?.[0]?.value,
            accessToken,
            refreshToken: _refreshToken
        };
        const validatedUser = await this.authService.validateGoogleUser(user);
        done(null, validatedUser);
    }
}