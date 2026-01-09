import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OpenAiService } from './openai.service';

@Injectable()
export class AnalysisService {
    constructor(
        private prisma: PrismaService,
        private openAi: OpenAiService,
    ) { }

    async analyze(userId: string, fileBuffer: Buffer, fileName: string, jobDescription?: string) {
        // 1. Extract text from PDF using pdfjs-dist
        let resumeText = '';
        try {
            const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
            const loadingTask = pdfjs.getDocument({ data: new Uint8Array(fileBuffer) });
            const pdf = await loadingTask.promise;

            const textParts: string[] = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const pageText = content.items.map((item: any) => item.str).join(' ');
                textParts.push(pageText);
            }
            resumeText = textParts.join('\n');
        } catch (error) {
            console.error('PDF Parse Error:', error);
            throw new BadRequestException('Failed to parse PDF file');
        }

        if (!resumeText || resumeText.trim().length === 0) {
            throw new BadRequestException('Could not extract text from the resume');
        }

        // 2. Call OpenAI to get analysis
        const analysisResult = await this.openAi.analyzeResume(resumeText, jobDescription);

        // 3. Save result to database
        const savedAnalysis = await this.prisma.analysis.create({
            data: {
                userId,
                fileName,
                resumeText,
                jobDescription,
                score: analysisResult.overallScore || analysisResult.score || 0,
                feedback: analysisResult,
            },
        });

        // Return the full analysis result (not just the saved record)
        return { ...savedAnalysis, ...analysisResult };
    }

    async getUserHistory(userId: string) {
        return this.prisma.analysis.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async deleteAnalysis(userId: string, analysisId: string) {
        // Verify the analysis belongs to the user
        const analysis = await this.prisma.analysis.findFirst({
            where: { id: analysisId, userId }
        });

        if (!analysis) {
            throw new BadRequestException('Analysis not found');
        }

        await this.prisma.analysis.delete({
            where: { id: analysisId }
        });

        return { message: 'Analysis deleted successfully' };
    }
}
