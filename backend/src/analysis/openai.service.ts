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
You are a strict and expert Senior Technical Recruiter and Career Coach. 
First, VALIDATE if the following text is actually a Resume/CV. 
If the text appears to be a random document, a book, an article, a homework assignment, or just jibberish that is NOT a resume, return this JSON:
{
    "isValidCV": false,
    "error": "The uploaded document does not appear to be a resume. Please upload a valid professional CV."
}

If it IS a valid resume, perform a deep, critical analysis. 

Resume Content:
"${resumeText.substring(0, 4000)}"

Job Description:
"${jobDescription ? jobDescription.substring(0, 2000) : 'General Professional Role'}"

Scoring Rules:
- Be EXTREMELY CRITICAL and REALISTIC. 
- Use the FULL range of 0-100. DO NOT default to safe scores like 75 or 80.
- A generic, average resume should get 40-60.
- A good resume should get 65-75.
- Only exceptional, top 1% resumes get 85+.
- If the resume is sparse, has typos, or lacks measurable achievements, punish the score heavily (below 50).

Provide a comprehensive analysis in this EXACT JSON format. Be specific and actionable:
{
    "isValidCV": true,
    "detectedRole": "<The candidate's primary professional title based on experience>",
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

    async generateJobDescription(resumeText: string): Promise<{ jobDescription: string; suggestedTitle: string }> {
        const prompt = `
Based on the following resume, generate a realistic and suitable job description that would be a perfect match for this candidate.

Resume Content:
"${resumeText.substring(0, 3000)}"

Generate a job description that:
1. Matches the candidate's experience level
2. Aligns with their skills and background
3. Is realistic and commonly found in job postings
4. Includes requirements, responsibilities, and qualifications

Return ONLY valid JSON in this format:
{
    "suggestedTitle": "<Job Title that fits this resume>",
    "jobDescription": "<Full job description text, 150-250 words>"
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
            let cleanContent = content.trim();
            if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7);
            if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3);
            if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3);

            return JSON.parse(cleanContent.trim());
        } catch (error) {
            console.error('OpenAI Generate Job Description Error:', error);
            throw new InternalServerErrorException('Failed to generate job description');
        }
    }

    async generateCoverLetter(resumeText: string, jobDescription?: string): Promise<{ coverLetter: string }> {
        const prompt = `
You are an expert career coach and professional writer. Generate a compelling, personalized cover letter based on the following resume${jobDescription ? ' and job description' : ''}.

Resume Content:
"${resumeText.substring(0, 3000)}"

${jobDescription ? `Job Description:\n"${jobDescription.substring(0, 1500)}"` : 'Generate a general-purpose cover letter suitable for multiple applications.'}

Guidelines:
1. Write a professional, compelling cover letter (250-350 words)
2. Highlight key achievements and skills from the resume
3. Show enthusiasm and cultural fit
4. Include a strong opening and call to action
5. Make it personalized, NOT generic
6. Use a professional but warm tone

Return ONLY valid JSON in this format:
{
    "coverLetter": "<The full cover letter text with proper paragraph breaks using \\n\\n>"
}

IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, no explanations.
`;

        try {
            const completion = await this.openai.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'gpt-4o-mini',
                temperature: 0.8,
            });

            const content = completion.choices[0].message.content;
            let cleanContent = content.trim();
            if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7);
            if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3);
            if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3);

            return JSON.parse(cleanContent.trim());
        } catch (error) {
            console.error('OpenAI Generate Cover Letter Error:', error);
            throw new InternalServerErrorException('Failed to generate cover letter');
        }
    }
}
