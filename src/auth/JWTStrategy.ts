import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWTPayload } from './data/JWTPayload';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository, User } from './models/User.entity';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'topsecret'
        });
    }

    async validate(payload: JWTPayload): Promise<User> {
        const { username } = payload;
        const user = await this.userRepository.findOne({ username });

        if(!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}