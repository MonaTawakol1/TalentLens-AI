import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
    private openai: OpenAI;

    constructor(private configService: ConfigService) {
        this.openai = new OpenAI({
            apiKey: this.configService.get<string>('OPENAI_API_KEY'),
        });
    }

    async analyzeResume(resumeText: string, jobDescription?: string) {
        const prompt = `
You are an expert AI Resume Reviewer and Career Coach. Analyze the following resume against the job description.

Resume Content:
"${resumeText.substring(0, 4000)}"

Job Description:
"${jobDescription ? jobDescription.substring(0, 2000) : 'General Professional Role'}"

Provide a comprehensive analysis in this EXACT JSON format. Be specific and actionable:
{
    "overallScore": <number 0-100>,
    "atsScore": <number 0-100 for ATS compatibility>,
    "jobMatch": <number 0-100 for job description match>,
    
    "summary": "<2-3 sentence overall assessment>",
    "topPriority": "<single most important improvement needed>",
    
    "sectionReviews": [
        {
            "name": "Professional Summary",
            "score": <number 0-100>,
            "strengths": ["<strength>", "<strength>"],
            "weaknesses": ["<weakness>", "<weakness>"],
            "missing": ["<missing element>"],
            "suggestions": ["<specific suggestion>"]
        },
        {
            "name": "Experience",
            "score": <number 0-100>,
            "strengths": ["<strength>", "<strength>"],
            "weaknesses": ["<weakness>", "<weakness>"],
            "missing": ["<missing element>"],
            "suggestions": ["<specific suggestion>"]
        },
        {
            "name": "Skills",
            "score": <number 0-100>,
            "strengths": ["<strength>"],
            "weaknesses": ["<weakness>"],
            "missing": ["<missing skill>"],
            "suggestions": ["<specific suggestion>"]
        }
    ],
    
    "atsCheck": {
        "missingKeywords": ["<keyword1>", "<keyword2>", "<keyword3>"],
        "genericWords": ["<generic phrase to avoid>", "<another>"],
        "actionableSteps": ["<specific fix 1>", "<specific fix 2>", "<specific fix 3>"]
    },
    
    "skillGap": {
        "radarData": [
            {"subject": "Technical", "A": <your score 0-100>, "B": 100, "fullMark": 100},
            {"subject": "Leadership", "A": <your score 0-100>, "B": 100, "fullMark": 100},
            {"subject": "Communication", "A": <your score 0-100>, "B": 100, "fullMark": 100},
            {"subject": "Analytical", "A": <your score 0-100>, "B": 100, "fullMark": 100},
            {"subject": "Domain", "A": <your score 0-100>, "B": 100, "fullMark": 100}
        ],
        "barData": [
            {"name": "<skill1>", "status": <0-100>, "required": 100, "gap": "<Missing/Low/Good/Match>"},
            {"name": "<skill2>", "status": <0-100>, "required": 100, "gap": "<Missing/Low/Good/Match>"},
            {"name": "<skill3>", "status": <0-100>, "required": 100, "gap": "<Missing/Low/Good/Match>"}
        ]
    },
    
    "actionPlan": {
        "high": ["<urgent improvement 1>", "<urgent improvement 2>"],
        "medium": ["<medium priority 1>", "<medium priority 2>"],
        "optional": ["<nice to have 1>", "<nice to have 2>"]
    },
    
    "improvements": [
        {
            "section": "Professional Summary",
            "before": "<example weak statement from resume or generic example>",
            "after": "<rewritten powerful version>"
        }
    ]
}

IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, no explanations.
`;

        try {
            const completion = await this.openai.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'gpt-4o-mini',
                temperature: 0.7,
            });

            const content = completion.choices[0].message.content;

            // Clean up any markdown formatting
            let cleanContent = content.trim();
            if (cleanContent.startsWith('```json')) {
                cleanContent = cleanContent.slice(7);
            }
            if (cleanContent.startsWith('```')) {
                cleanContent = cleanContent.slice(3);
            }
            if (cleanContent.endsWith('```')) {
                cleanContent = cleanContent.slice(0, -3);
            }

            return JSON.parse(cleanContent.trim());
        } catch (error) {
            console.error('OpenAI Analysis Error:', error);
            throw new InternalServerErrorException('Failed to analyze resume with AI');
        }
    }
}
