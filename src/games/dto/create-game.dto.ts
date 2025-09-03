export class CreateGameDto {
    name: string;
    slug?: string;
    developer?: string;
    platforms?: string[];
    description?: string;
    releaseDate?: string; // ISO date
    metadata?: Record<string, any>;
}
