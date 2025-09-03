import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('reports')
export class Report {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: true })
    reporterId?: string;

    @ManyToOne(() => User, { nullable: true })
    // optional join column is fine; reporterId holds FK
    reporter?: User;

    @Column({ type: 'uuid', nullable: true })
    issueId?: string;

    @Column({ length: 50, default: 'other' })
    type: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @CreateDateColumn()
    createdAt: Date;
}
