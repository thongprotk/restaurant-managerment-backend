import { Module } from '@nestjs/common';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from './issue.entity';
import { Comment } from '../comments/comment.entity';
import { Attachment } from '../attachments/attachment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Issue, Comment, Attachment])],
    controllers: [IssuesController],
    providers: [IssuesService],
    exports: [IssuesService],
})
export class IssuesModule { }
