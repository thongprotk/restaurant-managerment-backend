import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Issue } from '../issues/issue.entity';
import { Report } from '../reports/report.entity';

@Entity('attachments')
export class Attachment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: true })
    issueId?: string;

    @ManyToOne(() => Issue, { nullable: true })
    @JoinColumn({ name: 'issueId' })
    issue?: Issue;

    @Column({ type: 'uuid', nullable: true })
    reportId?: string;

    @ManyToOne(() => Report, { nullable: true })
    @JoinColumn({ name: 'reportId' })
    report?: Report;

    @Column()
    filename: string;

    @Column()
    url: string;

    @Column({ nullable: true })
    contentType?: string;

    @Column({ type: 'bigint', nullable: true })
    size?: number;

    @Column({ type: 'uuid', nullable: true })
    uploadedBy?: string;

    @CreateDateColumn()
    createdAt: Date;
}
