
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Player, GameLocation, LogEntry, LogType, Enemy, Item, MessagePost, Rival, ChatMessage, ForestEvent } from '../types';
import { INITIAL_PLAYER, LEVEL_EXP, MONSTERS, RIVALS } from '../constants';
import { generateMonster, getStrategicAdvice, generateDailyNews, generateForestEvent } from '../services/geminiService';

interface GameContextType {
  player: Player;
  location: GameLocation;
  logs: LogEntry[];
  currentEnemy: Enemy | null;
  currentEvent: ForestEvent | null;
  messageBoard: MessagePost[];
  rivals: Rival[];
  effectiveCharm: number;
  dailyNews: string;
  isGenerating: boolean;
  lastSaved: Date | null;
  
  // Actions
  login: (name: string) => void;
  move: (loc: GameLocation) => void;
  addLog: (text: string, type: LogType) => void;
  setGenerating: (val: boolean) => void;
  
  // Combat
  startFight: () => void;
  startPvP: (rivalId: string) => void;
  attack: () => void;
  run: () => void;
  
  // Events
  resolveEvent: () => void;
  
  // Economy
  buyItem: (item: Item) => void;
  deposit: (amount: number) => void;
  withdraw: (amount: number) => void;
  
  // Stats & Services
  heal: () => void; // Inn heal (rest)
  healCustom: (amount: number) => void; // Healer's hut
  train: () => void;
  askTurgon: () => Promise<string>;
  readBook: (title: string) => void;
  postMessage: (text: string) => void;
  refreshNews: () => void;
  
  // System
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};

// Save System Constants
const SAVE_KEY = 'lord_redux_save_v1';

interface SavedState {
  player: Player;
  location: GameLocation;
  logs: LogEntry[];
  currentEnemy: Enemy | null;
  currentEvent: ForestEvent | null;
  rivals: Rival[];
  messageBoard: MessagePost[];
  dailyNews: string;
}

