import { Controller, Post, Body, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { AuthCredDTO } from './data/AuthCredDTO';
import { AuthService } from './auth.service';
import { MessageDTO } from './data/MessageDTO';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
        ){}

    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredDTO: AuthCredDTO): Promise<MessageDTO> {
        return this.authService.signUp(authCredDTO);
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) authCredDTO: AuthCredDTO): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredDTO);
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user) {
        console.log(user);
    }
}
