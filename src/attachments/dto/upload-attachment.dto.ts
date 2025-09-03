import { IsOptional, IsUUID, IsString, IsNumber } from 'class-validator';

export class UploadAttachmentDto {
    @IsOptional()
    @IsUUID()
    issueId?: string;

    @IsOptional()
    @IsUUID()
    reportId?: string;

    @IsString()
    filename: string;

    @IsString()
    url: string;

    @IsOptional()
    @IsString()
    contentType?: string;

    @IsOptional()
    @IsNumber()
    size?: number;
}
