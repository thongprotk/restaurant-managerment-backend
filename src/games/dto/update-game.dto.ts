export class UpdateGameDto {
    name?: string;
    slug?: string;
    developer?: string;
    platforms?: string[];
    description?: string;
    metadata?: Record<string, any>;
}
