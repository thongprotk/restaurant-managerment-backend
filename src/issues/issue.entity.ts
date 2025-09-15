import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Game } from '../games/game.entity';
import { Comment } from '../comments/comment.entity';

@Entity('issues')
@Index(['game_id', 'status'])
export class Issue {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: true })
    userId?: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'userId' })
    user?: User;

    @Column({ name: 'game_id', type: 'varchar', length: 200, nullable: true })
    game_id?: string;

    @ManyToOne(() => Game, { nullable: true })
    @JoinColumn({ name: 'game_id', referencedColumnName: 'game_id' })
    game?: Game;

    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'text', nullable: true })
    stepsToReproduce?: string;

    @Column({ type: 'text', nullable: true })
    expectedBehavior?: string;

    @Column({ type: 'text', nullable: true })
    actualBehavior?: string;

    @Column({ type: 'varchar', length: 50, default: 'bug' })
    type: string;

    @Column({ type: 'varchar', length: 50, default: 'low' })
    severity: string;

    @Column({ type: 'varchar', length: 50, default: 'open' })
    status: string;

    @Column({ type: 'int', default: 0 })
    attachmentsCount: number;

    @Column({ type: 'int', default: 0 })
    commentsCount: number;

    @Column({ type: 'int', default: 0 })
    votesUp: number;

    @Column({ type: 'int', default: 0 })
    votesDown: number;

    @Column({ type: 'uuid', nullable: true })
    resolvedBy?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Comment, (c) => c.issue)
    comments: Comment[];
}
