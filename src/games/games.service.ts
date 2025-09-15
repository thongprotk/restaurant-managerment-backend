import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GamesService {
    constructor(
        @InjectRepository(Game)
        private gameRespository: Repository<Game>) { }


    async findAll(limit = 50): Promise<Partial<Game>[]> {
        const games = await this.gameRespository.find({ take: limit });
        return games.map(({ id, ...rest }) => rest);
    }
    async create(dto: CreateGameDto): Promise<Game> {
        try {
            const payload: DeepPartial<Game> = {
                ...dto,
                game_id: dto.game_id ? dto.game_id.toLowerCase().trim() : dto.game_name.toLowerCase().replace(/\s+/g, '-').trim(),
                game_name: dto.game_name.trim(),
                releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : undefined,
            }
            const game = this.gameRespository.create(payload);
            return this.gameRespository.save(game);
        } catch (err) {
            throw new BadRequestException('Error creating game');
        }

    }
    async update(id: string, dto: Partial<UpdateGameDto>): Promise<Partial<Game>> {
        try {
            const game = await this.gameRespository.findOne({ where: { game_id: id } });
            if (!game) throw new BadRequestException('Game not found');

            Object.assign(game, {
                ...dto,
                game_name: dto.game_name?.trim() ?? game.game_name,
                releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : game.releaseDate,
            });
            await this.gameRespository.save(game);

            const updated = await this.gameRespository.findOne({ where: { game_id: id } });
            if (!updated) throw new BadRequestException('Error fetching updated game');
            return updated;
        } catch {
            throw new BadRequestException('Error updating game');
        }
    }
}
