# Cryptonian - Web3 Gamified Learning Platform

## Overview
Cryptonian is a gamified Web3 learning platform that teaches **Indian geography, history, and Web3 fundamentals** through **CV-powered games and puzzles**. Users earn tokens, complete tasks, and mint NFTs while engaging with the content.

---

## Getting Started

### **Clone the Repository**
```bash
git clone https://github.com/yourusername/cryptonian.git
cd cryptonian
```

### **Backend Setup** (FastAPI)
```bash
uvicorn main:app --reload
```

### **Frontend Setup**
**Landing Pages (Next.js):**
```bash
cd frontend
npm install
npm run dev
```

**Main App (Streamlit):**
```bash
streamlit run app.py
```

---

## Features

### **Learning Section**
- **Gemini AI Chatbot** – Helps users understand about the app.
- **Interactive Lessons** – Engaging educational content.
- **Lesson Quizzes** – Users take quizzes to test their knowledge before proceeding to games.

### **Game Suite**
- **Monument Scanner** – Snap a picture of a landmark and earn tokens.
- **NFT Puzzle** – Solve puzzles to earn NFT pieces.
- **Map Quiz** – Answer geography-based questions.
- **Minesweeper: Indian Edition** – A regional twist on the classic game.
- **Timeline Tactician** – Arrange historical events in the correct sequence.
- **Artefact Assembler** – Assemble pieces of historical artifacts.

### **Wallet & Web3 Integrations**
- **Petra Wallet (Aptos)** – Users connect their wallets for transactions.
- **NFT Marketplace** – Users can trade and collect NFTs.
- **Token Rewards** – Users earn tokens for completing challenges.

### **Progress & Tracking**
- **Global Leaderboard** – Tracks top users based on NFTs earned and quiz success rate.
- **User Profiles** – Stores learning progress, collected NFTs, and achievements.

---

## Tech Stack

### **Frontend**
- **Streamlit** – Main app interface.
- **Next.js** – Landing pages and marketing site.

### **Backend**
- **FastAPI** – Handles wallet authentication and minimal API calls.

### **Database**
- **MongoDB** – Stores user profiles, progress, and leaderboard data.

### **Blockchain & Web3**
- **Aptos Blockchain** – Handles NFT and token transactions.
- **Petra Wallet** – Wallet authentication and transactions.
- **Move** – Smart contract execution.

### **Other Services**
- **Gemini API** – AI-powered chatbot.

---

## System Flow 

- **Wallet Connection:** Users authenticate via FastAPI, which links their Petra Wallet.
- **Learning Section:** Users start with lessons, Gemini chatbot, and quizzes before proceeding to games.
- **Games & Rewards:** Users earn NFTs and tokens by completing tasks, which are stored on the blockchain.
- **Data Storage:** MongoDB keeps track of user profiles, progress, and leaderboards.
- **Marketplace & Transactions:** Users can trade NFTs and interact with the blockchain directly through Aptos.

---

