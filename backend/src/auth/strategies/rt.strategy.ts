import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type JwtPayload = {
    sub: string;
    email: string;
};

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(config: ConfigService) {
        super({
            // Extract from cookie 'refresh_token'
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.refresh_token;
                },
            ]),
            secretOrKey: config.get<string>('JWT_REFRESH_SECRET'),
            passReqToCallback: true, // We need the token string itself to hash/compare later
        });
    }

    validate(req: Request, payload: JwtPayload) {
        const refreshToken = req.cookies?.refresh_token;
        if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

        return {
            ...payload,
            refreshToken,
        };
    }
}
