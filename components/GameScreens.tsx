
import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../contexts/GameContext';
import { GameLocation, LogType, ChatMessage } from '../types';
import { TerminalCard, ActionButton, StatsRow, ProgressBar } from './TerminalUI';
import { WEAPONS, ARMOR } from '../constants';
import { Sword, Shield, Coins, Heart, Skull, Map as MapIcon, Home, User, MessageSquare, Book, Cross, Eye } from 'lucide-react';
import { 
  ArtTown, ArtForest, ArtWeapon, ArtArmor, ArtInn, ArtBank, 
  ArtTraining, ArtSkull, ArtSwords, ArtHealer, ArtLibrary, ArtWall, ArtGrave, ArtDailyNews, ArtStats
} from './AnsiArt';
import { getBardPoem, chatWithViolet, getLibraryBook, generateItemLore, generateMonsterLore } from '../services/geminiService';

// --- HOOKS ---

const useHotkeys = (keyMap: Record<string, () => void>) => {
  const keyMapRef = useRef(keyMap);
  
  useEffect(() => {
    keyMapRef.current = keyMap;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      const key = e.key.toLowerCase();
      const action = keyMapRef.current[key];
      
      if (action) {
        e.preventDefault();
        action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};

// --- MAIN TOWN ---
export const TownSquare = () => {
  const { move, player, dailyNews, resetGame } = useGame();
  
  const handleRetire = () => {
      if(window.confirm("Are you sure you want to retire? This will delete your save file.")) {
          resetGame();
      }
  }

  useHotkeys({
    'f': () => move(GameLocation.FOREST),
    'i': () => move(GameLocation.INN),
    's': () => move(GameLocation.PVP_LIST),
    'w': () => move(GameLocation.WEAPON_SHOP),
    'a': () => move(GameLocation.ARMOR_SHOP),
    'h': () => move(GameLocation.HEALERS_HUT),
    'b': () => move(GameLocation.BANK),
    't': () => move(GameLocation.TRAINING),
    'l': () => move(GameLocation.LIBRARY),
    'm': () => move(GameLocation.BOARD),
    'v': () => move(GameLocation.STATS),
    'q': handleRetire
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <TerminalCard title="Town Square">
          <ArtTown />
          <p className="mb-8 text-lord-text/90 text-xl leading-relaxed">
            The bustling center of the village. Peasants scurry about, and the smell of roasting meat wafts from the Inn.
          </p>
          <div className="grid grid-cols-1 gap-3">
            <ActionButton label="Enter the Forest" hotkey="F" onClick={() => move(GameLocation.FOREST)} variant="danger" />
            <ActionButton label="The Red Dragon Inn" hotkey="I" onClick={() => move(GameLocation.INN)} />
            <ActionButton label="Slaughter Players" hotkey="S" onClick={() => move(GameLocation.PVP_LIST)} variant="danger" />
            <div className="grid grid-cols-2 gap-3">
              <ActionButton label="Weapons" hotkey="W" onClick={() => move(GameLocation.WEAPON_SHOP)} />
              <ActionButton label="Armor" hotkey="A" onClick={() => move(GameLocation.ARMOR_SHOP)} />
            </div>
            <ActionButton label="Heal Corps" hotkey="H" onClick={() => move(GameLocation.HEALERS_HUT)} />
            <ActionButton label="First National Bank" hotkey="B" onClick={() => move(GameLocation.BANK)} />
            <ActionButton label="Turgon's Training" hotkey="T" onClick={() => move(GameLocation.TRAINING)} />
            <ActionButton label="The Library" hotkey="L" onClick={() => move(GameLocation.LIBRARY)} />
            <ActionButton label="Visit The Wall" hotkey="M" onClick={() => move(GameLocation.BOARD)} />
            <div className="mt-4 border-t border-slate-700 pt-4 grid grid-cols-2 gap-3">
                 <ActionButton label="View Stats" hotkey="V" onClick={() => move(GameLocation.STATS)} />
                 <ActionButton label="Retire" hotkey="Q" onClick={handleRetire} variant="normal" />
            </div>
          </div>
        </TerminalCard>
      </div>
      <div className="space-y-6">
        <TerminalCard title="Daily News">
          <ArtDailyNews />
          <div className="text-base md:text-lg font-mono text-lord-amber leading-snug bg-black/30 p-6 rounded border border-slate-700 shadow-inner text-center">
            {dailyNews === "The town crier is silent today." ? (
               <div className="animate-pulse">Fetching news from the realm...</div>
            ) : (
               <div className="animate-flicker leading-relaxed">"{dailyNews}"</div>
            )}
          </div>
        </TerminalCard>
      </div>
    </div>
  );
};

// --- STATS SCREEN ---
export const Stats = () => {
  const { move, player, effectiveCharm } = useGame();
  
  useHotkeys({
    'r': () => move(GameLocation.TOWN)
  });

  return (
    <TerminalCard title="Warrior Statistics">
      <ArtStats />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
         <div className="space-y-4 p-6 bg-slate-800/30 border border-slate-700 rounded">
            <h3 className="text-lord-amber font-bold border-b border-slate-700 pb-2 mb-4 uppercase tracking-widest">Vitality</h3>
            <StatsRow label="Name" value={player.name} highlight />
            <StatsRow label="Level" value={player.level} />
            <StatsRow label="Experience" value={player.exp} />
            <StatsRow label="Health" value={`${player.hp} / ${player.maxHp}`} />
            <StatsRow label="Turns Left" value={player.forestFights} />
            <StatsRow label="PvP Left" value={player.userFights} />
         </div>
         <div className="space-y-4 p-6 bg-slate-800/30 border border-slate-700 rounded">
            <h3 className="text-lord-green font-bold border-b border-slate-700 pb-2 mb-4 uppercase tracking-widest">Power & Wealth</h3>
            <StatsRow label="Strength" value={player.str} />
            <StatsRow label="Defense" value={player.def} />
            <StatsRow label="Charm" value={effectiveCharm} />
            <StatsRow label="Gold (Hand)" value={player.gold} />
            <StatsRow label="Gold (Bank)" value={player.bank} />
         </div>
      </div>
      
      <div className="mb-8 p-6 bg-slate-800/30 border border-slate-700 rounded">
         <h3 className="text-lord-blue font-bold border-b border-slate-700 pb-2 mb-4 uppercase tracking-widest">Equipment</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <div className="text-sm text-lord-dim uppercase font-bold mb-1">Weapon</div>
                <div className="text-xl text-lord-text font-bold">{player.weapon.name}</div>
                <div className="text-lord-green text-sm">+{player.weapon.value} Attack</div>
            </div>
             <div>
                <div className="text-sm text-lord-dim uppercase font-bold mb-1">Armor</div>
                <div className="text-xl text-lord-text font-bold">{player.armor.name}</div>
                <div className="text-lord-blue text-sm">+{player.armor.value} Defense</div>
            </div>
         </div>
      </div>

      <ActionButton label="Return to Town" hotkey="R" onClick={() => move(GameLocation.TOWN)} />
    </TerminalCard>
  );
};

// --- SHARED COMBAT UI ---
export const Combat = ({ returnLoc }: { returnLoc: GameLocation }) => {
  const { move, attack, run, logs, currentEnemy, player } = useGame();
  const [lore, setLore] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    setLore(null);
    setAnalyzing(false);
  }, [currentEnemy?.id]);

  useHotkeys({
    'a': attack,
    'r': run
  });

  const handleInspect = async () => {
    if (!currentEnemy || analyzing) return;
    setAnalyzing(true);
    setLore("Consulting bestiary...");
    const text = await generateMonsterLore(currentEnemy.name);
    setLore(text);
    setAnalyzing(false);
  };

  if (!currentEnemy) {
    return <div onClick={() => move(returnLoc)} className="p-4 text-2xl cursor-pointer hover:text-lord-amber text-center mt-10">Combat Ended. Click to Return.</div>;
  }

  return (
    <TerminalCard title={currentEnemy.isPlayer ? "Player Duel!" : "Combat Encounter"} className="border-lord-red/50">
      <div className="flex flex-col md:flex-row gap-10 mb-8 items-end">
        <div className="flex-1 w-full">
          <div className="flex flex-col items-center mb-6">
            {currentEnemy.isPlayer ? <ArtSwords /> : (
              currentEnemy.asciiArt ? (
                <div className="font-mono whitespace-pre text-xs md:text-sm text-lord-red leading-none mb-4">
                  {currentEnemy.asciiArt}
                </div>
              ) : <ArtSkull />
            )}
            <div className="mt-4 text-center w-full">
               <div className="text-4xl md:text-6xl text-lord-red font-bold animate-pulse tracking-wider text-shadow-red mb-2">
                 {currentEnemy.name}
               </div>
               <p className="text-2xl text-lord-dim">Level {currentEnemy.level}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-xl">
                <span className="text-lord-red font-bold uppercase">Enemy Health</span>
                <span className="font-mono text-2xl">{currentEnemy.hp} / {currentEnemy.maxHp}</span>
            </div>
            <ProgressBar current={currentEnemy.hp} max={currentEnemy.maxHp} color="bg-lord-red" />
          </div>
          <div className="mt-4 text-lg text-lord-dim uppercase tracking-widest text-center">Wielding: <span className="text-lord-text font-bold">{currentEnemy.weaponName}</span></div>
        </div>
        
        <div className="hidden md:flex items-center justify-center text-5xl font-black text-slate-700 pb-12">VS</div>
        
        <div className="flex-1 w-full text-right">
            <div className="text-4xl md:text-6xl mb-2 text-lord-green font-bold tracking-wider text-shadow-green">{player.name}</div>
            <div className="flex justify-end gap-3 mb-2 text-2xl text-lord-dim items-baseline">
                <span className="uppercase text-lg">Your HP</span>
                <span className="text-white font-mono">{player.hp} / {player.maxHp}</span>
            </div>
            <ProgressBar current={player.hp} max={player.maxHp} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-4">
        <ActionButton label="Attack Enemy" hotkey="A" onClick={attack} variant="danger" />
        <ActionButton label="Run Away" hotkey="R" onClick={run} />
      </div>
      
      <div className="mb-6 flex justify-center">
         <button 
           onClick={handleInspect}
           disabled={analyzing || !!lore}
           className="text-lord-dim hover:text-lord-amber text-sm uppercase tracking-widest border-b border-transparent hover:border-lord-amber disabled:opacity-50 transition-all flex items-center gap-2"
         >
            <Eye size={16} /> {analyzing ? "Consulting Bestiary..." : (lore && lore !== "Consulting bestiary..." ? "Analysis Complete" : "Inspect Enemy")}
         </button>
      </div>

      {lore && (
          <div className="mb-8 p-4 bg-black/40 border-l-2 border-lord-amber text-lord-text italic font-serif text-lg animate-flicker text-center max-w-2xl mx-auto">
             "{lore}"
          </div>
      )}
      
      {/* Combat Log Window */}
      <div className="h-64 overflow-y-auto border-2 border-slate-700 p-4 bg-black/80 font-mono text-lg rounded shadow-inner custom-scrollbar">
            {logs.slice(-10).reverse().map(l => (
                <div key={l.id} className={`mb-2 leading-snug ${l.type === LogType.COMBAT_ENEMY ? 'text-lord-red' : l.type === LogType.COMBAT_PLAYER ? 'text-lord-green' : 'text-lord-dim'}`}>
                    {l.type === LogType.COMBAT_PLAYER ? '> ' : '* '} {l.text}
                </div>
            ))}
      </div>
    </TerminalCard>
  );
};

// --- FOREST ---
export const Forest = () => {
  const { move, startFight, player, currentEnemy, currentEvent, resolveEvent, isGenerating } = useGame();

  useHotkeys({
    's': () => { if (!currentEnemy && !currentEvent) startFight(); },
    'r': () => { if (!currentEnemy && !currentEvent) move(GameLocation.TOWN); },
    'c': () => { if (currentEvent) resolveEvent(); }
  });

  if (currentEnemy) {
    return <Combat returnLoc={GameLocation.FOREST} />;
  }

  if (currentEvent) {
    return (
      <TerminalCard title="Forest Event">
          <div className="flex flex-col items-center justify-center py-8 text-center">
             {currentEvent.asciiArt && <div className="font-mono whitespace-pre text-lord-amber mb-6">{currentEvent.asciiArt}</div>}
             <h2 className="text-4xl text-lord-amber font-bold mb-4 uppercase tracking-wider">{currentEvent.title}</h2>
             <p className="text-2xl text-lord-text leading-relaxed max-w-3xl mb-8">{currentEvent.description}</p>
             
             <div className="p-4 bg-slate-800 border border-slate-600 rounded mb-8">
                 <span className="text-lord-dim uppercase tracking-widest font-bold">Effect: </span>
                 <span className="text-white font-mono text-xl">{currentEvent.effect} {currentEvent.value > 0 ? `+${currentEvent.value}` : currentEvent.value}</span>
             </div>

             <ActionButton label="Continue" hotkey="C" onClick={resolveEvent} />
          </div>
      </TerminalCard>
    );
  }

  return (
    <TerminalCard title="The Dark Forest">
      <div className="text-center py-8">
        <ArtForest />
        <p className="mb-8 text-2xl max-w-3xl mx-auto leading-relaxed text-lord-text/90">
            The ancient trees loom over you, blocking out the starlight. Strange sounds echo in the distance.
        </p>
        <div className="inline-block border-2 border-slate-700 bg-slate-800/50 p-6 rounded mb-8">
            <span className="text-lord-dim text-lg uppercase tracking-wider block mb-2">Stamina Remaining</span>
            <span className="text-5xl block font-bold text-lord-amber">{player.forestFights}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionButton 
          label={isGenerating ? "Exploring..." : "Search for Something to Kill"} 
          hotkey="S" 
          onClick={startFight} 
          variant="danger" 
          disabled={player.forestFights <= 0 || isGenerating} 
        />
        <ActionButton label="Return to Town" hotkey="R" onClick={() => move(GameLocation.TOWN)} />
      </div>
      {isGenerating && <div className="text-center text-lord-green animate-pulse mt-4 text-xl">Venturing deep into the woods...</div>}
    </TerminalCard>
  );
};

// --- PVP LIST ---
export const PvPList = () => {
  const { move, player, rivals, startPvP, currentEnemy } = useGame();

  useHotkeys({
    'r': () => { if (!currentEnemy) move(GameLocation.TOWN); }
  });

  if (currentEnemy) {
    return <Combat returnLoc={GameLocation.PVP_LIST} />;
  }

  return (
    <TerminalCard title="The Slaughter Fields">
      <ArtGrave />
      <p className="mb-8 text-center text-xl text-lord-dim">
        Warriors gather here to test their mettle. 
        You have <span className="text-lord-amber font-bold">{player.userFights}</span> challenges remaining today.
      </p>
      <div className="h-[500px] overflow-y-auto mb-6 border-2 border-slate-700 bg-black/50 p-0 rounded">
        <table className="w-full text-left text-lg md:text-xl">
          <thead className="sticky top-0 bg-slate-800 text-lord-amber uppercase tracking-wider text-base">
            <tr>
              <th className="p-4 md:p-5">Name</th>
              <th className="p-4 md:p-5">Lvl</th>
              <th className="p-4 md:p-5">Status</th>
              <th className="p-4 md:p-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rivals.map(rival => (
              <tr key={rival.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="p-4 md:p-5 font-bold text-lord-text">{rival.name}</td>
                <td className="p-4 md:p-5 text-lord-dim">{rival.level}</td>
                <td className="p-4 md:p-5">
                    <span className={`px-3 py-1 rounded text-sm font-bold tracking-wider ${rival.hp > 0 ? 'bg-lord-green/20 text-lord-green' : 'bg-lord-red/20 text-lord-red'}`}>
                        {rival.hp > 0 ? "ALIVE" : "DEAD"}
                    </span>
                </td>
                <td className="p-4 md:p-5 text-right">
                   <button 
                     disabled={rival.hp <= 0 || player.userFights <= 0}
                     onClick={() => startPvP(rival.id)}
                     className="px-6 py-2 border-2 border-lord-red text-lord-red font-bold hover:bg-lord-red hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed uppercase text-base tracking-wider rounded"
                   >
                     Fight
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ActionButton label="Return to Town" hotkey="R" onClick={() => move(GameLocation.TOWN)} />
    </TerminalCard>
  );
};

// --- HEALERS HUT ---
export const HealersHut = () => {
  const { move, player, healCustom } = useGame();
  const hpMissing = player.maxHp - player.hp;
  const costPerHp = 1;

  useHotkeys({
    'r': () => move(GameLocation.TOWN),
    'f': () => { if (hpMissing > 0 && player.gold >= hpMissing * costPerHp) healCustom(hpMissing); },
    '1': () => { if (hpMissing > 0 && player.gold >= 10) healCustom(10); }
  });

  return (
    <TerminalCard title="Tim's Healers Hut">
       <ArtHealer />
       <p className="mb-8 text-center text-2xl italic text-lord-text/80 font-serif">
         "Welcome to the Heal Corps," Tim says. "We can fix you up, for a price."
       </p>
       <div className="mb-8 p-8 bg-slate-800/50 border border-slate-700 rounded max-w-2xl mx-auto">
          <StatsRow label="Your Health" value={`${player.hp} / ${player.maxHp}`} />
          <div className="my-2"></div>
          <StatsRow label="Cost per HP" value={`${costPerHp} Gold`} />
          <div className="mt-6 pt-6 border-t border-slate-700">
             <StatsRow label="Cost for Full Heal" value={`${hpMissing * costPerHp} Gold`} highlight />
          </div>
       </div>

       <div className="grid grid-cols-1 gap-4 max-w-xl mx-auto">
          <ActionButton 
             label={`Heal Completely (${hpMissing * costPerHp}g)`}
             hotkey="F"
             disabled={hpMissing === 0 || player.gold < (hpMissing * costPerHp)} 
             onClick={() => healCustom(hpMissing)} 
          />
          <ActionButton 
             label="Heal 10 HP (10g)" 
             hotkey="1"
             disabled={hpMissing === 0 || player.gold < 10} 
             onClick={() => healCustom(10)} 
          />
          <ActionButton label="Return to Town" hotkey="R" onClick={() => move(GameLocation.TOWN)} />
       </div>
    </TerminalCard>
  );
};

// --- LIBRARY ---
export const Library = () => {
    const { move, readBook } = useGame();
    const [book, setBook] = useState<{title: string, content: string} | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRead = async () => {
        setLoading(true);
        const b = await getLibraryBook();
        setBook(b);
        readBook(b.title);
        setLoading(false);
    };

    useHotkeys({
      'r': handleRead,
      'e': () => move(GameLocation.TOWN)
    });

    return (
        <TerminalCard title="The Town Library">
            <ArtLibrary />
            <p className="mb-8 text-2xl text-center text-lord-dim">The air smells of dust and old parchment. Knowledge is power.</p>
            
            <div className="min-h-[300px] mb-8 p-10 border-2 border-slate-700 bg-black/40 rounded flex flex-col justify-center items-center text-center">
                {loading && <div className="animate-pulse text-lord-amber text-2xl">Searching the shelves...</div>}
                {!loading && book && (
                    <div className="animate-flicker">
                        <h3 className="text-4xl font-serif text-lord-amber mb-8 underline tracking-wide decoration-slate-700">{book.title}</h3>
                        <p className="font-serif italic text-lord-text text-2xl leading-loose max-w-3xl">"{book.content}"</p>
                    </div>
                )}
                {!loading && !book && <div className="text-lord-dim italic text-2xl">Select a book to read...</div>}
            </div>

            <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
                <ActionButton label="Read a Random Tome" hotkey="R" onClick={handleRead} variant="special" />
                <ActionButton label="Return to Town" hotkey="E" onClick={() => move(GameLocation.TOWN)} />
            </div>
        </TerminalCard>
    );
};

// --- SHOPS ---
export const Shop = ({ type }: { type: 'WEAPON' | 'ARMOR' }) => {
  const { move, player, buyItem, effectiveCharm } = useGame();
  const [lore, setLore] = useState<Record<string, string>>({});
  const items = type === 'WEAPON' ? WEAPONS : ARMOR;

  useHotkeys({
    'r': () => move(GameLocation.TOWN)
  });

  const handleAppraise = async (item: any) => {
      if (lore[item.id]) return; // Already loaded
      setLore(prev => ({...prev, [item.id]: "Studying artifact..."}));
      const text = await generateItemLore(item.name);
      setLore(prev => ({...prev, [item.id]: text}));
  };
  
  return (
    <TerminalCard title={type === 'WEAPON' ? "Arthur's Weapons" : "King's Armor"}>
      <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-1/3 flex flex-col items-center">
             {type === 'WEAPON' ? <ArtWeapon /> : <ArtArmor />}
             <p className="mb-6 text-center text-2xl italic font-serif text-lord-text/80">"Best steel in the land!" the shopkeeper grunts.</p>
             <div className="w-full p-6 border-2 border-lord-amber bg-lord-amber/5 text-lord-amber text-center rounded shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                <div className="text-base uppercase tracking-widest opacity-75 mb-1">Your Gold</div>
                <div className="text-4xl font-bold mb-6 text-white">{player.gold}</div>
                <div className="text-base uppercase tracking-widest opacity-75 mb-1">Equipped</div>
                <div className="font-bold text-2xl">{type === 'WEAPON' ? player.weapon.name : player.armor.name}</div>
             </div>
          </div>
          
          <div className="lg:w-2/3">
             <div className="space-y-4 h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                {items.map((item) => {
                  const discountFactor = Math.max(0.5, 1 - (effectiveCharm / 200));
                  const displayCost = Math.floor(item.cost * discountFactor);

                  return (
                    <div key={item.id} className="flex flex-col border border-slate-700 bg-slate-800/40 p-5 hover:bg-slate-700/60 transition-colors rounded">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                        <div className="mb-4 md:mb-0">
                          <div className="font-bold text-2xl text-lord-text mb-1 flex items-center gap-3">
                            {item.name}
                            {item.charm > 0 && <span className="text-xs bg-purple-900 text-purple-200 px-2 py-0.5 rounded border border-purple-500">CHARM +{item.charm}</span>}
                          </div>
                          <div className="text-lg text-lord-dim uppercase tracking-wide font-bold">+{item.value} <span className="text-sm font-normal text-slate-500">{type === 'WEAPON' ? 'ATK' : 'DEF'}</span></div>
                        </div>
                        <div className="flex items-center gap-6 self-end md:self-auto">
                           <div className="text-right">
                               {item.cost > 0 && item.cost !== displayCost ? (
                                   <>
                                     <span className="text-slate-500 line-through text-sm block">{item.cost} G</span>
                                     <span className="text-lord-amber font-mono text-2xl font-bold">{displayCost} <span className="text-sm text-lord-dim font-normal">GOLD</span></span>
                                   </>
                               ) : (
                                  <span className="text-lord-amber font-mono text-2xl font-bold">{item.cost > 0 ? item.cost : 'Free'} <span className="text-sm text-lord-dim font-normal">{item.cost > 0 ? 'GOLD' : ''}</span></span>
                               )}
                           </div>
                           <button 
                             onClick={() => buyItem(item)}
                             className="px-6 py-3 bg-lord-green text-black font-bold hover:bg-white hover:scale-105 transition-all text-base uppercase tracking-widest rounded shadow-lg shadow-lord-green/20"
                           >
                             BUY
                           </button>
                        </div>
                      </div>
                      <div className="text-lord-dim italic border-t border-slate-700/50 pt-2 text-sm flex justify-between items-start">
                          <span>"{item.description}"</span>
                          <button onClick={() => handleAppraise(item)} className="text-lord-blue hover:text-white flex items-center gap-1 text-xs uppercase font-bold tracking-wider ml-4">
                             <Eye size={12} /> Appraise
                          </button>
                      </div>
                      {lore[item.id] && (
                          <div className="mt-2 text-lord-amber text-sm font-serif italic animate-flicker">
                              {lore[item.id]}
                          </div>
                      )}
                    </div>
                  );
                })}
             </div>
             <div className="mt-8">
                <ActionButton label="Return to Town" hotkey="R" onClick={() => move(GameLocation.TOWN)} />
             </div>
          </div>
      </div>
    </TerminalCard>
  );
};

