# Multi-Agent AI Interview Platform

An AI-powered interview preparation platform designed to help candidates practise interviews using their resume, target role, and an AI-driven interview workflow.

**Project status:** Phase 1 completed · Phase 2 in planning/development

- **Live frontend:** https://multi-agent-ai-interview-platform-nu.vercel.app/dashboard
- **GitHub repository:** https://github.com/Sakshij2810/Multi-Agent-AI-Interview-Platform

- old aws urls
  frontend url => https://d5bbj6ii7si98.cloudfront.net/
  backend url => https://d2qve6t41xmolj.cloudfront.net/

- **Demo walkthrough:** _Add the video URL here_

> **Deployment note:** The live application uses free-tier hosting. Render may spin down inactive backend services after a period of inactivity (around 15 minutes). The first request after inactivity can therefore be slow or may fail while services start. If the live backend is unavailable, please refer to the project walkthrough video.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Project Status and Roadmap](#project-status-and-roadmap)
- [Phase 1: Completed](#phase-1-completed)
- [Phase 2: What's Coming](#phase-2-whats-coming)
- [Features](#features)
- [High-Level Architecture](#high-level-architecture)
- [Technology Stack](#technology-stack)
- [Deployment](#deployment)
- [Running Locally](#running-locally)
- [Environment Variables](#environment-variables)
- [Repository Structure](#repository-structure)
- [Known Deployment Limitation](#known-deployment-limitation)

---

## Project Overview

The goal of this project is to build a multi-agent AI interview platform that can conduct structured mock interviews and help candidates understand their performance.

The platform brings together a web application, backend services, authentication, resume processing, and an AI-powered interview workflow.

I am building this project in phases. **Phase 1 uses LangGraph to orchestrate the interview workflow.** In Phase 2, I plan to move beyond a framework-managed workflow and implement the core agent loop and tool-calling flow myself to understand and control the underlying agent architecture.

---

## Project Status and Roadmap

| Phase   | Status       | Focus                                                                                            |
| ------- | ------------ | ------------------------------------------------------------------------------------------------ |
| Phase 1 | ✅ Completed | Initial end-to-end platform and LangGraph-based interview workflow                               |
| Phase 2 | 🚧 Upcoming  | Custom agent loop, tool calling, adaptive follow-up questions, and richer interview intelligence |

### Phase 1 — Completed

Phase 1 focused on getting the core application working end to end:

- Built the frontend and backend service structure.
- Added user authentication.
- Implemented resume upload and processing.
- Connected the interview workflow using **LangGraph**.
- Integrated an LLM into the interview service.
- Connected the required data and session infrastructure.
- Deployed the application and documented the deployment setup.

### Phase 2 — Building the Agent Runtime Myself

For Phase 2, I want to understand what happens inside an agent framework instead of depending entirely on its orchestration abstractions.

Planned improvements include:

- **Custom agent loop:** Implement the loop that sends conversation context to the model, interprets the response, executes requested actions, and continues until the interview turn is complete.
- **Tool calling:** Let the model request tools and have the backend validate and execute those calls.
- **Context and conversation management:** Maintain the relevant interview history, candidate context, and tool results across turns.
- **Adaptive next-question generation:** Generate the next question using the candidate's previous answer, the interview context, and areas that need further assessment.
- **Intelligent follow-up questions:** Ask deeper follow-ups when an answer is incomplete or needs clarification.
- **Answer evaluation:** Evaluate answers against relevant criteria and use the result to guide the next step.
- **Interview flow control:** Give the agent the ability to decide whether to ask a follow-up, move to a new topic, or conclude the interview.
- **More detailed feedback:** Improve the final evaluation with actionable strengths, weaknesses, and areas to practise.

These are planned Phase 2 capabilities, not claims that every item is already implemented.

---

## Features

The following describes the Phase 1 application scope. Features marked as planned belong to Phase 2.

### Authentication and User Access

- User authentication through Firebase.
- Protected application access for authenticated users.
- Backend authentication/session handling.

### Resume Processing

- Upload a candidate resume in PDF format.
- Extract text from the uploaded PDF.
- Process the extracted resume content through the resume-analysis workflow.
- Produce structured resume-analysis data for the application.

### AI-Powered Interview Workflow

- Interview workflow orchestrated with **LangGraph** in Phase 1.
- LLM-powered interview question generation.
- Interview questions configured around the candidate's interview context.
- Structured interview flow with question and response handling.
- Interview service integrated into the backend architecture.

### Backend Services and Data

- Separate backend services for application responsibilities.
- Gateway service to route API requests to the relevant backend services.
- Redis used for session-related functionality.
- MongoDB used for application data.
- Service-to-service communication within the backend.

### Frontend Application

- React-based dashboard and application interface.
- Client-side routing.
- State management with Redux Toolkit.
- API communication with backend services.
- Tailwind CSS-based styling.

---

## High-Level Architecture

The application is organised into a frontend and multiple backend services.

```text
                     Candidate
                         |
                         v
              React + Vite Frontend
                         |
                         | API requests
                         v
                  API Gateway
                         |
             +-----------+-----------+
             |                       |
             v                       v
       Authentication           Resume Service
          Service                    |
             |                       v
             v                 PDF Text Extraction
       Firebase Admin                 |
             |                       v
             v                 Resume Analysis
       Redis Sessions
             |
             |
             +-------------------------------+
                                             |
                                             v
                                      Interview Service
                                             |
                                             v
                                      LangGraph Workflow
                                             |
                                             v
                                           LLM
                                             |
                                             v
                                   Interview Response
```

**Phase 2 direction:** Replace the LangGraph-managed interview orchestration with a custom agent runtime consisting of an agent loop, model interaction, tool execution, and context management.

---

## Technology Stack

| Area                          | Technologies                                    |
| ----------------------------- | ----------------------------------------------- |
| Frontend                      | React, Vite, Tailwind CSS                       |
| State management              | Redux Toolkit                                   |
| Authentication                | Firebase Authentication, Firebase Admin         |
| Backend                       | Node.js, Express                                |
| AI workflow — Phase 1         | LangGraph                                       |
| LLM integration               | LangChain / ChatGroq                            |
| Resume processing             | PDF text extraction and resume-analysis service |
| Database                      | MongoDB                                         |
| Session infrastructure        | Redis                                           |
| Deployment and infrastructure | AWS, Docker, Vercel, Render                     |

---

## Deployment

I initially deployed the application using **AWS for the overall deployment setup**. The repository's [`deployment/`](./deployment) folder contains the deployment notes, configuration references, and supporting documentation for that setup.

The AWS deployment work covered infrastructure such as:

- Amazon ECR for container image storage.
- Virtual server deployment.
- Security group configuration.
- Load balancer setup.
- Target group configuration.

After the free-tier period for the initial AWS setup ended, I moved to the following hosting arrangement:

| Component        | Hosting |
| ---------------- | ------- |
| Frontend         | Vercel  |
| Backend services | Render  |

### Current Live URL

[Open the application dashboard](https://multi-agent-ai-interview-platform-nu.vercel.app/dashboard)

### Important: Free-Tier Backend Behaviour

The backend is currently hosted on Render's free tier. Inactive services can spin down after approximately 15 minutes of inactivity.

As a result:

- The first request after a period of inactivity may take longer while the service starts.
- Some requests may temporarily fail or return a gateway error while backend services are waking up.
- The live application may not work immediately every time you open it.

This is a hosting limitation rather than an intended application behaviour. For a complete view of the project, please refer to the demo walkthrough:

**Demo video:** _Add your video URL here._

---

## Running Locally

The repository contains multiple frontend and backend services. Their individual setup instructions and scripts should be followed from their respective directories.

At a high level:

1. Clone the repository.
2. Install the dependencies for the frontend and each backend service.
3. Configure the required environment variables for each service.
4. Start the required infrastructure, including MongoDB and Redis.
5. Start the backend services and API gateway.
6. Start the frontend development server.
7. Open the local frontend URL in your browser.

```bash
git clone https://github.com/Sakshij2810/Multi-Agent-AI-Interview-Platform.git
cd Multi-Agent-AI-Interview-Platform
```

> Refer to the individual service directories and the `deployment/` folder for the exact commands and configuration required by the current repository version.

---

## Environment Variables

The application uses environment variables for credentials, service configuration, database connections, and external integrations.

Create the required `.env` files in the appropriate service directories using the variable names expected by each service.

**Do not commit `.env` files, Firebase service-account JSON files, private keys, or other secrets to GitHub.** Use your hosting provider's environment-variable settings for deployed services.

---

## Repository Structure

The repository is organised around the frontend, backend services, and deployment documentation. The exact directory contents may evolve as the project moves into Phase 2.

```text
Multi-Agent-AI-Interview-Platform/
├── frontend/
├── backend/
│   ├── gateway/
│   └── services/
│       ├── auth/
│       ├── resume/
│       └── interview/
├── deployment/
└── README.md
```

---

## Known Deployment Limitation

The current Render free-tier backend may spin down after inactivity. If the live dashboard does not load interview or resume functionality immediately, allow time for the services to wake up and retry.

For a reliable overview of the current implementation, use the demo walkthrough video linked above.

---

## What's Next?

Phase 1 established the application foundation and a LangGraph-based interview workflow.

Now the focus shifts to understanding and implementing the agent runtime itself:

**Custom Agent Loop → Tool Calling → Context Management → Adaptive Interviews**

More improvements and capabilities are coming in Phase 2.

If you explore the project, feedback and suggestions are welcome!
