import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { Issue } from '../issues/issue.entity';
import { User } from '../users/user.entity';

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    issueId: string;

    @ManyToOne(() => Issue, (i) => i.comments)
    issue: Issue;

    @Column({ type: 'uuid' })
    userId: string;

    @ManyToOne(() => User)
    user: User;

    @Column({ type: 'text' })
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ nullable: true })
    editedAt?: Date;

    @Column({ default: false })
    isHidden: boolean;
}
