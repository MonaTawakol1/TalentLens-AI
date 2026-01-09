import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UploadedFile, UseGuards, UseInterceptors, BadRequestException } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { GetCurrentUserId } from '../common/decorators';
import { AtGuard } from '../common/guards';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('analysis')
@UseGuards(AtGuard)
export class AnalysisController {
    constructor(private analysisService: AnalysisService) { }

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
}
