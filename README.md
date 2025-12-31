
# L.O.R.D. Redux

**A modern, AI-enhanced web recreation of the classic BBS door game _Legend of the Red Dragon_.**

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Gemini API](https://img.shields.io/badge/Google%20GenAI-Gemini%202.0%20%26%203.0-orange)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-teal)

## ⚔️ About The Project

**L.O.R.D. Redux** is a faithful web port of the 1989 BBS classic by Seth Able Robinson. It preserves the beloved ANSI art aesthetic and turn-based gameplay while leveraging modern web technologies and Generative AI to breathe new life into the realm.

Instead of static text databases, this project uses **Google's Gemini API** to procedurally generate monsters, craft unique item lore, power dynamic conversations with NPCs, and provide strategic gameplay advice.

## ✨ Key Features

*   **Classic Gameplay Loop:** Experience the original cycle of fighting in the forest, upgrading gear, challenging rivals in PvP, and flirting with the barmaid.
*   **AI-Powered Immersion:**
    *   **Procedural Monsters:** Uses `gemini-2.0-flash` to generate infinite unique enemies with specific stats, descriptions, and ASCII art.
    *   **Dynamic Events:** Random forest encounters are generated on the fly.
    *   **Interactive NPCs:** Chat naturally with Violet at the Inn (powered by LLM roleplay) or listen to the Bard's procedurally generated poetry.
    *   **Strategic Advice:** Master Turgon utilizes **Gemini 3.0 Pro** with *Thinking Config* to analyze your exact stats and provide gameplay strategy.
*   **Retro UI/UX:**
    *   Custom ANSI art rendered in React.
    *   Keyboard-first navigation (Hotkeys for every action).
    *   CRT-style typography using the VT323 font.
*   **Modern Persistence:** Automatic local storage saving ensures you never lose your progress.

## ⌨️ Controls

The game is designed to be played primarily with the keyboard, mimicking the original terminal experience.

| Key | Action | Location |
| :--- | :--- | :--- |
| **F** | Enter the Forest | Town Square |
| **I** | The Red Dragon Inn | Town Square |
| **S** | Slaughter Other Players (PvP) | Town Square |
| **W** | Weapon Shop | Town Square |
| **A** | Armor Shop | Town Square |
| **H** | Healer's Hut | Town Square |
| **B** | First National Bank | Town Square |
| **T** | Turgon's Training Camp | Town Square |
| **L** | The Library | Town Square |
| **M** | Message Board | Town Square |
| **V** | View Stats | Town Square |
| **Q** | Retire (Reset Game) | Town Square |
| **A** | Attack | Combat |
| **R** | Run Away | Combat / Shops |
| **C** | Continue | Events |

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18+)
*   A Google Cloud Project with the **Gemini API** enabled.

### Installation

1.  **Clone the repository** (or download the source).
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment:**
    Set your API Key in your environment variables.
    ```bash
    export API_KEY="your_google_genai_api_key"
    ```
4.  **Run the application:**
    ```bash
    npm start
    ```

## 🛠️ Tech Stack

*   **Frontend Framework:** React 19
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **AI SDK:** `@google/genai`
*   **Icons:** Lucide React
*   **Font:** VT323 (Google Fonts)

## 📜 Credits & Disclaimer

*   **Original Concept:** *Legend of the Red Dragon* created by Seth Able Robinson.
*   **Development:** Created as a demonstration of modern React + Generative AI capabilities.

*This is a fan recreation and is not affiliated with the original creators.*
