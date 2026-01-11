import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UploadedFile, UseGuards, UseInterceptors, BadRequestException } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { GetCurrentUserId } from '../common/decorators';
import { AtGuard } from '../common/guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';

@Controller('analysis')
@UseGuards(AtGuard)
export class AnalysisController {
    constructor(private analysisService: AnalysisService) { }

    @Throttle({ default: { limit: 10, ttl: 3600000 } })
    @Post('analyze')
    @UseInterceptors(FileInterceptor('file'))
    @HttpCode(HttpStatus.CREATED)
    async analyze(
        @GetCurrentUserId() userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body('jobDescription') jobDescription?: string
    ) {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        return this.analysisService.analyze(userId, file.buffer, file.originalname, jobDescription);
    }

    @Get('history')
    @HttpCode(HttpStatus.OK)
    async getHistory(@GetCurrentUserId() userId: string) {
        return this.analysisService.getUserHistory(userId);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async deleteAnalysis(
        @GetCurrentUserId() userId: string,
        @Param('id') analysisId: string
    ) {
        return this.analysisService.deleteAnalysis(userId, analysisId);
    }

<<<<<<< Updated upstream
    @Throttle({ default: { limit: 10, ttl: 3600000 } })
    @Post('generate-job-description')
    @UseInterceptors(FileInterceptor('file'))
    @HttpCode(HttpStatus.OK)
    async generateJobDescription(
        @UploadedFile() file: Express.Multer.File
    ) {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        return this.analysisService.generateJobDescription(file.buffer, file.originalname);
    }

    @Throttle({ default: { limit: 10, ttl: 3600000 } })
    @Post('generate-cover-letter')
    @UseInterceptors(FileInterceptor('file'))
    @HttpCode(HttpStatus.OK)
    async generateCoverLetter(
        @UploadedFile() file: Express.Multer.File,
        @Body('jobDescription') jobDescription?: string
    ) {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        return this.analysisService.generateCoverLetter(file.buffer, file.originalname, jobDescription);
    }

    @Get('stats')
    @HttpCode(HttpStatus.OK)
    async getUserStats(@GetCurrentUserId() userId: string) {
        return this.analysisService.getUserStats(userId);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getAnalysisById(
        @GetCurrentUserId() userId: string,
        @Param('id') analysisId: string
    ) {
        return this.analysisService.getAnalysisById(userId, analysisId);
=======
    @Post('cover-letter')
    @HttpCode(HttpStatus.OK)
    async generateCoverLetter(
        @GetCurrentUserId() userId: string,
        @Body() body: { resumeText: string; jobDescription: string }
    ) {
        return this.analysisService.generateCoverLetter(userId, body.resumeText, body.jobDescription);
>>>>>>> Stashed changes
    }
}
