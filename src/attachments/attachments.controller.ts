import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UploadAttachmentDto } from './dto/upload-attachment.dto';

@Controller('attachments')
export class AttachmentsController {
    @Post('upload')
    async upload(@Body() dto: UploadAttachmentDto) {
        return { message: 'POST /attachments/upload (skeleton)', dto };
    }

    @Get(':id')
    async get(@Param('id') id: string) {
        return { message: `GET /attachments/${id} (skeleton)` };
    }
}
