import { Controller, Get, Post, Body, Param, Query, Patch, Delete } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Controller('games')
export class GamesController {
    @Get()
    async findAll(@Query() query: any) {
        // TODO: return paginated list of games, support search/filters
        return { message: 'GET /games - list (skeleton)', query };
    }

    @Post()
    async create(@Body() dto: CreateGameDto) {
        // TODO: create game
        return { message: 'POST /games - create (skeleton)', dto };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        // TODO: return game detail including common issues
        return { message: `GET /games/${id} - detail (skeleton)` };
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateGameDto) {
        // TODO: update game
        return { message: `PATCH /games/${id} - update (skeleton)`, dto };
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        // TODO: soft-delete or hard-delete based on policy
        return { message: `DELETE /games/${id} - remove (skeleton)` };
    }
}
