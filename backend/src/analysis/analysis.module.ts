import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { OpenAiService } from './openai.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [ConfigModule, PrismaModule],
    controllers: [AnalysisController],
    providers: [AnalysisService, OpenAiService]
})
export class AnalysisModule { }
