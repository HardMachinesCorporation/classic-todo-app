import {IUser} from "@todos/shared";
import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Todo} from "../../todos/entities/todo.entity";

@Entity('Users')
export class User implements IUser {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({unique: true})
    email!: string;

    @Column()
    password!: string;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
    @OneToMany(() => Todo, (todo) => todo.user, { eager: false , cascade: ['insert', 'update']})
    todos!:Todo[]
}
