import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('issues/:issueId/comments')
export class CommentsController {
    @Get()
    async findAll(@Param('issueId') issueId: string) {
        return { message: `GET /issues/${issueId}/comments - list (skeleton)` };
    }

    @Post()
    async create(@Param('issueId') issueId: string, @Body() dto: CreateCommentDto) {
        return { message: `POST /issues/${issueId}/comments - create (skeleton)`, dto };
    }
}
