import { IsOptional, IsIn, IsString, IsUUID } from 'class-validator';

export class UpdateIssueDto {
    @IsOptional()
    @IsIn(['open', 'in_progress', 'resolved', 'closed', 'duplicate'])
    status?: 'open' | 'in_progress' | 'resolved' | 'closed' | 'duplicate';

    @IsOptional()
    @IsIn(['low', 'medium', 'high', 'critical'])
    severity?: 'low' | 'medium' | 'high' | 'critical';

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsUUID()
    resolvedBy?: string;
}
