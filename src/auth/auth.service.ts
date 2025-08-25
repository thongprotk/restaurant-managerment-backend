import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import * as bcrypt from 'bcrypt';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { access } from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
    ) { }

    async signIn(identifier: string, password: string): Promise<{ accessToken: string }> {
        const user: User = await this.usersService.findOneByIdentifier(identifier);
        if (!user) {
            throw new BadRequestException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('password is incorrect');
        }
        const payload = { username: user.username, email: user.email, sub: user.id, roles: user.roles, createdAt: user.createdAt, updatedAt: user.updatedAt };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }

    async registerWithRole(username: string, email: string, password: string, roles: string[]): Promise<Partial<User>> {
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUsername = username.trim().toLowerCase();
        const existingUsername = await this.usersService.findOneByIdentifier(normalizedUsername).catch(() => undefined);
        if (existingUsername) throw new ConflictException('Username đã được đăng ký');
        const existing = await this.usersService.findOneByIdentifier(normalizedEmail).catch(() => undefined);
        if (existing) throw new ConflictException('Email đã được đăng ký');
        const createUserDto = { email: normalizedEmail, password: password, roles: roles, username: normalizedUsername };
        try {
            const user = await this.usersService.create(createUserDto);
            return user;
        } catch (err) {
            if ((err as any)?.code === '23505' || (err as any)?.errno === 1062) {
                throw new ConflictException('Email đã được đăng ký');
            }
            throw err;
        }
    }

    async validateGoogleUser(user: GoogleAuthDto) {
        try {
            let existingUser = await this.usersService.findOneByIdentifier(user.email);
            if (!existingUser) {
                await this.usersService.createGoogleUser(user);
            }
            return user;
        } catch (error) {
            throw new UnauthorizedException('Error validating Google user');
        }
    }

    async validateOrCreateGoogleUser(googleProfile: any, googleRefreshToken?: string) {
        try {
            const existingUser = await this.usersService.findOneByIdentifier(googleProfile.email).catch(() => undefined);
            if (existingUser) {
                await this.usersService.update(existingUser.id, { firstName: googleProfile.given_name || googleProfile.firstName || undefined, lastName: googleProfile.family_name || googleProfile.lastName || undefined, picture: googleProfile.picture || undefined } as any);
                return existingUser;
            }
            const created = await this.usersService.createGoogleUser({
                email: googleProfile.email,
                firstName: googleProfile.given_name || googleProfile.firstName,
                lastName: googleProfile.family_name || googleProfile.lastName,
                picture: googleProfile.picture,
                accessToken: undefined,
                refreshToken: googleRefreshToken,
            } as any);
            return created;
        } catch (error) {
            throw new UnauthorizedException('Error validating Google user');
        }
    }

    async exchangeGoogleCodeForTokens(code: string, redirectUri: string) {
        const clientId = this.config.get<string>('GOOGLE_CLIENT_ID');
        const clientSecret = this.config.get<string>('GOOGLE_CLIENT_SECRET');
        if (!clientId || !clientSecret) {
            throw new Error('Google client credentials not configured');
        }
        const params = new URLSearchParams();
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);
        params.append('code', code);
        params.append('grant_type', 'authorization_code');
        params.append('redirect_uri', redirectUri);

        const res = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
        });
        if (!res.ok) throw new Error('Failed to exchange code');
        return await res.json();
    }

    async getGoogleUserInfo(accessToken: string) {
        const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (!res.ok) throw new Error('Failed to fetch google user info');
        return await res.json();
    }

    async generateJwtForUser(user: any): Promise<{ accessToken: string, refreshToken: string, user: Partial<User> }> {
        const payload = {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            sub: user.id,
            roles: user.roles,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' });
        // hash and save refresh token
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(refreshToken, salt);
        await this.usersService.saveRefreshToken(user.id, hashed);
        return { accessToken, refreshToken, user };
    }
}
