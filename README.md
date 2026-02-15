
# 🔮 Narrative Oracle (The Automated Stack)

The **Narrative Oracle** is a sovereign agentic protocol on Solana that autonomously detects, validates, and accelerates emerging market narratives. Powered by **Ollama (GLM-5/Llama3)**, it synthesizes institutional intelligence, developer activity, and community signals into actionable "Prophecies."

## 🚀 The Automated Stack
This version implements a **fully automated** intelligence pipeline:

### 1. Data Sources (Tiered Weighting)
*   **Institutional Intelligence (50%)**: Parses RSS feeds from **Messari** and **Helius** to detect high-credibility trends.
*   **Developer Activity (30%)**: Scans **GitHub** for trending and recent Solana repositories to identify where builders are migrating.
*   **Community Signals (20%)**: Monitors **Farcaster (via Neynar)** and Reddit (planned) for grassroots momentum.

### 2. Autonomous Synthesis
*   **Agent**: `AutomatedSynthesis`
*   **Model**: Ollama (GLM-5 or Llama3)
*   **Logic**: 
    1.  **Cluster**: Groups disparate signals into coherent narratives.
    2.  **Score**: assigns confidence scores based on multi-source corroboration.
    3.  **Ideate**: Generates 5 concrete "Build Ideas" for each narrative.

## 🛠 Project Structure
*   `packages/agents`: The brain. Contains TypeScript agents for RSS, GitHub, and Farcaster.
*   `web`: The face. A Next.js dashboard displaying active narratives and offering a "Validate" tool for founders.
*   `program`: The soul. An Anchor smart contract for on-chain narrative registration and staking.

## 💻 How to Run

### Prerequisites
*   Node.js v18+
*   Ollama running locally (`ollama serve`)
*   Solana CLI (optional for on-chain features)

### Quick Start
1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start the Agents (Backend)**:
    ```bash
    npx tsx packages/agents/src/orchestrator.ts
    ```
    *Top view the automated detection pipeline in action.*

3.  **Start the Dashboard (Frontend)**:
    ```bash
    cd web
    npm run dev
    ```
    *Visit `http://localhost:3000` to see the Oracle.*

## 🧪 Validating Your Thesis
Navigate to `/validate` on the dashboard. Submit your startup idea to receive a **ruthless 10-point PMF analysis** from Pythia, our specialized validation agent.

## 📜 License
MIT
