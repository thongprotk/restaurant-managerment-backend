import { IsOptional, IsUUID, IsIn, IsArray, IsString } from 'class-validator';

export class CreateReportDto {
    @IsOptional()
    @IsUUID()
    reporterId?: string;

    @IsOptional()
    @IsUUID()
    issueId?: string;

    @IsOptional()
    @IsIn(['abuse', 'spam', 'other'])
    type?: 'abuse' | 'spam' | 'other';

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsArray()
    attachments?: Array<{ filename: string; url: string }>;
}
