# ShopSmart AI — Autonomous E-Commerce & Intelligence Platform

[![Python](https://img.shields.io/badge/Python-3.12%2B-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111%2B-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%20%2B%20pgvector-336791.svg?logo=postgresql&logoColor=white)](https://github.com/pgvector/pgvector)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748.svg?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-3.8%20Flash-4285F4.svg?logo=google&logoColor=white)](https://aistudio.google.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF.svg?logo=clerk&logoColor=white)](https://clerk.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **ShopSmart AI** is an enterprise-grade autonomous commerce platform combining deterministic catalog search, grounded multi-agent workflows, and high-precision **Retrieval-Augmented Generation (RAG)** powered by PostgreSQL + pgvector and Google Gemini. Designed with the minimalist, Swiss-typography aesthetic of [wrapper.framer.ai](https://wrapper.framer.ai/).

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Database Setup with Docker](#database-setup-with-docker)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [RAG Policy & Knowledge Pipeline](#-rag-policy--knowledge-pipeline)
- [API Reference](#-api-reference)
- [Testing & Evaluation](#-testing--evaluation)
- [Demo Personas](#-demo-personas)
- [Design Aesthetics](#-design-aesthetics)

---

## 🌟 Overview

Modern online shoppers struggle with information overload, ambiguous return/warranty policies, and robotic chatbots that hallucinate inventory and prices. 

**ShopSmart AI** solves this by establishing a **deterministic boundary** between language models and enterprise data:
1. **Zero-Hallucination Catalog Assistant**: Natural-language intent and budget constraints are extracted by LLMs, but product recommendations are retrieved deterministically from verified catalog tables.
2. **Strictly Grounded RAG Knowledge Base**: Internal policy PDFs, Markdown docs, and JSON specifications are parsed, chunked, and embedded into a 768-dimensional pgvector index. The system synthesizes answers **only** when evidence meets calibrated similarity thresholds (`≥ 0.25` medium, `≥ 0.40` high) and cites exact `(Document, Section, Version)` sources. If evidence is missing, it safely declines without hallucination.
3. **Simulated Lifecycle Workflows**: Complete cart, checkout, order state machine, and shipment tracking timelines.
4. **Auditability & Explainability**: Every AI inference logs intent, candidates, scores, execution latency, and retrieved chunk IDs to `ai_decision_logs`.

---

## ✨ Key Features

### 🛍️ E-Commerce Storefront
- **Catalog Explorer**: Category hierarchy, multi-facet filtering (brand, price range, stock status, ratings), full-text search, and pagination.
- **Side-by-Side Product Comparison**: Compare specifications, dimensions, warranties, and pricing for 2 to 4 products simultaneously.
- **Cart & Wishlist**: Persistent cart, stock validation, and instant wishlist toggles.
- **Order Tracking**: Visual shipment timeline (`PLACED` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED`).

### 🤖 Autonomous AI Shopping Assistant (`POST /api/v1/ai/recommend`)
- Natural-language query parsing (e.g., *"Find me lightweight noise-cancelling headphones under $250 with at least 20 hours battery"*).
- Returns structured JSON response:
  - `interpretedRequirement`: Summarized customer intent and parsed constraints.
  - `budget`: Extracted currency and budget ceiling.
  - `recommendations[]`: Top candidate items with explicit grounded reasoning.
  - `clarifyingQuestion`: Proactive follow-up if requirements are ambiguous.

### 📚 RAG Knowledge & Policy Engine (`POST /knowledge/ask`)
- **Multi-Format Ingestion**: Ingests PDF (`pypdf`), Markdown (heading splitter), and JSON policy documents into transactional records.
- **pgvector Cosine Search**: Efficient vector similarity search against 768-dimensional text embeddings (`text-embedding-004`).
- **SQL Pre-Filtering**: Restricts chunk retrieval by document status (`PUBLISHED`), effective dates (`effective_date <= CURRENT_DATE`), regional applicability, category, and customer membership tiers (**Basic**, **Prime**, **Premium VIP**).
- **Safe Fallback & Abstention**: Rejects unanswerable queries before calling the generative LLM if similarity is below calibrated thresholds.
- **Traceable Attribution**: Returns citations with document title, section heading, version number, and chunk IDs.

### 🛡️ Security & Enterprise Governance
- **Authentication**: Clerk JWT bearer token authentication with claims validation, plus local mock authorization bypass for offline testing.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for Customers, Prime VIP members, and Store Administrators.
- **Audit Logging**: Full traceability with `ai_decision_logs` and `audit_events`.

---

## 🏗️ System Architecture

```mermaid
flowchart TB
    subgraph Client["Frontend Layer (React 19 + Vite)"]
        UI[Wrapper Framer Web App]
        CatalogUI[Catalog & Compare Tray]
        AssistantUI[Autonomous Shopping Chat]
        PolicyUI[RAG Policy & Knowledge Assistant]
        AdminUI[Admin Documents & Audit Portal]
    end

    subgraph API["Backend Layer (FastAPI Modular Monolith)"]
        Router[FastAPI API Gateway /api/v1]
        Auth[Clerk Auth & RBAC Middleware]
        CatalogSvc[Catalog & Search Service]
        AISvc[AI Shopping Orchestrator]
        RAGSvc[RAG Ingestion & Retrieval Service]
        OrderSvc[Order & Simulation Engine]
    end

    subgraph AI["AI & Embedding Services"]
        Gemini[Google Gemini 3.8 Flash]
        Embeddings[Text Embedding 004 (768-dim)]
        FakeLLM[Deterministic FakeLLM (Offline Benchmark)]
    end

    subgraph Data["Persistence Layer"]
        PG[(PostgreSQL 16)]
        PGVector[(pgvector Extension)]
        Prisma[Prisma ORM / SQLAlchemy Core]
    end

    UI --> Router
    Router --> Auth
    Auth --> CatalogSvc
    Auth --> AISvc
    Auth --> RAGSvc
    Auth --> OrderSvc

    CatalogSvc --> Prisma --> PG
    OrderSvc --> Prisma --> PG

    RAGSvc --> Embeddings
    RAGSvc --> PGVector
    RAGSvc --> Gemini

    AISvc --> CatalogSvc
    AISvc --> Gemini
```

---

## 💻 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 8, React Router v7, Lucide Icons, Geist / Geist Mono typography |
| **Styling** | Vanilla CSS Design System inspired by `wrapper.framer.ai` (Glassmorphism, Bento Grid, Dark/Light modes) |
| **Backend** | Python 3.12+, FastAPI, Uvicorn, Pydantic v2, Pydantic Settings |
| **Database & ORM** | PostgreSQL 16, `pgvector`, Prisma ORM (Python Client), SQLAlchemy Core |
| **AI & Embeddings** | Google Gemini (`google-genai`), `text-embedding-004` (768 dimensions), FakeLLM offline mock engine |
| **Authentication** | Clerk (`clerk-backend-api`, `@clerk/react`), JWT bearer tokens, mock persona bypass |
| **Background Jobs** | Inngest (`inngest.fast_api`) |
| **Document Parsing**| `pypdf` (PDF), Python Markdown heading splitter, JSON structured parser |
| **Testing** | `pytest`, `pytest-asyncio`, `httpx` |

---

## 📂 Repository Structure

```
Hack-NullVoid/
├── .env.example                     # Environment variables template
├── docker-compose.yml               # Local PostgreSQL 16 + pgvector container
├── PRD.md                           # Comprehensive Product Requirements Document
├── design.md                        # Architecture & technical specification
├── shopsmart-ai-4-hour-plan.md      # Implementation roadmap
│
├── backend/                         # FastAPI Modular Monolith
│   ├── app/
│   │   ├── ai/                      # LLM clients, prompt engineering, grounded schemas
│   │   ├── core/                    # App config, database connections, error handlers, middleware
│   │   ├── models/                  # SQLAlchemy / pgvector entity definitions
│   │   ├── routers/                 # API route controllers (catalog, AI, knowledge, orders, auth)
│   │   ├── schemas/                 # Pydantic request / response contracts
│   │   ├── services/                # Business logic (RAG service, document parser, catalog)
│   │   └── main.py                  # FastAPI application entrypoint & lifespan
│   ├── prisma/
│   │   └── schema.prisma            # Prisma schema (Products, Users, Orders, RAG models)
│   ├── scripts/
│   │   ├── seed_products.py         # Catalog dataset seeder
│   │   └── seed_rag_documents.py    # Policy documents vector seeder
│   ├── tests/                       # Unit, integration, and benchmark tests
│   └── requirements.txt             # Backend dependencies
│
├── frontend/                        # React 19 Single Page Application
│   ├── src/
│   │   ├── api/                     # Axios / fetch clients for backend endpoints
│   │   ├── assets/                  # High-resolution executive portraits & SVG graphics
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Wrapper Framer floating header & theme toggle
│   │   │   ├── Footer.jsx           # Enterprise footer & live system status
│   │   │   ├── AdminKnowledgeTab.jsx# Document upload form & ingestion table
│   │   │   └── commerce/            # Compare tray, product cards, shipment timelines
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Wrapper Framer landing page (mockup, bento, stories, FAQ)
│   │   │   ├── Catalog.jsx          # Filterable product discovery
│   │   │   ├── Assistant.jsx        # Conversational shopping assistant
│   │   │   ├── KnowledgePage.jsx    # Customer RAG policy assistant & demo query chips
│   │   │   ├── Orders.jsx           # Simulated order tracking
│   │   │   └── Compare.jsx          # Side-by-side product comparisons
│   │   └── styles/
│   │       └── index.css            # Wrapper design tokens, ambient glow, pill buttons
│   └── package.json                 # Frontend dependencies
│
├── data/
│   └── knowledge_documents/         # Ingestion policies (PDF, Markdown, JSON)
│       ├── pdf/                     # Warranty and return PDF documents
│       ├── markdown/                # Markdown shipping & tier policies
│       └── json/                    # Structured FAQ and return matrix JSON
│
└── tests/
    └── rag_evaluation.json          # 89-case comprehensive RAG evaluation benchmark
```

---

## 🚀 Getting Started

### Prerequisites

- **Docker Desktop** (for PostgreSQL + pgvector)
- **Python 3.12+**
- **Node.js 18+** & **npm**

---

### 1. Environment Variables

Copy the template file to `.env`:

```bash
# In workspace root
cp .env.example .env

# And copy to backend directory
cp .env.example backend/.env
```

Key environment configurations:
- `GEMINI_API_KEY`: Your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
- `USE_FAKE_LLM`: Set to `true` for offline/deterministic test runs without API quotas; `false` to use live Gemini.
- `CLERK_MOCK_AUTH`: Set to `true` for easy local development without configuring Clerk credentials.

---

### 2. Database Setup with Docker

Start the PostgreSQL 16 container with the `pgvector` extension pre-installed:

```bash
docker-compose up -d db
```

Verify that the database is running:
```bash
docker ps
# Output should show container `shopsmart-db` listening on port 5432
```

---

### 3. Backend Setup

1. **Create and activate a Python virtual environment**:
   ```bash
   # Windows PowerShell
   cd backend
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1

   # Linux / macOS
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Push Prisma schema to the database**:
   ```bash
   prisma db push --schema prisma/schema.prisma
   ```

4. **Seed catalog and RAG policy documents**:
   ```bash
   # Seed 50+ categorized products
   python scripts/seed_products.py

   # Seed RAG policy documents (PDF, Markdown, JSON) into pgvector
   python scripts/seed_rag_documents.py
   ```

5. **Start the FastAPI development server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   The API will be available at: **`http://localhost:8000`**  
   Interactive Swagger documentation: **`http://localhost:8000/docs`**

---

### 4. Frontend Setup

1. **Navigate to the frontend folder and install packages**:
   ```bash
   cd ../frontend
   npm install
   ```

2. **Start the Vite development server**:
   ```bash
   npm run dev
   ```
   Open your browser at: **`http://localhost:5173`**

3. **Validate production bundle**:
   ```bash
   npm run build
   ```

---

## 🔍 RAG Policy & Knowledge Pipeline

The RAG pipeline strictly follows the requirements in **PRD.md (§6.4, §8.3, §10)**:

### Ingestion Pipeline
- **Validation**: Strict file sniffing (validates `%PDF-` magic bytes, JSON syntax, UTF-8 Markdown; rejects null bytes and files `> 2MB`).
- **Version Immutability**: Enforces unique `(title, version)` constraint. Uploading a document with an existing title and version raises an HTTP `409 Conflict`.
- **Chunking**: Splits documents into ~800 character passages with ~100 character overlap, preserving section headings.

### Retrieval & Grounding
- **Embedding**: Generates 768-dimensional embeddings via `text-embedding-004`.
- **Pre-Filtering**: Applies SQL constraints before semantic similarity ranking:
  - `status IN ('PUBLISHED', 'APPROVED')`
  - `effective_date <= CURRENT_DATE`
  - Optional `region`, `category`, and `membership_tier` filters.
- **Calibrated Thresholds**:
  - `similarity >= 0.40`: **HIGH** confidence.
  - `0.25 <= similarity < 0.40`: **MEDIUM** confidence.
  - `similarity < 0.25`: **LOW** confidence ➔ **Safe abstention** (*"I do not have sufficient policy information..."*).

---

## 📡 API Reference

Interactive OpenAPI documentation is hosted at `http://localhost:8000/docs`. Key routes:

| Method | Path | Description | Access |
|---|---|---|---|
| `GET` | `/api/v1/health` | Service health check and dependency status | Public |
| `GET` | `/api/v1/products` | Paginated catalog search with filters and sorting | Public |
| `GET` | `/api/v1/products/{id}` | Product details with specs and images | Public |
| `GET` | `/api/v1/categories` | Complete category hierarchy | Public |
| `POST`| `/api/v1/ai/recommend` | Natural-language product recommendation | Customer |
| `POST`| `/knowledge/ask` | RAG policy question answering | Public / Customer |
| `POST`| `/api/v1/admin/knowledge/documents` | Multipart document ingestion (PDF, MD, JSON) | Admin |
| `GET` | `/api/v1/admin/knowledge/documents` | List ingested documents and chunks | Admin |
| `GET` | `/api/v1/orders` | Customer order history | Customer |
| `GET` | `/api/v1/orders/{id}` | Order details with shipment simulation timeline | Customer |
| `POST`| `/api/v1/cart` | Add items to cart with inventory check | Customer |
| `GET` | `/api/v1/admin/audit/decisions` | AI decision and RAG retrieval audit logs | Admin |

---

## 🧪 Testing & Evaluation

### 1. Run Backend Test Suite
```bash
cd backend
python -m pytest tests/test_rag_pipeline.py tests/test_rag_evaluation.py -v
```

### 2. RAG Evaluation Corpus Benchmark
The repository includes an 89-case evaluation benchmark in `tests/rag_evaluation.json` that tests:
- Grounded factual retrieval across warranty, return windows, and tier perks.
- Safe abstention on out-of-scope / adversarial queries.
- SQL metadata filtering by membership tier.

**Current Test Results**: **5/5 test suites passed (100%)**, verifying all **89 evaluation cases**.

---

## 👥 Demo Personas

When testing with `CLERK_MOCK_AUTH=true`, switch personas by passing the `X-Mock-User-Id` header or clicking **Switch Demo Persona** in the navbar:

| Persona | Tier | Region | Capabilities |
|---|---|---|---|
| **Sarah Jenkins** (`user_basic`) | Basic | US | Standard 14-day return window, standard shipping |
| **Marcus Vance** (`user_prime`) | Prime | US | Extended 30-day return window, free 2-day delivery |
| **Elena Rostova** (`user_vip`) | Premium VIP | EU | Extended 60-day window, complimentary accidental warranty |
| **Alex Mercer** (`admin_user`) | Admin | Global | Full catalog management, RAG document ingestion, audit logs |

---

## 🎨 Design Aesthetics

The frontend design replicates the clean, state-of-the-art interface of [wrapper.framer.ai](https://wrapper.framer.ai/):
- **Typography**: Precision letter-spacing with Google's **Geist** and **Geist Mono**.
- **Interactive macOS Window Mockup**: Live macOS application window with real SVG spline charts comparing revenue and return rates.
- **Asymmetric Bento Grid**: Structured high-contrast feature cards with interactive Slack and RAG grounding previews.
- **Editorial Customer Stories**: Executive portrait cards with dark gradient overlays.
- **Dark & Light Mode**: Fluid transitions between Obsidian Dark and Clean Porcelain themes.

---

## 📄 License

This project was built for the **Hack-NullVoid** Hackathon under the [MIT License](LICENSE).
