import { IsString, MinLength, MaxLength, Matches } from "class-validator";

export class AuthCredDTO {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    {
        message: 'Password too weak. Need atleast one each - uppercase, lowercase, number or special character.'
    }) 
    // Atlest 1 (uppercase, lowercase, number or special char)
    password: string;
}

