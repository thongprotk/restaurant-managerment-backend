import { Controller, Post, Body } from '@nestjs/common';
import { ModerateActionDto } from './dto/moderate-action.dto';

@Controller('moderation')
export class ModerationController {
    @Post('actions')
    async action(@Body() dto: ModerateActionDto) {
        return { message: 'POST /moderation/actions - (skeleton)', dto };
    }
}