// Helper to load the entire state at once
const loadSavedGame = (): SavedState | null => {
  try {
    const stored = localStorage.getItem(SAVE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.warn("Failed to load save game:", e);
    return null;
  }
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state - Try to load from save, otherwise use defaults
  const [player, setPlayer] = useState<Player>(() => {
    const saved = loadSavedGame();
    return saved?.player ?? INITIAL_PLAYER;
  });

  const [location, setLocation] = useState<GameLocation>(() => {
    const saved = loadSavedGame();
    return saved?.location ?? GameLocation.LOGIN;
  });

  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = loadSavedGame();
    return saved?.logs ?? [];
  });

  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(() => {
    const saved = loadSavedGame();
    return saved?.currentEnemy ?? null;
  });

  const [currentEvent, setCurrentEvent] = useState<ForestEvent | null>(() => {
    const saved = loadSavedGame();
    return saved?.currentEvent ?? null;
  });

  const [rivals, setRivals] = useState<Rival[]>(() => {
    const saved = loadSavedGame();
    return saved?.rivals ?? RIVALS;
  });

  const [messageBoard, setMessageBoard] = useState<MessagePost[]>(() => {
    const saved = loadSavedGame();
    return saved?.messageBoard ?? [
      { id: 1, author: 'Seth Able', content: 'Welcome to the Red Dragon Inn!', date: '1991-07-01' },
      { id: 2, author: 'Turgon', content: 'Train hard or die in the forest.', date: '1991-07-02' },
    ];
  });

  const [dailyNews, setDailyNews] = useState<string>(() => {
    const saved = loadSavedGame();
    return saved?.dailyNews ?? "The town crier is silent today.";
  });

  const [combatType, setCombatType] = useState<'PVE' | 'PVP'>('PVE');
  const [isGenerating, setGenerating] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Persistence Effect - Saves all critical state to a single object
  // This runs on any critical state change, acting as an "instant save" feature
  useEffect(() => {
    // We only save if the player has a name (has logged in)
    if (player.name) {
        const stateToSave: SavedState = {
            player,
            location,
            logs,
            currentEnemy,
            currentEvent,
            rivals,
            messageBoard,
            dailyNews
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
        setLastSaved(new Date());
    }
  }, [player, location, logs, currentEnemy, currentEvent, rivals, messageBoard, dailyNews]);

  // Periodic Auto-Save Timer (Every 5 Minutes)
  useEffect(() => {
    if (!player.name) return;

    const interval = setInterval(() => {
      // By adding a log, we modify 'logs', which triggers the Persistence Effect above
      addLog("Game state auto-saved.", LogType.INFO);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [player.name]);

  const effectiveCharm = player.charm + (player.weapon.charm || 0) + (player.armor.charm || 0);

  const addLog = (text: string, type: LogType = LogType.INFO) => {
    const id = Math.random().toString(36).substr(2, 9);
    setLogs(prev => [...prev.slice(-49), { id, text, type, timestamp: Date.now() }]);
  };

  const refreshNews = async () => {
    const news = await generateDailyNews();
    setDailyNews(news);
  };

  // Initial news generation
  useEffect(() => {
    if (location === GameLocation.TOWN && dailyNews === "The town crier is silent today.") {
       refreshNews();
    }
  }, [location]);

  const resetGame = () => {
    localStorage.removeItem(SAVE_KEY);
    setPlayer(INITIAL_PLAYER);
    setLocation(GameLocation.LOGIN);
    setLogs([]);
    setCurrentEnemy(null);
    setCurrentEvent(null);
    setRivals(RIVALS);
    setDailyNews("The town crier is silent today.");
    setMessageBoard([
        { id: 1, author: 'Seth Able', content: 'Welcome to the Red Dragon Inn!', date: '1991-07-01' },
        { id: 2, author: 'Turgon', content: 'Train hard or die in the forest.', date: '1991-07-02' },
    ]);
  };

  const login = (name: string) => {
    if (player.name && player.name !== name) {
        // New user on same browser
        setPlayer({ ...INITIAL_PLAYER, name });
        setRivals(RIVALS);
        setLogs([]);
        addLog(`Welcome to the realm, ${name}.`);
    } else if (!player.name) {
        // First time login
        setPlayer({ ...INITIAL_PLAYER, name });
        addLog(`Welcome to the realm, ${name}.`);
    } else {
        // Returning user
        addLog(`Welcome back, ${name}.`);
    }
    setLocation(GameLocation.TOWN);
  };

  const move = (loc: GameLocation) => {
    setLocation(loc);
  };

  // --- COMBAT & EVENTS SYSTEM ---

  const startFight = async () => {
    if (player.forestFights <= 0) {
      addLog("You are too exhausted to fight more today.", LogType.INFO);
      return;
    }
    
    setGenerating(true);
    setCombatType('PVE');

    // 30% chance for a Random Event instead of a monster
    if (Math.random() < 0.3) {
        const event = await generateForestEvent(player.level);
        setGenerating(false);
        setCurrentEvent(event);
        setLocation(GameLocation.BATTLE); // Reuse Battle screen or similar logic in UI
        addLog(`Event: ${event.title}`, LogType.INFO);
    } else {
        // Procedural Monster
        const enemy = await generateMonster(player.level);
        setGenerating(false);
        setCurrentEnemy(enemy);
        setLocation(GameLocation.BATTLE);
        addLog(`You encounter a ${enemy.name}! ${enemy.openingLine}`, LogType.DANGER);
    }
  };

  const resolveEvent = () => {
      if (!currentEvent) return;
      
      const { effect, value, resultText } = currentEvent;
      
      setPlayer(prev => {
          let updates = { ...prev, forestFights: prev.forestFights - 1 };
          if (effect === 'GOLD') updates.gold += value;
          if (effect === 'XP') updates.exp += value;
          if (effect === 'HEAL') updates.hp = Math.min(prev.maxHp, prev.hp + value);
          if (effect === 'DAMAGE') updates.hp = Math.max(0, prev.hp - value);
          
          if (updates.hp === 0) updates.isDead = true;
          return updates;
      });

      addLog(resultText, effect === 'DAMAGE' ? LogType.DANGER : LogType.GAIN);
      
      if (currentEvent.effect === 'DAMAGE' && player.hp - currentEvent.value <= 0) {
          addLog("You have died from the event...", LogType.DANGER);
          setLocation(GameLocation.TOWN);
          setTimeout(() => {
            setPlayer(prev => ({ ...prev, hp: Math.floor(prev.maxHp / 2), isDead: false }));
            addLog("The spirits resurrect you, but you feel weaker.", LogType.INFO);
          }, 3000);
      } else {
          setLocation(GameLocation.FOREST);
      }
      
      setCurrentEvent(null);
  };

  const startPvP = (rivalId: string) => {
    if (player.userFights <= 0) {
      addLog("You have challenged enough people for today.", LogType.INFO);
      return;
    }

    const rival = rivals.find(r => r.id === rivalId);
    if (!rival) return;

    setCombatType('PVP');
    
    // Convert Rival to Enemy format
    const enemy: Enemy = {
      id: rival.id,
      name: rival.name,
      level: rival.level,
      hp: rival.hp,
      maxHp: rival.maxHp,
      str: rival.str + rival.weapon.value, // Total effective str
      def: rival.def + rival.armor.value, // Total effective def
      gold: rival.gold,
      exp: rival.exp,
      weaponName: rival.weapon.name,
      openingLine: `The warrior ${rival.name} draws their ${rival.weapon.name}!`,
      isPlayer: true
    };

    setCurrentEnemy(enemy);
    setLocation(GameLocation.BATTLE);
    addLog(`You challenge ${enemy.name} to a duel!`, LogType.DANGER);
  };

  const attack = () => {
    if (!currentEnemy) return;

    // Player Turn
    const pDmg = Math.max(1, Math.floor((player.str + player.weapon.value) + (Math.random() * player.level) - (currentEnemy.def / 2)));
    const newEnemyHp = currentEnemy.hp - pDmg;
    
    addLog(`You hit ${currentEnemy.name} with your ${player.weapon.name} for ${pDmg} damage!`, LogType.COMBAT_PLAYER);

    if (newEnemyHp <= 0) {
      // Victory
      let goldReward = 0;
      let expReward = 0;

      if (combatType === 'PVP') {
         goldReward = Math.floor(currentEnemy.gold * 0.1); 
         expReward = Math.floor(currentEnemy.exp * 0.2); 
         setPlayer(prev => ({ ...prev, userFights: prev.userFights - 1 }));
         
         setRivals(prev => prev.map(r => r.id === currentEnemy.id ? { ...r, hp: 0 } : r));

         addLog(`You defeated ${currentEnemy.name}!`, LogType.GAIN);
         addLog(`You stole ${goldReward} gold and gained ${expReward} experience.`, LogType.GAIN);
      } else {
         goldReward = currentEnemy.gold + Math.floor(Math.random() * 10);
         expReward = currentEnemy.exp;
         setPlayer(prev => ({ ...prev, forestFights: prev.forestFights - 1 }));
         addLog(`You killed ${currentEnemy.name}!`, LogType.GAIN);
         addLog(`You gain ${goldReward} gold and ${expReward} experience.`, LogType.GAIN);
      }
      
      setPlayer(prev => ({
        ...prev,
        gold: prev.gold + goldReward,
        exp: prev.exp + expReward,
      }));
      
      setCurrentEnemy(null);
      setLocation(combatType === 'PVP' ? GameLocation.PVP_LIST : GameLocation.FOREST);

    } else {
      // Enemy Turn
      setCurrentEnemy(prev => prev ? ({ ...prev, hp: newEnemyHp }) : null);
      
      const eDmg = Math.max(1, Math.floor((currentEnemy.str) + (Math.random() * currentEnemy.level) - (player.def + player.armor.value)));
      const newPlayerHp = player.hp - eDmg;
      
      addLog(`${currentEnemy.name} hits you with its ${currentEnemy.weaponName} for ${eDmg} damage!`, LogType.COMBAT_ENEMY);
      
      if (newPlayerHp <= 0) {
        // Death
        setPlayer(prev => ({ ...prev, hp: 0, isDead: true, exp: Math.floor(prev.exp * 0.9) })); 
        addLog("You have died...", LogType.DANGER);
        setLocation(GameLocation.TOWN); 
        setCurrentEnemy(null);
        setTimeout(() => {
            setPlayer(prev => ({ ...prev, hp: Math.floor(prev.maxHp / 2), isDead: false }));
            addLog("The spirits resurrect you, but you feel weaker.", LogType.INFO);
        }, 3000);
      } else {
        setPlayer(prev => ({ ...prev, hp: newPlayerHp }));
      }
    }
  };

  const run = () => {
    if (Math.random() > 0.4) {
      addLog("You managed to escape!", LogType.INFO);
      setCurrentEnemy(null);
      setLocation(combatType === 'PVP' ? GameLocation.PVP_LIST : GameLocation.FOREST);
    } else {
      addLog("FAILED TO RUN! The enemy attacks!", LogType.DANGER);
      if (currentEnemy) {
         const eDmg = Math.max(1, Math.floor((currentEnemy.str) - (player.def + player.armor.value)));
         setPlayer(prev => ({ ...prev, hp: Math.max(0, prev.hp - eDmg) }));
      }
    }
  };

  // --- ECONOMY ---

  const buyItem = (item: Item) => {
    const currentItem = item.type === 'WEAPON' ? player.weapon : player.armor;
    if (item.value <= currentItem.value) {
        addLog("You already have this or better!", LogType.INFO);
        return;
    }
    
    const discountFactor = Math.max(0.5, 1 - (effectiveCharm / 200));
    const discountedPrice = Math.floor(item.cost * discountFactor);
    const tradeIn = Math.floor(currentItem.cost / 2);
    const finalCost = Math.max(0, discountedPrice - tradeIn);

    if (player.gold >= finalCost) {
      setPlayer(prev => ({
        ...prev,
        gold: prev.gold - finalCost,
        [item.type === 'WEAPON' ? 'weapon' : 'armor']: item
      }));
      addLog(`Bought ${item.name} for ${finalCost}g.`, LogType.GAIN);
    } else {
      addLog(`Not enough gold! Need ${finalCost}.`, LogType.DANGER);
    }
  };

  const deposit = (amount: number) => {
    if (amount <= 0 || player.gold < amount) return;
    setPlayer(prev => ({ ...prev, gold: prev.gold - amount, bank: prev.bank + amount }));
    addLog(`Deposited ${amount} gold.`, LogType.INFO);
  };

  const withdraw = (amount: number) => {
    if (amount <= 0 || player.bank < amount) return;
    setPlayer(prev => ({ ...prev, gold: prev.gold + amount, bank: prev.bank - amount }));
    addLog(`Withdrew ${amount} gold.`, LogType.INFO);
  };

  // --- SERVICES ---

  const heal = () => { // Inn rest
    const missing = player.maxHp - player.hp;
    if (missing <= 0) {
        addLog("You are already fully healed.", LogType.INFO);
        return;
    }
    const afford = Math.min(missing, player.gold);
    if (afford > 0) {
        setPlayer(prev => ({ ...prev, gold: prev.gold - afford, hp: prev.hp + afford }));
        addLog(`Healed ${afford} HP for ${afford} gold.`, LogType.GAIN);
    } else {
        addLog("You can't afford a room.", LogType.DANGER);
    }
  };

  const healCustom = (amount: number) => {
    const cost = amount; // 1 gold per HP
    if (player.gold < cost) {
      addLog("You don't have enough gold for that healing.", LogType.DANGER);
      return;
    }
    const actualHeal = Math.min(amount, player.maxHp - player.hp);
    if (actualHeal <= 0) {
      addLog("You don't need healing.", LogType.INFO);
      return;
    }
    setPlayer(prev => ({ ...prev, gold: prev.gold - cost, hp: prev.hp + actualHeal }));
    addLog(`The healers tend to your wounds (+${actualHeal} HP).`, LogType.GAIN);
  };

  const train = () => {
     const nextLevelExp = LEVEL_EXP[player.level];
     if (!nextLevelExp && player.level >= 10) {
         addLog("You are a master. No more training.", LogType.INFO);
         return;
     }

     if (player.exp >= nextLevelExp) {
         setPlayer(prev => ({
             ...prev,
             level: prev.level + 1,
             maxHp: prev.maxHp + 10,
             hp: prev.maxHp + 10,
             str: prev.str + 5,
             def: prev.def + 2,
             forestFights: prev.forestFights + 5 
         }));
         addLog(`LEVEL UP! You are now level ${player.level + 1}.`, LogType.GAIN);
     } else {
         addLog(`You need ${nextLevelExp - player.exp} more experience to train.`, LogType.INFO);
     }
  };
  
  const askTurgon = async () => {
    return await getStrategicAdvice(player);
  };

  const readBook = (title: string) => {
    const xpGain = Math.floor(Math.random() * 5);
    setPlayer(prev => ({ ...prev, exp: prev.exp + xpGain }));
    addLog(`You read '${title}'. gained ${xpGain} knowledge.`, LogType.INFO);
  };

  const postMessage = (text: string) => {
      const newPost: MessagePost = {
          id: messageBoard.length + 1,
          author: player.name,
          content: text,
          date: new Date().toISOString().split('T')[0]
      };
      setMessageBoard(prev => [newPost, ...prev]);
  };

  return (
    <GameContext.Provider value={{
      player, location, logs, currentEnemy, currentEvent, messageBoard, rivals, effectiveCharm, dailyNews, isGenerating, lastSaved,
      login, move, addLog, setGenerating, startFight, startPvP, attack, run, resolveEvent,
      buyItem, deposit, withdraw, heal, healCustom, train, askTurgon, readBook, postMessage, refreshNews, resetGame
    }}>
      {children}
    </GameContext.Provider>
  );
};
