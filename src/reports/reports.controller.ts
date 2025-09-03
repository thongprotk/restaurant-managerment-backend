import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';

@Controller('reports')
export class ReportsController {
    @Post()
    async create(@Body() dto: CreateReportDto) {
        return { message: 'POST /reports - create (skeleton)', dto };
    }

    @Get()
    async findAll() {
        return { message: 'GET /reports - list (skeleton)' };
    }
}
