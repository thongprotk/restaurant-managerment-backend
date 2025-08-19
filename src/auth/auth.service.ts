import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }
    async signIn(email: string, password: string): Promise<{ accessToken: string }> {
        const user: User = await this.usersService.findOneByUsername(email);
        if (!user) {
            throw new BadRequestException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('password is incorrect');
        }
        const payload = { email: user.email, sub: user.id, createdAt: user.createdAt, updatedAt: user.updatedAt };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }
    async register(email: string, password: string): Promise<User> {
        const normalizedEmail = email.trim().toLowerCase();
        const existing = await this.usersService.findOneByUsername(normalizedEmail).catch(() => undefined);
        if (existing) throw new ConflictException('Email đã được đăng ký');
        const createUserDto = { email: normalizedEmail, password: password };
        try {
            const user = await this.usersService.create(createUserDto);
            delete (user as any).password;
            return user;
        } catch (err) {
            if ((err as any)?.code === '23505' || (err as any)?.errno === 1062) {
                throw new ConflictException('Email đã được đăng ký');
            }
            throw err;
        }
    }
}
