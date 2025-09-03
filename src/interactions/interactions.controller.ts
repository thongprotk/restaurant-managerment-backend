import { Controller, Post, Body } from '@nestjs/common';
import { CreateInteractionDto } from './dto/create-interaction.dto';

@Controller('interactions')
export class InteractionsController {
    @Post()
    async create(@Body() dto: CreateInteractionDto) {
        return { message: 'POST /interactions - create (skeleton)', dto };
    }
}
