import { IsISO8601, IsOptional, IsString } from "class-validator";

export class CreateGameDto {
    @IsString()
    game_id: string;

    @IsString()
    game_name: string;

    @IsString()
    slug: string;

    @IsString()
    @IsOptional()
    guide_img?: string;

    @IsString()
    @IsOptional()
    icon_img?: string;

    @IsISO8601()
    @IsOptional()
    releaseDate?: string;
}
