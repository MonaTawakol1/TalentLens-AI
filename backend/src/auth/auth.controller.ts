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
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Throttle({ default: { limit: 5, ttl: 900000 } })
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.register(dto);
        this.setCookie(res, tokens.refresh_token);
        return { access_token: tokens.access_token };
    }

    @Throttle({ default: { limit: 5, ttl: 900000 } })
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
    async getMe(@GetCurrentUserId() userId: string) {
        return this.authService.getUserProfile(userId);
    }

    @UseGuards(AtGuard)
    @Post('profile') // Using Post or Patch
    @HttpCode(HttpStatus.OK)
    async updateProfile(@GetCurrentUserId() userId: string, @Body() dto: { fullName?: string; email?: string; title?: string; location?: string }) {
        return this.authService.updateProfile(userId, dto);
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
