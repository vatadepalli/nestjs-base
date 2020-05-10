import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './models/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDTO } from './data/MessageDTO';
import { AuthCredDTO } from './data/AuthCredDTO';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './data/JWTPayload';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ){}

    async signUp(authCred: AuthCredDTO): Promise<MessageDTO>{
        return await this.userRepository.signUp(authCred);
    }

    async signIn(authCred: AuthCredDTO): Promise<{ accessToken: string }>{
        const username = await this.userRepository.validateUserPassword(authCred);
        if (!username) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JWTPayload = { username };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }
}
