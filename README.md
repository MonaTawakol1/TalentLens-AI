# TalentLens AI - Next-Gen Resume Intelligence

![TalentLens AI Banner](https://via.placeholder.com/1200x400?text=TalentLens+AI+Benchmark)

**TalentLens AI** is an advanced AI-powered career platform designed to help job seekers optimize their resumes, analyze skill gaps, and significantly improve their chances of landing their dream job. Built with a modern, high-performance frontend stack, it delivers recruiter-level insights and ATS compatibility checks in real-time.

---

## 🚀 Key Features (Mapped to User Stories)

### 📄 Resume Analysis & Parsing
*   **Drag & Drop Upload**: Support for PDF and DOCX formats with instant validation.
*   **Smart Parsing**: Automatically extracts skills, experience, and contact info (Mock Integration).
*   *Covers Epic 1 & 2*

### 🤖 Multi-Agent AI Evaluation
A simulated multi-agent system evaluates your profile from different perspectives:
1.  **ATS Agent**: Checks keywords and formatting to ensure passability. (*Epic 5 & 8*)
2.  **Recruiter Agent**: Provides qualitative feedback on impact and clarity. (*Epic 6 & 8*)
3.  **Tech Agent**: Analyzes technical hard skills against job requirements. (*Epic 8*)

### 🎯 Job Matching & Skill Gap Analysis
*   **Job Match Score**: Instant percentage match against a specific job description. (*Epic 4*)
*   **Visual Gap Analysis**: Interactive Radar and Bar charts showing missing critical skills. (*Epic 4 & 9*)
*   **Actionable Insights**: Prioritized list of improvements. (*Epic 7*)

### 📊 Comprehensive Reporting
*   **Interactive Dashboard**: Tabbed interface for Overview, Skill Gap, ATS Check, and Line-by-Line Review.
*   **Downloadable Reports**: Generate full PDF reports of your analysis for offline use. (*Epic 10*)
*   **Score Explanation**: Transparent breakdown of how scores are calculated. (*Epic 9*)

### 👤 User Profile & History
*   **Career Dashboard**: personalized hub tracking score progression over time. (*Epic 10*)
*   **Analysis History**: Save and manage previous resume versions.
*   **Authentication**: Secure Login and Registration system to protect user data.

---

## 🛠️ Technology Stack

*   **Core**: [React](https://react.dev/) (v18)
*   **Build Tool**: [Vite](https://vitejs.dev/) - For lightning-fast development and optimized production builds.
*   **Styling**: Vanilla CSS with CSS Variables for theming (No external CSS frameworks like Tailwind, ensuring custom, lightweight design).
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) - For smooth transitions and engaging UI.
*   **Data Visualization**: [Recharts](https://recharts.org/) - For dynamic skill gap charts and score graphs.
*   **Icons**: [Lucide React](https://lucide.dev/) - Clean, consistent iconography.
*   **Routing**: React Router DOM.

---

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v16 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/talent-lens-ai.git
    cd talent-lens-ai
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Visit `http://localhost:5173` to view the application.

---

## 📂 Project Structure

```
src/
├── components/      # Reusable UI components (Buttons, Cards, Navbar)
├── context/         # Global state management (AuthContext)
├── pages/           # Main application pages
│   ├── Landing.jsx        # Home page
│   ├── ResumeAnalysis.jsx # Upload & Job Description input
│   ├── Results.jsx        # The core analysis dashboard (Charts, Tabs)
│   ├── Profile.jsx        # User history & career tracking
│   ├── Login/Register.jsx # Authentication pages
│   └── ...
├── App.jsx          # Main routing & layout configuration
└── main.jsx         # Entry point
```

---

## 🔮 Future Roadmap (Backend Integration)

The frontend is **95% ready** for backend connectivity.
*   **Phase 1**: Connect `Results.jsx` to real RAG (Retrieval-Augmented Generation) API.
*   **Phase 2**: Replace `localStorage` in `AuthContext` with JWT/Session-based authentication.
*   **Phase 3**: Implement persistent database storage for Job Descriptions and Resume Parsing history.

---

**TalentLens AI** — *See your potential clearly.*
