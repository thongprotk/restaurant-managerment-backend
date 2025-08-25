import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from './constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { GoogleStrategy } from './google.strategy';
import { GoogleGuard } from './google.guard';

@Module({
    imports: [UsersModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            global: true,
            secret: JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, RolesGuard, GoogleStrategy, GoogleGuard,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        }
    ],
    exports: [AuthService]
})
export class AuthModule { }
