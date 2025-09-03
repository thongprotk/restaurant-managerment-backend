import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { Issue } from '../issues/issue.entity';

@Entity('games')
export class Game {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 200 })
    name: string;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 200, nullable: true })
    slug?: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    developer?: string;

    @Column({ type: 'jsonb', nullable: true })
    platforms?: string[];

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'date', nullable: true })
    releaseDate?: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata?: Record<string, any>;

    @OneToMany(() => Issue, (issue) => issue.game)
    issues: Issue[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
