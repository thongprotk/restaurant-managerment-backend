import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    // Tạo user mới
    async create(createUserDto: CreateUserDto): Promise<User> {
        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
        const user = this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });
        return await this.usersRepository.save(user);
    }

    // Lấy tất cả users
    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    // Lấy user theo ID
    async findOne(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        return user;
    }

    // Cập nhật user
    async update(id: number, updateData: Partial<CreateUserDto>): Promise<User> {
        await this.usersRepository.update(id, updateData);
        return this.findOne(id);
    }

    // Xóa user
    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
    async findOneByUsername(username: string): Promise<User> {
        if (!username) {
            throw new Error('Username is required');
        }
        const user = await this.usersRepository.findOne({ where: { email: username } });
        if (!user) {
            throw new Error(`User with email ${username} not found`);
        }
        return user;
    }
}