// --- INN & BARD ---
export const Inn = () => {
    const { move, player, heal } = useGame();
    const [poem, setPoem] = useState<string>("");
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [bardLoading, setBardLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const askBard = async () => {
        if (bardLoading) return;
        setBardLoading(true);
        const p = await getBardPoem(player.name, player.level);
        setPoem(p);
        setBardLoading(false);
    };

    const handleChat = async () => {
        if (!chatInput.trim() || loading) return;
        const msg = chatInput;
        setChatInput("");
        setLoading(true);
        
        const newHistory: ChatMessage[] = [...chatHistory, { sender: 'User', text: msg }];
        setChatHistory(newHistory);
        
        const reply = await chatWithViolet(newHistory, msg, player.name);
        setChatHistory([...newHistory, { sender: 'Violet', text: reply }]);
        setLoading(false);
    };
    
    useHotkeys({
      'a': askBard,
      'h': heal,
      'r': () => move(GameLocation.TOWN)
    });

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    return (
        <TerminalCard title="The Red Dragon Inn">
            <ArtInn />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="border border-slate-700 p-6 rounded bg-slate-800/20 flex flex-col h-[600px]">
                    <h3 className="font-bold text-3xl text-lord-red mb-2">Bartender Violet</h3>
                    <p className="text-xl mb-4 italic text-lord-dim font-serif">"What's on your mind, hun?"</p>
                    
                    <div className="flex-1 overflow-y-auto mb-4 border border-slate-700 bg-black/40 p-4 rounded custom-scrollbar space-y-4">
                        {chatHistory.length === 0 && <div className="text-lord-dim text-center mt-10 italic">Start a conversation...</div>}
                        {chatHistory.map((msg, i) => (
                            <div key={i} className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded text-lg ${msg.sender === 'User' ? 'bg-slate-700 text-white' : 'bg-lord-red/20 text-lord-text border border-lord-red/30'}`}>
                                    <span className="block text-xs opacity-50 font-bold uppercase mb-1">{msg.sender}</span>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="flex gap-2">
                         <input 
                            type="text" 
                            className="flex-1 bg-slate-900 border border-slate-600 p-3 text-lg text-white focus:outline-none focus:border-lord-red rounded"
                            placeholder="Say something..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                         />
                         <button onClick={handleChat} disabled={loading} className="bg-lord-red text-white px-6 font-bold rounded hover:bg-red-600 disabled:opacity-50">SAY</button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-700">
                         <ActionButton label="Rest in Room (Heal Max)" hotkey="H" onClick={heal} />
                    </div>
                </div>

                <div className="border border-slate-700 p-6 rounded bg-slate-800/20">
                    <h3 className="font-bold text-3xl text-lord-amber mb-2">The Old Bard</h3>
                    <p className="text-xl mb-6 italic text-lord-dim font-serif">A mysterious figure sits in the corner.</p>
                    <ActionButton label="Ask for a Song" hotkey="A" onClick={askBard} variant="special" />
                    {bardLoading && <div className="mt-4 animate-pulse text-xl">Thinking of a rhyme...</div>}
                    {poem && (
                        <div className="mt-6 p-6 border-2 border-dashed border-lord-amber/30 bg-black text-center italic font-serif text-lord-amber text-xl leading-relaxed shadow-lg">
                            {poem.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-8">
               <ActionButton label="Return to Town" hotkey="R" onClick={() => move(GameLocation.TOWN)} />
            </div>
        </TerminalCard>
    );
};

// --- BANK ---
export const Bank = () => {
    const { move, player, deposit, withdraw } = useGame();
    const [amount, setAmount] = useState<string>('');
    
    useHotkeys({
      'r': () => move(GameLocation.TOWN)
    });

    return (
        <TerminalCard title="First National Bank">
            <ArtBank />
            <div className="grid grid-cols-2 gap-8 p-8 bg-slate-800/50 mb-10 border border-slate-700 rounded shadow-inner max-w-3xl mx-auto">
                <div className="text-center">
                    <div className="text-lord-dim uppercase tracking-widest text-base mb-3 font-bold">Gold on Hand</div>
                    <div className="text-5xl text-lord-amber font-bold">{player.gold}</div>
                </div>
                <div className="text-center border-l border-slate-700">
                    <div className="text-lord-dim uppercase tracking-widest text-base mb-3 font-bold">Gold in Vault</div>
                    <div className="text-5xl text-lord-green font-bold">{player.bank}</div>
                </div>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="flex gap-4">
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="flex-1 bg-black border-2 border-lord-dim p-5 text-2xl text-white focus:outline-none focus:border-lord-amber transition-colors rounded placeholder-slate-700"
                        placeholder="Enter Amount..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <ActionButton label="Deposit" onClick={() => { deposit(Number(amount)); setAmount(''); }} />
                    <ActionButton label="Withdraw" onClick={() => { withdraw(Number(amount)); setAmount(''); }} />
                </div>

                <ActionButton label="Return to Town" hotkey="R" onClick={() => move(GameLocation.TOWN)} />
            </div>
        </TerminalCard>
    );
};

// --- TRAINING ---
export const Training = () => {
    const { move, player, train, askTurgon } = useGame();
    const [advice, setAdvice] = useState("");
    const [thinking, setThinking] = useState(false);

    const handleAdvice = async () => {
        if(thinking) return;
        setThinking(true);
        const a = await askTurgon();
        setAdvice(a);
        setThinking(false);
    };

    useHotkeys({
      'c': train,
      'a': handleAdvice,
      'r': () => move(GameLocation.TOWN)
    });

    return (
        <TerminalCard title="Turgon's Training Camp">
            <ArtTraining />
            <p className="mb-8 text-center text-2xl italic text-lord-text/80 font-serif">Turgon looks you up and down. "You look soft, recruit."</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8 items-start">
                 <div className="space-y-3 p-6 bg-slate-800/30 rounded border border-slate-700">
                    <StatsRow label="Current Level" value={player.level} />
                    <StatsRow label="Experience" value={player.exp} />
                    <StatsRow label="Next Level At" value={1000} /> 
                 </div>
                 <div className="flex flex-col gap-4">
                    <ActionButton label="Challenge Master Turgon (Level Up)" hotkey="C" variant="special" onClick={train} />
                    <ActionButton label="Ask for Strategic Advice" hotkey="A" onClick={handleAdvice} disabled={thinking} />
                 </div>
            </div>
            
            {thinking && <div className="mb-6 p-6 border-l-4 border-lord-blue bg-slate-800/50 animate-pulse text-xl">Turgon is studying your fighting stance (Thinking)...</div>}
            
            {advice && !thinking && (
                 <div className="mb-8 p-6 border-l-4 border-lord-amber bg-slate-800/50 text-xl italic font-serif leading-relaxed">
                     " {advice} "
                 </div>
            )}

            <div className="space-y-4">
                 <ActionButton label="Return to Town" hotkey="R" onClick={() => move(GameLocation.TOWN)} />
            </div>
        </TerminalCard>
    );
};

// --- MESSAGE BOARD ---
export const MessageBoard = () => {
    const { move, messageBoard, postMessage, player } = useGame();
    const [input, setInput] = useState("");

    const handlePost = () => {
        if(input.trim()) {
            postMessage(input);
            setInput("");
        }
    };

    useHotkeys({
      'r': () => move(GameLocation.TOWN)
    });

    return (
        <TerminalCard title="The Town Wall">
            <ArtWall />
            <div className="h-[500px] overflow-y-auto mb-6 border-2 border-slate-700 bg-black/40 p-8 space-y-8 rounded custom-scrollbar">
                {messageBoard.map((msg) => (
                    <div key={msg.id} className="border-b border-slate-700/50 pb-6">
                        <div className="flex justify-between text-base text-lord-dim mb-3 uppercase tracking-wider">
                            <span className="text-lord-amber font-bold flex items-center gap-2"><User size={16} /> {msg.author}</span>
                            <span className="text-slate-500">{msg.date}</span>
                        </div>
                        <p className="text-lord-text text-xl leading-relaxed pl-4 border-l-4 border-lord-dim/30">{msg.content}</p>
                    </div>
                ))}
            </div>
            <div className="flex gap-4 mb-6">
                 <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    maxLength={100}
                    className="flex-1 bg-slate-900 border-2 border-slate-600 p-4 text-xl text-white focus:outline-none focus:border-lord-green rounded"
                    placeholder="Scribble something on the wall..."
                 />
                 <button onClick={handlePost} className="bg-lord-green text-black px-8 font-bold text-xl rounded hover:bg-white transition-colors uppercase tracking-widest">POST</button>
            </div>
            <ActionButton label="Return to Town" hotkey="R" onClick={() => move(GameLocation.TOWN)} />
        </TerminalCard>
    );
};
