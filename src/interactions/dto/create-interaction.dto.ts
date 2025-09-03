import { IsOptional, IsUUID, IsIn, IsObject } from 'class-validator';

export class CreateInteractionDto {
    @IsOptional()
    @IsUUID()
    userId?: string;

    @IsOptional()
    @IsUUID()
    issueId?: string;

    @IsIn(['view', 'vote_up', 'vote_down', 'bookmark', 'share', 'comment', 'follow'])
    eventType: 'view' | 'vote_up' | 'vote_down' | 'bookmark' | 'share' | 'comment' | 'follow';

    @IsOptional()
    @IsObject()
    details?: Record<string, any>;
}
