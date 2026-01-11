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
        // 1. Extract text
        let resumeText = '';

        try {
            if (fileName.toLowerCase().endsWith('.docx')) {
                // Handle DOCX files
                let mammoth = await import('mammoth');
                // Handle different import mechanisms (CJS vs ESM)
                // @ts-ignore
                if (mammoth.default) {
                    // @ts-ignore
                    mammoth = mammoth.default;
                }

                const result = await mammoth.extractRawText({ buffer: fileBuffer });
                resumeText = result.value;
                if (result.messages.length > 0) {
                    console.log("Mammoth warnings:", result.messages);
                }
            } else {
                // Handle PDF files (Default)
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
            }
        } catch (error) {
            console.error('File Parse Error:', error);
            throw new BadRequestException('Failed to parse the file. Please ensure it is a valid PDF or DOCX.');
        }

        if (!resumeText || resumeText.trim().length === 0) {
            throw new BadRequestException('Could not extract text from the resume');
        }

        // 2. Call OpenAI to get analysis
        const analysisResult = await this.openAi.analyzeResume(resumeText, jobDescription);

        // Check if the document is actually a valid CV
        if (analysisResult.isValidCV === false) {
            throw new BadRequestException(analysisResult.error || 'The uploaded file does not appear to be a valid resume.');
        }

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
<<<<<<< Updated upstream

    async getAnalysisById(userId: string, analysisId: string) {
        const analysis = await this.prisma.analysis.findFirst({
            where: { id: analysisId, userId }
        });

        if (!analysis) {
            throw new BadRequestException('Analysis not found');
        }

        return analysis;
    }

    async generateJobDescription(fileBuffer: Buffer, fileName: string) {
        // Extract text from file
        const resumeText = await this.extractText(fileBuffer, fileName);

        if (!resumeText || resumeText.trim().length === 0) {
            throw new BadRequestException('Could not extract text from the resume');
        }

        return this.openAi.generateJobDescription(resumeText);
    }

    async generateCoverLetter(fileBuffer: Buffer, fileName: string, jobDescription?: string) {
        // Extract text from file
        const resumeText = await this.extractText(fileBuffer, fileName);

        if (!resumeText || resumeText.trim().length === 0) {
            throw new BadRequestException('Could not extract text from the resume');
        }

        return this.openAi.generateCoverLetter(resumeText, jobDescription);
    }

    private async extractText(fileBuffer: Buffer, fileName: string): Promise<string> {
        let resumeText = '';

        try {
            if (fileName.toLowerCase().endsWith('.docx')) {
                // Handle DOCX files
                let mammoth = await import('mammoth');
                // @ts-ignore
                if (mammoth.default) {
                    // @ts-ignore
                    mammoth = mammoth.default;
                }

                const result = await mammoth.extractRawText({ buffer: fileBuffer });
                resumeText = result.value;
            } else {
                // Handle PDF files (Default)
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
            }
        } catch (error) {
            console.error('File Parse Error:', error);
            throw new BadRequestException('Failed to parse the file. Please ensure it is a valid PDF or DOCX.');
        }

        return resumeText;
    }

    async getUserStats(userId: string) {
        const analyses = await this.prisma.analysis.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
            select: { score: true, createdAt: true }
        });

        if (analyses.length === 0) {
            return {
                totalAnalyses: 0,
                averageScore: 0,
                bestScore: 0,
                latestScore: 0,
                trend: 'neutral',
                improvement: 0
            };
        }

        const scores = analyses.map(a => a.score);
        const totalAnalyses = scores.length;
        const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / totalAnalyses);
        const bestScore = Math.max(...scores);
        const latestScore = scores[scores.length - 1];

        // Calculate trend (compare last 3 vs first 3, or available)
        let trend = 'neutral';
        let improvement = 0;

        if (scores.length >= 2) {
            const firstScore = scores[0];
            const lastScore = scores[scores.length - 1];
            improvement = lastScore - firstScore;

            if (improvement > 5) {
                trend = 'improving';
            } else if (improvement < -5) {
                trend = 'declining';
            }
        }

        return {
            totalAnalyses,
            averageScore,
            bestScore,
            latestScore,
            trend,
            improvement
        };
    }
=======
    async generateCoverLetter(userId: string, resumeText: string, jobDescription: string) {
        if (!resumeText || !jobDescription) {
            throw new BadRequestException('Resume text and Job Description are required');
        }
        return this.openAi.generateCoverLetter(resumeText, jobDescription);
    }
>>>>>>> Stashed changes
}
