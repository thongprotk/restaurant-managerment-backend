import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { Issue } from '../issues/issue.entity';

@Entity('games')
export class Game {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index({ unique: true })
    @Column({ unique: true })
    game_id: string;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 200 })
    game_name: string;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 200 })
    slug: string;

    @Column({ nullable: true })
    guide_img: string;

    @Column({ nullable: true })
    icon_img: string;

    @Column({ default: 'text' })
    list_package_type: string;

    @Column({ type: 'date', nullable: true })
    releaseDate?: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
