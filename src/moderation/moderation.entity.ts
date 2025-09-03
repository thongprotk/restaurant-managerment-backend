import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('moderation_logs')
export class ModerationLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    moderatorId: string;

    @Column({ length: 50 })
    targetType: string;

    @Column({ type: 'uuid' })
    targetId: string;

    @Column({ length: 50 })
    action: string;

    @Column({ type: 'text', nullable: true })
    reason?: string;

    @CreateDateColumn()
    createdAt: Date;
}
