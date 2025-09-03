import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('interactions')
export class Interaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: true })
    userId?: string;

    @Column({ type: 'uuid', nullable: true })
    issueId?: string;

    @Column({ length: 50 })
    eventType: string;

    @Column({ type: 'jsonb', nullable: true })
    details?: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;
}
