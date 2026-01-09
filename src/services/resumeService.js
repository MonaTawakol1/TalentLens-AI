import { sleep } from './api';

const MOCK_RESULTS = {
    overallScore: 78,
    atsScore: 85,
    jobMatch: 65,

    // Section 1: Detailed Section Review
    sectionReviews: [
        {
            name: "Professional Summary",
            score: 70,
            strengths: ["Clear contact info", "Professional tone", "Good length"],
            weaknesses: ["Generic objective statement", "Lacks specific career targets"],
            missing: ["Target Job Title", "Years of Experience summary"],
            suggestions: ["Rewrite to focus on value proposition", "Include 'Product Manager' keyword early"]
        },
        {
            name: "Experience",
            score: 85,
            strengths: ["Strong action verbs used", "Reverse chronological order"],
            weaknesses: ["Some bullet points lack results"],
            missing: ["Quantifiable Metrics (ROI, % growth)"],
            suggestions: ["Add numbers to at least 3 more bullet points", "Highlight leadership in 2023 role"]
        },
        {
            name: "Skills",
            score: 60,
            strengths: ["Relevant categories"],
            weaknesses: ["Outdated technologies listed", "Cluttered formatting"],
            missing: ["Soft skills section", "Certification authorities"],
            suggestions: ["Group skills by domain", "Remove 'Microsoft Word' - it's assumed"]
        }
    ],

    // Section 2: ATS Check
    atsCheck: {
        missingKeywords: ["Agile Methodology", "Stakeholder Management", "Python", "Data Analysis"],
        genericWords: ["Hard worker", "Motivated", "Team player", "Responsible for"],
        actionableSteps: [
            "Replace 'Responsible for' with 'Spearheaded' or 'Managed'",
            "Add a 'Technical Skills' section to capture missing keywords",
            "Ensure standard section headings (Experience, Education) for parsing"
        ]
    },

    // Section 3: Action Plan
    actionPlan: {
        high: [
            "Quantify achievements in recent roles (e.g., 'Increased revenue by 20%')",
            "Add missing critical keywords: Agile, Python",
            "Fix formatting inconsistencies in the Education section"
        ],
        medium: [
            "Rewrite Summary to be more result-oriented",
            "Remove outdated skills like 'Windows 98'",
            "Standardize date formats (e.g., MM/YYYY)"
        ],
        optional: [
            "Add a LinkedIn URL if available",
            "Include a 'Projects' section for portfolio work",
            "Consider a modern font like Roboto or Open Sans"
        ]
    },

    // Section 4: Skills Gap Analysis
    skillGap: {
        radarData: [
            { subject: 'Technical', A: 80, B: 100, fullMark: 100 },
            { subject: 'Leadership', A: 90, B: 100, fullMark: 100 },
            { subject: 'Communication', A: 85, B: 100, fullMark: 100 },
            { subject: 'Analytical', A: 60, B: 100, fullMark: 100 },
            { subject: 'Creativity', A: 70, B: 100, fullMark: 100 },
            { subject: 'Domain', A: 65, B: 100, fullMark: 100 },
        ],
        barData: [
            { name: 'Python', status: 40, required: 100, gap: 'Low Proficiency' },
            { name: 'Agile', status: 100, required: 100, gap: 'Match' },
            { name: 'SQL', status: 0, required: 100, gap: 'Missing' },
            { name: 'Tableau', status: 0, required: 100, gap: 'Missing' },
            { name: 'Product Strat', status: 80, required: 100, gap: 'Good' },
        ]
    },

    // Section 5: AI Improvements (Before/After)
    improvements: [
        {
            section: "Professional Summary",
            before: "Dedicated professional with experience in marketing and sales. Looking for a new opportunity to use my skills.",
            after: "Results-driven Marketing Specialist with 4+ years of experience executing data-driven campaigns. Proven track record of increasing ROI by 15% YoY. Seeking to leverage analytical skills in a Senior Growth role."
        }
    ]
};

export const resumeService = {
    analyzeResume: async (file) => {
        await sleep(1500); // Simulate AI processing
        return MOCK_RESULTS;
    },

    getResults: async (id) => {
        await sleep(500);
        return MOCK_RESULTS;
    }
};
