import { IsOptional, IsUUID, IsString, IsIn, IsArray, ValidateNested } from 'class-validator';

export class CreateIssueDto {
    @IsOptional()
    @IsUUID()
    userId?: string; // optional for anonymous

    @IsOptional()
    @IsUUID()
    gameId?: string; // if not provided, frontend can send game info

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    stepsToReproduce?: string;

    @IsOptional()
    @IsString()
    expectedBehavior?: string;

    @IsOptional()
    @IsString()
    actualBehavior?: string;

    @IsOptional()
    @IsIn(['bug', 'crash', 'performance', 'connect', 'other'])
    type?: 'bug' | 'crash' | 'performance' | 'connect' | 'other';

    @IsOptional()
    @IsIn(['low', 'medium', 'high', 'critical'])
    severity?: 'low' | 'medium' | 'high' | 'critical';

    @IsOptional()
    @IsArray()
    attachments?: Array<{ filename: string; url: string }>;
}
