import {ITodo} from "@todos/shared";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../users/entities/user.entity";

@Entity('Todos')
export class Todo implements ITodo{
    @PrimaryGeneratedColumn('uuid')
    id!: string ;
    @Column({ unique: true})
    title!: string;
    @Column()
    description!: string;
    @Column()
    completed!: boolean;
    @ManyToOne(() => User, (user) => user.todos, { eager: false , onDelete: 'CASCADE'})
    user!: User
}
