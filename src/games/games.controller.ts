import { Controller, Get, Post, Body, Param, Query, Patch, Delete, UseGuards, BadGatewayException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GamesService } from './games.service';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Public } from 'src/auth/public.decorator';

@Controller('games')
export class GamesController {
    constructor(private readonly gamesService: GamesService) { }

    @Get('getListGames')
    @Public()
    async findAll(@Query() query: any, limit?: number) {
        if (query.limit) {
            return this.gamesService.findAll(query.limit ? parseInt(query.limit) : 50);
        }
        return this.gamesService.findAll(limit || 50);
    }

    @Post('create')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    async create(@Body() dto: CreateGameDto) {
        return this.gamesService.create(dto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        // TODO: return game detail including common issues
        return { message: `GET /games/${id} - detail (skeleton)` };
    }


    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    async update(@Param('id') id: string, @Body() dto: UpdateGameDto) {
        if (!id) throw new BadGatewayException('Game ID is required');
        return this.gamesService.update(id, dto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        if (!id) throw new BadGatewayException('Game ID is required');
        return { message: `DELETE /games/${id} - remove (skeleton)` };
    }
}
