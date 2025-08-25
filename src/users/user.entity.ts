import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 150, unique: true, nullable: true })
    username: string;

    @Column({ length: 100, unique: true })
    email: string;

    @Column({ length: 100, select: false, nullable: true })
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: true })
    picture: string;

    @Column({ type: 'simple-array', default: 'customer' })
    roles: string[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ length: 255, select: false, nullable: true })
    refreshToken?: string;
}