import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from './constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [UsersModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            global: true,
            secret: JWT_SECRET,
            signOptions: { expiresIn: '60s' },
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule { }
