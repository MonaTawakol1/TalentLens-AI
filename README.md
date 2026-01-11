# TalentLens AI - Next-Gen Resume Intelligence

![TalentLens AI Banner](https://via.placeholder.com/1200x400?text=TalentLens+AI)

**TalentLens AI** is an advanced, privacy-focused career optimization platform designed to bridge the gap between job seekers and modern Applicant Tracking Systems (ATS). By leveraging a multi-agent AI architecture, the platform mimics the evaluation process of top-tier recruiters and technical hiring managers, providing instant, actionable feedback to maximize interview chances.

---

## 🚀 Key Features

### 📄 Intelligent Resume Parsing & Handling
*   **Universal Support**: Seamlessly upload **PDF** and **DOCX** formats via a modern drag-and-drop interface.
*   **Smart Extraction**: Automatically parses complex resume layouts to extract skills, experience, and contact details with high accuracy.
*   **File Validation**: Robust client-side and server-side checks ensure only valid, safe documents are processed.

### 🤖 Multi-Agent AI Analysis Engine
Our unique architecture employs three specialized AI agents to evaluate resumes from different perspectives:
1.  **ATS Agent**: Simulates algorithmic screening to ensure your resume passes automated filters (keywords, formatting, readability).
2.  **Recruiter Agent**: Evaluates the "human" element—clarity, impact, action verbs, and narrative flow.
3.  **Tech Agent**: Performs a deep-dive technical audit, comparing your hard skills against specific Job Descriptions (JD) to identify gaps (e.g., "Missing Experience: Docker, GraphQL").

### 🎯 Precision Job Matching
*   **Context-Aware Analysis**: Unlike generic resume checkers, TalentLens compares your profile against a **specific Job Description** you provide.
*   **Match Score**: Get an instant `0-100%` compatibility score based on weighted criteria.
*   **Visual Gap Analysis**: Interactive **Radar Charts** and **Bar Graphs** visually represent your strengths vs. job requirements.

### 📊 Comprehensive Insights Dashboard
*   **Line-by-Line Review**: Detailed feedback on specific sections of your resume.
*   **Actionable Recommendations**: Prioritized list of improvements (e.g., "Add quantitative metrics to your 'Project Lead' role").
*   **Downloadable Reports**: Export your full analysis as a professional PDF for offline reference.

### � User Profile & Progression
*   **History Tracking**: Save and revisit every analysis you've ever run.
*   **Score Trend**: Visualize your improvement over time with dynamic progression charts.
*   **Secure Accounts**: Personal dashboard protected by robust authentication.

---

## 🔒 Security Architecture

TalentLens AI is built with a "Security First" approach to protect sensitive personal data.

### 🔐 Authentication & Authorization
*   **JWT (Json Web Tokens)**: We use stateless, industry-standard JWTs for secure user sessions. Tokens are signed and verified on every request.
*   **Bcrypt Hashing**: User passwords are never stored in plain text. We utilize `bcrypt` with high salt rounds to ensure maximum protection against rainbow table attacks.
*   **Protected Routes**: Middleware guards ensure that sensitive endpoints (like User History or Profile) are accessible **only** to authenticated users.

### 🛡️ Data Protection & Validation
*   **Input Sanitization**: All incoming data is rigorously sanitized to prevent **Cross-Site Scripting (XSS)** and **SQL/NoSQL Injection** attacks.
*   **Strict Validation**: We use `class-validator` and `zod` schemas to enforce strict data types and constraints on both frontend and backend.
*   **File Security**: Uploaded files undergo strict MIME-type and magic-byte verification to prevent malicious file uploads (e.g., preventing executable masquerading as PDFs).

### 🌐 Network Security
*   **CORS Policy**: Configured with strict Cross-Origin Resource Sharing policies to prevent unauthorized domain access.
*   **Rate Limiting**: (Planned) Implementation to protect against Brute Force and DDoS attacks.

---

## 🛠️ Technology Stack

### Frontend
*   **Core**: [React](https://react.dev/) (v18)
*   **Build Tool**: [Vite](https://vitejs.dev/) - Lightning-fast HMR and bundling.
*   **Styling**: Vanilla CSS + CSS Variables (Custom design system).
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) for fluid UI interactions.
*   **Visualization**: [Recharts](https://recharts.org/) for data analytics charts.

### Backend
*   **Framework**: [NestJS](https://nestjs.com/) - Scalable, enterprise-grade Node.js framework.
*   **Database**: PostgreSQL (via [Prisma ORM](https://www.prisma.io/)).
*   **AI Integration**: OpenAI API (GPT-4o) for intelligent analysis.
*   **PDF Processing**: `pdf-parse` for robust text extraction.

---

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn
*   PostgreSQL Database

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/talent-lens-ai.git
    cd talent-lens-ai
    ```

2.  **Install Frontend Dependencies**
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies**
    ```bash
    cd backend
    npm install
    ```

4.  **Environment Setup**
    *   Create a `.env` file in the `backend` directory based on `.env.example`.
    *   Configure your Database URL and OpenAI API Key.

5.  **Run the Application (One-Click)**
    *   Windows users can simply run the `start-app.bat` script in the root directory.
    *   **Or manually**:
        *   Frontend: `npm run dev` in root.
        *   Backend: `npm run start:dev` in `backend` folder.

6.  **Open in Browser**
    Visit `http://localhost:5173` to view the application.

---

## 🔮 Future Roadmap

*   **Social Auth**: Integration with LinkedIn and GitHub for easier login.
*   **Community Hub**: Anonymous resume sharing for peer feedback.
*   **Email Notifications**: Alerts for job market trends matching your skills.

---

**TalentLens AI** — *See your potential clearly.*
