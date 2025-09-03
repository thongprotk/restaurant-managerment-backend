import { Controller, Get, Post, Body, Param, Query, Patch } from '@nestjs/common';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { IssuesService } from './issues.service';

@Controller('issues')
export class IssuesController {
    constructor(private readonly issuesService: IssuesService) { }

    @Get()
    async findAll(@Query() query: any) {
        return { message: 'GET /issues - list (skeleton)', query };
    }

    @Post()
    async create(@Body() dto: CreateIssueDto) {
        return { message: 'POST /issues - create (skeleton)', dto };
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Query('page') page?: string, @Query('limit') limit?: string) {
        const result = await this.issuesService.findOne(id, { page: page ? Number(page) : undefined, limit: limit ? Number(limit) : undefined });
        return result;
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateIssueDto) {
        return { message: `PATCH /issues/${id} - update (skeleton)`, dto };
    }
}
