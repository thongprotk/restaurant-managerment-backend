import { BadRequestException, Injectable, UnauthorizedException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { GoogleAuthDto } from 'src/auth/dto/google-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    // Helper to remove sensitive fields
    private sanitize(user: Partial<User>): Partial<User> {
        const copy = { ...user } as any;
        delete copy.password;
        return copy;
    }

    // Tạo user mới
    async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
        // Hash password before saving
        if (!createUserDto.email || !createUserDto.password) {
            throw new BadRequestException('Email and password are required');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
        try {
            const existingUser = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
            if (existingUser) {
                throw new BadRequestException('Email already exists');
            }
        } catch (error) {
            throw new BadRequestException('Error checking existing user');
        }
        const user = this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
        } as any);
        const saved = await this.usersRepository.save(user as any);
        return this.sanitize(saved);
    }

    async findAll(limit = 50, offset = 0): Promise<Partial<User>[]> {
        try {
            const users = await this.usersRepository.find({ skip: offset, take: limit });
            return users.map(u => this.sanitize(u));
        } catch (err) {
            throw new BadRequestException('Error fetching users');
        }
    }

    async findOne(id: string): Promise<Partial<User>> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return this.sanitize(user);
    }

    // Cập nhật user (admin or owner should check in controller/service caller)
    async update(id: string, updateData: Partial<CreateUserDto>): Promise<Partial<User>> {
        if ((updateData as any)?.password) {
            const salt = await bcrypt.genSalt(10);
            (updateData as any).password = await bcrypt.hash((updateData as any).password, salt);
        }
        await this.usersRepository.update(id, updateData as any);
        return this.findOne(id);
    }

    // Xóa user
    async remove(id: string): Promise<void> {
        const res = await this.usersRepository.delete(id);
        if (res.affected === 0) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    }

    // Optional: get user by id including password (for admin operations)
    async findOneWithPassword(id: string): Promise<User> {
        const user = await this.usersRepository.createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.id = :id', { id })
            .getOne();
        if (!user) throw new NotFoundException(`User with id ${id} not found`);
        return user;
    }

    async findOneByIdentifier(identifier: string): Promise<User> {
        if (!identifier) {
            throw new BadRequestException('Email or username is required');
        }
        const user = await this.usersRepository.createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email OR user.username = :username', { email: identifier, username: identifier })
            .getOne();
        if (!user) {
            throw new NotFoundException(`User with identifier ${identifier} not found`);
        }
        return user;
    }

    async createGoogleUser(user: GoogleAuthDto): Promise<Partial<User>> {
        const createUserDto = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            picture: user.picture,
            roles: ['customer'],
            username: user.email.split('@')[0],
        };
        const userEntity = this.usersRepository.create(createUserDto as any);
        const saved = await this.usersRepository.save(userEntity as any);
        return this.sanitize(saved);
    }

    async saveRefreshToken(userId: string, refreshTokenHash: string) {
        await this.usersRepository.update(userId, { refreshToken: refreshTokenHash } as any);
    }
}