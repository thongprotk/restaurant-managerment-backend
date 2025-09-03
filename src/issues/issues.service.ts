import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue } from './issue.entity';
import { Comment } from '../comments/comment.entity';
import { Attachment } from '../attachments/attachment.entity';

@Injectable()
export class IssuesService {
    constructor(
        @InjectRepository(Issue) private readonly issueRepo: Repository<Issue>,
        @InjectRepository(Comment) private readonly commentRepo: Repository<Comment>,
        @InjectRepository(Attachment) private readonly attachmentRepo: Repository<Attachment>,
    ) { }

    /**
     * Find one issue by id and include user, game, attachments and paginated comments.
     * options.page defaults to 1, options.limit defaults to 10 (max 100)
     */
    async findOne(id: string, options?: { page?: number; limit?: number }) {
        const issue = await this.issueRepo.findOne({
            where: { id },
            relations: ['user', 'game'],
        });

        if (!issue) {
            throw new NotFoundException(`Issue ${id} not found`);
        }

        const attachments = await this.attachmentRepo.find({
            where: { issueId: id },
            order: { createdAt: 'ASC' },
        });

        const page = Math.max(1, Number(options?.page) || 1);
        const limit = Math.min(100, Number(options?.limit) || 10);

        const [comments, total] = await this.commentRepo.findAndCount({
            where: { issueId: id, isHidden: false },
            order: { createdAt: 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
            relations: ['user'],
        });

        return {
            ...issue,
            attachments,
            comments: {
                items: comments,
                total,
                page,
                limit,
            },
        };
    }
}
