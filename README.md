# Insurance Risk Assistant

An AI-powered web tool for insurance underwriters to synthesize risk data into comprehensive assessment reports.

## Features
- **Frontend:** React + Vite, styled with a modern glassmorphism theme using Tailwind CSS.
- **Backend:** Python FastAPI using Clean Architecture.
- **AI Integration:** Uses LangChain with TCS GenAI Lab's GPT-4o model to analyze uploaded risk data.
- **Exporting:** Supports exporting generated AI reports to HTML, PDF, and DOCX formats.
- **Authentication:** Includes a basic JWT-based login system.

## Setup Instructions

Please see the step-by-step instructions below to run the application locally.

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Run the Backend (Python FastAPI)

Navigate to backend directory and start it:
1. cd backend
2. Create virtual environment
3. Install dependencies via pip
4. Run: uvicorn main:app --reload

### 2. Run the Frontend (React + Vite)

Navigate to frontend directory and start it:
1. cd frontend
2. Install dependencies via npm
3. Run dev server via npm
