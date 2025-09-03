import { IsOptional, IsUUID, IsString } from 'class-validator';

export class CreateCommentDto {
    @IsOptional()
    @IsUUID()
    userId?: string;

    @IsString()
    content: string;
}
