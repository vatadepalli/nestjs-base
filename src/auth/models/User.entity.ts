import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Repository, EntityRepository, Unique, OneToMany } from "typeorm";
import { MessageDTO } from "../data/MessageDTO";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { AuthCredDTO } from "../data/AuthCredDTO";
import * as bcrypt from 'bcrypt';
import { Task } from "src/tasks/models/Task.entity";

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @OneToMany(type => Task, task => task.user, {
        eager: true // Only one side can be user
    })
    tasks: Task[];

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}


@EntityRepository(User)
export class UserRepository extends Repository<User> {
    
    async signUp(authCredDTO: AuthCredDTO): Promise<MessageDTO> {
        const { username, password } = authCredDTO;

        const salt = await bcrypt.genSalt();

        const user = new User();
        user.username = username;
        user.password = await this.hashPassword(password, salt);
        user.salt = salt;


        return await user.save().then(res => {
            return new MessageDTO("Successfully created user.");
        }).catch(err => {
            if (err.code === '23505') {
                throw new ConflictException("Username already exists.");
            }
            throw new InternalServerErrorException(err);
        });
    }

    async validateUserPassword(authCredDTO: AuthCredDTO): Promise<string> {
        const { username, password } = authCredDTO;
        const user = await this.findOne({ username });

        if (user && await user.validatePassword(password)) {
            return user.username;
        } else {
            return null;
        }
        
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}