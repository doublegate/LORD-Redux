
import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { Enemy, Player, ForestEvent } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to safely parse JSON from AI response
const cleanAndParseJSON = (text: string | undefined): any => {
  if (!text) return null;
  
  // 1. Remove Markdown code blocks first
  let clean = text.replace(/```json\s*|```\s*/g, "").trim();

  // 2. Try direct parse
  try {
    return JSON.parse(clean);
  } catch (e) {
    // 3. If direct parse fails, try extracting the outer JSON object
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      const jsonCandidate = clean.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(jsonCandidate);
      } catch (e2) {
        console.warn("JSON Parse Failed even after extraction:", e2);
      }
    } else {
        console.warn("No JSON object found in response");
    }
  }

  return null;
};

// Common safety settings to prevent blocking fantasy combat descriptions
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
];

// --- GENERATION TASKS ---

export const generateMonster = async (playerLevel: number): Promise<Enemy> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', 
      contents: `Generate a fantasy monster for a level ${playerLevel} player.
      Return strictly valid JSON.
      
      Fields:
      - name: string
      - hp, maxHp, str, def, gold, exp: integers (balanced for level)
      - weaponName: string (max 5 words)
      - openingLine: string (max 15 words)
      - asciiArt: string (max 200 chars). USE ONLY STANDARD ASCII CHARACTERS. NO BACKSLASHES. NO QUOTES inside the art. Simple drawing.

      Example Art: "  (o,o) \n  {   } "`,
      config: {
        responseMimeType: "application/json",
        safetySettings: safetySettings,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            hp: { type: Type.INTEGER },
            maxHp: { type: Type.INTEGER },
            str: { type: Type.INTEGER },
            def: { type: Type.INTEGER },
            gold: { type: Type.INTEGER },
            exp: { type: Type.INTEGER },
            weaponName: { type: Type.STRING },
            openingLine: { type: Type.STRING },
            asciiArt: { type: Type.STRING }
          },
          required: ["name", "hp", "maxHp", "str", "def", "gold", "exp", "weaponName", "openingLine"]
        }
      }
    });
    
    const data = cleanAndParseJSON(response.text);
    if (!data) throw new Error("Parsed data is null - Response might be blocked or malformed");
    
    return {
      id: `gen_${Date.now()}`,
      level: playerLevel,
      ...data,
      // Ensure specific fallbacks for optional fields if schema validation is loose
      asciiArt: data.asciiArt || "(o,o)" 
    };
  } catch (error) {
    console.error("Monster Gen Error (Fallback used)", error);
    return {
      id: 'fallback',
      name: 'Shadow Glitch',
      level: playerLevel,
      hp: 20 * playerLevel,
      maxHp: 20 * playerLevel,
      str: 5 * playerLevel,
      def: 2 * playerLevel,
      gold: 10 * playerLevel,
      exp: 15 * playerLevel,
      weaponName: 'Unknown',
      openingLine: 'A dark shape shifts in the mist.',
      asciiArt: "(?_?)"
    };
  }
};

export const generateForestEvent = async (playerLevel: number): Promise<ForestEvent> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Generate a random forest event (non-combat) for level ${playerLevel}.
      Return valid JSON.
      
      Fields:
      - title: string
      - description: string (short)
      - effect: 'GOLD' | 'XP' | 'HEAL' | 'DAMAGE' | 'NOTHING'
      - value: integer
      - resultText: string
      - asciiArt: string (simple, no backslashes)`,
      config: {
        responseMimeType: "application/json",
        safetySettings: safetySettings,
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                effect: { type: Type.STRING, enum: ['GOLD', 'XP', 'HEAL', 'DAMAGE', 'NOTHING'] },
                value: { type: Type.INTEGER },
                resultText: { type: Type.STRING },
                asciiArt: { type: Type.STRING }
            },
            required: ["title", "description", "effect", "value", "resultText"]
        }
      }
    });

    const data = cleanAndParseJSON(response.text);
    if (!data) throw new Error("Parsed data is null");

    return {
        id: `evt_${Date.now()}`,
        ...data,
        asciiArt: data.asciiArt || "..."
    };
  } catch (error) {
    console.error("Event Gen Error (Fallback used)", error);
    return {
        id: 'fallback_evt',
        title: 'Quiet Path',
        description: 'The forest is unusually quiet.',
        effect: 'NOTHING',
        value: 0,
        resultText: 'You walk on.',
        asciiArt: '...'
    };
  }
};

export const chatWithViolet = async (history: {sender: string, text: string}[], newMessage: string, playerName: string): Promise<string> => {
  try {
    const conversation = history.map(h => `${h.sender}: ${h.text}`).join('\n');
    const prompt = `
      You are Violet, the barmaid of the Red Dragon Inn.
      Player: ${playerName}.
      History:
      ${conversation}
      User: ${newMessage}
      Violet (Keep it short, max 2 sentences):
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: { safetySettings }
    });
    return response.text || "I'm busy cleaning glasses, hun.";
  } catch (error) {
    return "Someone spilled ale on my thoughts...";
  }
};

// --- CREATIVE TASKS ---

export const generateItemLore = async (itemName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Write a 2-sentence backstory for a fantasy item named "${itemName}".`,
      config: { safetySettings }
    });
    return response.text || "This item is old and rusty.";
  } catch (error) {
    return "The history of this item has been lost to time.";
  }
};

export const generateMonsterLore = async (monsterName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Write a 2-sentence dark fantasy backstory or legend for a monster named "${monsterName}".`,
      config: { safetySettings }
    });
    return response.text || "A creature from the deep shadows.";
  } catch (error) {
    return "No lore available.";
  }
};

export const getBardPoem = async (playerName: string, level: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Write a short 4-line poem about ${playerName} (Level ${level}).`,
      config: { safetySettings }
    });
    return response.text || "The bard hums a tune.";
  } catch (error) {
    return "The bard is sleeping.";
  }
};

export const generateDailyNews = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: "Write a short 2-sentence fantasy news snippet about the Red Dragon.",
      config: { safetySettings }
    });
    return response.text || "No news today.";
  } catch (error) {
    return "The town crier is missing.";
  }
};

export const getLibraryBook = async (): Promise<{ title: string; content: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: "Generate a fantasy book title and a 3-sentence excerpt. Format: Title|Content",
      config: { safetySettings }
    });
    const text = response.text || "Old Book|Pages missing.";
    const [title, content] = text.split('|');
    return { title: title || "Unknown", content: content || "..." };
  } catch (error) {
    return { title: "Dusty Tome", content: "Unreadable." };
  }
};

// --- THINKING TASKS ---

export const getStrategicAdvice = async (player: Player): Promise<string> => {
  try {
    const statsSummary = `Lvl ${player.level} ${player.name}, HP ${player.hp}/${player.maxHp}, Str ${player.str}, Def ${player.def}, Gold ${player.gold}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Act as Turgon. Analyze stats: ${statsSummary}. Give advice (Max 50 words).`,
      config: {
        thinkingConfig: { thinkingBudget: 1024 }, // Minimal budget
        safetySettings
      }
    });
    return response.text || "Train harder.";
  } catch (error) {
    return "My mind wanders.";
  }
};
