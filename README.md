# 🔧 DevOps AI Triage Platform

AI-powered log analysis and intelligent troubleshooting for DevOps/SRE teams

## ✨ Features

- **Smart Log Parsing** - Automatic error detection and syntax highlighting
- **AI-Powered Root Cause Analysis** - Intelligent error diagnosis with confidence scores
- **Iterative Troubleshooting** - Step-by-step command suggestions
- **Web Search Integration** - Find solutions from Stack Overflow and GitHub
- **Export Reports** - Generate Markdown reports for documentation
- **Dark Mode** - Easy on the eyes for long debugging sessions

## 🏗 Architecture

**Backend**: Go + Gin framework  
**Frontend**: React + Vite + Tailwind CSS  
**AI**: HuggingFace API (with fallback pattern matching)  
**Search**: Tavily API  
**Deployment**: Render (backend) + Vercel (frontend)

## 🚀 Quick Start

### Prerequisites

- Go 1.21+
- Node.js 18+
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd devops-triage
```

2. **Backend Setup**
```bash
cd backend
go mod download
cp .env.example .env
# Edit .env with your API keys
go run main.go
```

3. **Frontend Setup** (new terminal)
```bash
cd frontend
npm install
npm run dev
```

4. **Open browser**
```
http://localhost:3000
```

## 🔑 Environment Variables

### Backend (.env)
```
HF_TOKEN=your_huggingface_token
TAVILY_API_KEY=your_tavily_key
PORT=8080
ENVIRONMENT=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8080
```

## 📸 Screenshots

### Landing Page
Paste any log or error message for instant analysis.

### Analysis Results
Get root cause analysis, command suggestions, and iterative troubleshooting.

## 💡 Why These Choices?

- **Go**: High performance, excellent concurrency for handling multiple requests
- **Pattern Matching + AI**: Fast instant responses with AI fallback for complex issues
- **Free Tier Stack**: 100% deployable on free tiers for cost-effective demos
- **Modular Design**: Clean separation of concerns for easy maintenance

## 🛠 Tech Stack Details

### Backend
- Gin (HTTP framework)
- HuggingFace Inference API
- Tavily Search API
- Pattern-based error detection

### Frontend
- React 18
- Vite (build tool)
- Tailwind CSS
- Lucide React (icons)

## 📝 API Endpoints

- `POST /api/analyze` - Analyze logs and errors
- `POST /api/iterate` - Iterative troubleshooting
- `POST /api/search` - Web search for solutions

## 🔮 Future Enhancements

- [ ] Runbook generation
- [ ] Slack/Discord integration
- [ ] Screenshot analysis with vision models
- [ ] Team collaboration features
- [ ] Incident timeline tracking

## 📄 License

MIT

## 👤 Author

Built as a portfolio project showcasing DevOps/SRE + AI integration expertise.
