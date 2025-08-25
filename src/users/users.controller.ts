import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, ParseIntPipe, Req, Query, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @Roles('admin')
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @Roles('admin')
    findAll(@Query('limit') limit = '50', @Query('offset') offset = '0') {
        const l = Number(limit) || 50;
        const o = Number(offset) || 0;
        return this.usersService.findAll(l, o);
    }

    @Get('me')
    async me(@Req() req: any) {
        const userId = req.user?.userId;
        if (!userId) throw new ForbiddenException();
        return this.usersService.findOne(userId);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto, @Req() req: any) {
        const requester = req.user;
        // only admin or owner
        if (!requester?.roles?.includes('admin') && requester?.userId !== id) {
            throw new ForbiddenException();
        }
        return this.usersService.update(id, updateUserDto as any);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        const requester = req.user;
        if (!requester?.roles?.includes('admin') && requester?.userId !== id) {
            throw new ForbiddenException();
        }
        return this.usersService.remove(id);
    }
}