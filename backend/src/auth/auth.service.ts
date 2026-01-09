import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private config: ConfigService,
    ) { }

    async register(dto: RegisterDto): Promise<Tokens> {
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existing) throw new BadRequestException('Email already in use');

        const hash = await this.hashData(dto.password);
        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hash,
                fullName: dto.fullName,
            },
        });

        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRtHash(newUser.id, tokens.refresh_token);
        return tokens;
    }

    async login(dto: LoginDto): Promise<Tokens> {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) throw new ForbiddenException('Access Denied');

        const passwordMatches = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatches) throw new ForbiddenException('Access Denied');

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }

    async logout(userId: string) {
        // Idempotent update
        try {
            await this.prisma.user.update({
                where: { id: userId },
                data: { refreshToken: null },
            });
        } catch (error) {
            // user might not exist or other error, but for logout we can ignore or log
        }
        return true;
    }

    async refreshTokens(userId: string, rt: string): Promise<Tokens> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');

        const rtMatches = await bcrypt.compare(rt, user.refreshToken);
        if (!rtMatches) throw new ForbiddenException('Access Denied');

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }

    async updateRtHash(userId: string, rt: string) {
        const hash = await this.hashData(rt);
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: hash },
        });
    }

    async hashData(data: string) {
        return bcrypt.hash(data, 10);
    }

    async updateProfile(userId: string, dto: { fullName?: string; email?: string; title?: string; location?: string }) {
        // If email is being updated, check uniqueness
        if (dto.email) {
            const existing = await this.prisma.user.findUnique({
                where: { email: dto.email },
            });
            if (existing && existing.id !== userId) {
                throw new BadRequestException('Email already in use');
            }
        }

        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                fullName: dto.fullName,
                email: dto.email,
                title: dto.title,
                location: dto.location,
            },
        });

        return user;
    }

    async getUserProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) throw new ForbiddenException('User not found');

        // Remove sensitive data
        const { password, refreshToken, ...result } = user;
        return result;
    }

    async getTokens(userId: string, email: string): Promise<Tokens> {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    secret: this.config.get<string>('JWT_SECRET'),
                    expiresIn: '15m',
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    secret: this.config.get<string>('JWT_REFRESH_SECRET'),
                    expiresIn: '7d',
                },
            ),
        ]);

        return {
            access_token: at,
            refresh_token: rt,
        };
    }
}
