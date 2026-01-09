import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    Res,
    Req,
    Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { Tokens } from './types';
import { Response, Request } from 'express';
import { RtGuard } from '../common/guards'; // We'll need to export this
import { GetCurrentUser, GetCurrentUserId } from '../common/decorators';
import { AtGuard } from '../common/guards';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.register(dto);
        this.setCookie(res, tokens.refresh_token);
        return { access_token: tokens.access_token };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.login(dto);
        this.setCookie(res, tokens.refresh_token);
        return { access_token: tokens.access_token };
    }

    @UseGuards(AtGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@GetCurrentUserId() userId: string, @Res({ passthrough: true }) res: Response) {
        await this.authService.logout(userId);
        res.clearCookie('refresh_token');
        return { message: 'Logged out successfully' };
    }

    @UseGuards(RtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshTokens(
        @GetCurrentUserId() userId: string,
        @GetCurrentUser('refreshToken') refreshToken: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        const tokens = await this.authService.refreshTokens(userId, refreshToken);
        this.setCookie(res, tokens.refresh_token);
        return { access_token: tokens.access_token };
    }

    @UseGuards(AtGuard)
    @Get('me')
    @HttpCode(HttpStatus.OK)
    getMe(@GetCurrentUser() user: any) {
        return user;
    }

    private setCookie(res: Response, token: string) {
        res.cookie('refresh_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', // or 'lax' depending on frontend-backend domain
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    }
}
