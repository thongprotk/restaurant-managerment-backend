import { IsISO8601, IsOptional, IsString } from "class-validator";

export class UpdateGameDto {
    @IsOptional() @IsString()
    game_id?: string;
    @IsOptional() @IsString()
    game_name?: string;
    @IsOptional() @IsString()
    slug?: string;
    @IsOptional() @IsString()
    guide_img?: string;
    @IsOptional() @IsString()
    icon_img?: string;
    @IsOptional() @IsISO8601()
    releaseDate?: string;
}
