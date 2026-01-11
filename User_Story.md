# Project User Story: TalentLens AI

**Project Name:** TalentLens AI  
**Version:** 1.0  
**Date:** January 11, 2026

---

## 1. Executive Summary
**TalentLens AI** is an intelligent, multi-agent career optimization platform designed to bridge the gap between job seekers and Applicant Tracking Systems (ATS). By leveraging advanced AI analysis, the platform provides candidates with real-time, actionable feedback on their resumes, simulating the evaluation process of top-tier recruiters and technical hiring managers.

## 2. The Core User Story (The "Hero" Flow)

> **"As an ambitious Job Seeker, I want to upload my resume and a target job description into TalentLens AI, so that I can receive instant, detailed feedback on my ATS compatibility, technical skill gaps, and content impact, allowing me to fix issues before applying and significantly increase my interview chances."**

---

## 3. Target Persona

**Name:** Alex  
**Role:** Mid-Senior Software Professional  
**Goals:** 
- Land a role at a competitive tech company.
- Understand why previous applications were rejected.
- Optimize their resume for specific job openings.
**Frustrations:** 
- "Ghosting" from recruiters.
- Uncertainty about whether their resume is "ATS-friendly".
- Generic feedback from traditional resume reviews.

---

## 4. Detailed User Stories & Epics

### Epic 1: Onboarding & Identity
*   **Story 1.1:** As a new user, I want to **register** using a secure email/password system so that my data and analysis history are protected.
*   **Story 1.2:** As a returning user, I want to **log in** securely to access my saved reports and resume versions.

### Epic 2: Resume Input & Parsing
*   **Story 2.1:** As a user, I want to **upload my resume** (PDF or DOCX) via a simple drag-and-drop interface.
*   **Story 2.2:** As a user, I want the system to **automatically parse** my file, extracting my skills, education, and experience without manual data entry.
*   **Story 2.3:** As a user, I want to **paste a Job Description (JD)** for a specific role I'm targeting, so the AI knows exactly what to measure me against.

### Epic 3: Multi-Agent AI Analysis (The Core Value)
*   **Story 3.1 (ATS Agent):** As a user, I want an **ATS Compatibility Check** to ensure my formatting, fonts, and keywords can be read by automated screening software.
*   **Story 3.2 (Recruiter Agent):** As a user, I want a **Recruiter Persona analysis** to evaluate the "human" aspects: clarity, impact, and usage of strong action verbs.
*   **Story 3.3 (Tech Agent):** As a user, I want a **Technical Gap Analysis** to identify exactly which hard skills (e.g., "Docker", "GraphQL") are missing from my resume relative to the Job Description.

### Epic 4: Visualization & Insights
*   **Story 4.1:** As a user, I want to see a **Match Score (0-100%)** immediately after analysis to gauge my readiness.
*   **Story 4.2:** As a user, I want to view a **Skills Radar Chart** to visually compare my profile strength against the job requirements.
*   **Story 4.3:** As a user, I want **line-by-line feedback** so I know exactly which sentences to rewrite.

### Epic 5: Progression & History
*   **Story 5.1:** As a user, I want to **save my analysis reports** to reviewed them later.
*   **Story 5.2:** As a user, I want to track my **Score History** over time on my profile to see how my resume improvements are impacting my optimize score.

---

## 5. Technical Highlights (For Supervisor Context)
*   **Frontend:** Built with **React 18+ (Vite)** for a high-performance, responsive experience.
*   **Visuals:** Uses **Framer Motion** for premium animations and **Recharts** for data visualization.
*   **Backend:** Powered by **NestJS** ensures scalable architecture.
*   **AI Integration:** Utilizes **OpenAI** (via backend service) for context-aware resume auditing.
*   **Security:** Implements secure authentication flows and validation layers.

## 6. Business Value Proposition
1.  **Market Need:** Solves the "Black Box" problem of modern hiring where 75% of resumes are rejected by ATS.
2.  **User Retention:** The "History" and "Profile" features encourage repeated use as candidates tweak their resumes for different applications.
3.  **Differentiation:** Unlike generic text checkers, TalentLens uses a *context-aware* comparison against specific Job Descriptions.
