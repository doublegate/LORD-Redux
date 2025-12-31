
import React, { useState } from 'react';
import { GameProvider, useGame } from './contexts/GameContext';
import { GameLocation, LogType } from './types';
import { TownSquare, Forest, Shop, Inn, Bank, Training, MessageBoard, HealersHut, Library, PvPList, Stats } from './components/GameScreens';
import { StatsRow, TerminalCard } from './components/TerminalUI';
import { Sword, Shield, Heart, Coins, Trees, User, Menu, Save } from 'lucide-react';
import { ArtDragon } from './components/AnsiArt';

const LoginScreen = () => {
  const { login } = useGame();
  const [name, setName] = useState('');

  return (
    <div className="flex h-screen items-center justify-center bg-lord-bg p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-lord-bg to-black">
      <div className="w-full max-w-3xl">
        <div className="mb-12 text-center">
          <ArtDragon />
          <h1 className="text-6xl md:text-8xl font-bold text-lord-red mb-4 tracking-widest text-shadow-red animate-pulse-slow">L.O.R.D.</h1>
          <h2 className="text-3xl text-lord-amber uppercase tracking-widest">Legend of the Red Dragon</h2>
          <p className="text-lord-dim mt-4 text-xl">Web Redux v4.08</p>
        </div>
        
        <TerminalCard>
          <div className="space-y-8 py-6 px-4">
            <p className="text-2xl text-center">Enter your warrior's name:</p>
            <input 
              type="text" 
              className="w-full bg-slate-900 border-b-4 border-lord-dim p-5 text-3xl text-center text-lord-green focus:outline-none focus:border-lord-green placeholder-slate-700 transition-colors uppercase tracking-widest"
              placeholder="YOUR NAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && name && login(name)}
            />
            <button 
              onClick={() => name && login(name)}
              className="w-full bg-lord-red text-white font-bold py-5 text-2xl hover:bg-red-500 transition-all rounded shadow-lg uppercase tracking-[0.2em]"
            >
              Enter The Realm
            </button>
          </div>
        </TerminalCard>
      </div>
    </div>
  );
};

const GameLayout = () => {
  const { player, location, logs, effectiveCharm, lastSaved } = useGame();
  
  // Render the correct screen based on location
  const renderScreen = () => {
    switch (location) {
      case GameLocation.TOWN: return <TownSquare />;
      case GameLocation.FOREST: return <Forest />;
      case GameLocation.BATTLE: return <Forest />; 
      case GameLocation.WEAPON_SHOP: return <Shop type="WEAPON" />;
      case GameLocation.ARMOR_SHOP: return <Shop type="ARMOR" />;
      case GameLocation.INN: return <Inn />;
      case GameLocation.BANK: return <Bank />;
      case GameLocation.TRAINING: return <Training />;
      case GameLocation.BOARD: return <MessageBoard />;
      case GameLocation.HEALERS_HUT: return <HealersHut />;
      case GameLocation.LIBRARY: return <Library />;
      case GameLocation.PVP_LIST: return <PvPList />;
      case GameLocation.STATS: return <Stats />;
      default: return <TownSquare />;
    }
  };

  return (
    <div className="min-h-screen bg-lord-bg text-lord-text font-mono overflow-x-hidden flex flex-col items-center">
      {/* Container for Max Width */}
      <div className="w-full max-w-[1600px] flex flex-col h-screen p-2 md:p-6">
        
        {/* Top Status Bar */}
        <header className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 bg-lord-panel border-b-4 border-slate-700 p-5 shadow-xl rounded-sm">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-slate-800 text-lord-text rounded shadow-inner"><User size={28} /></div>
             <div className="flex-1 min-w-0">
               <div className="text-sm text-lord-dim uppercase tracking-wider font-bold">Warrior</div>
               <div className="font-bold text-lord-amber text-2xl leading-none truncate">{player.name}</div>
               <div className="flex justify-between items-baseline mt-1">
                 <span className="text-base text-lord-green font-bold">Level {player.level}</span>
                 {lastSaved && (
                    <span className="text-xs text-lord-dim flex items-center gap-1 opacity-70" title={`Last Auto-Save: ${lastSaved.toLocaleTimeString()}`}>
                        <Save size={10} /> {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                 )}
               </div>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="p-3 bg-red-900/30 text-lord-red rounded shadow-inner"><Heart size={28} /></div>
             <div className="w-full">
               <div className="text-sm text-lord-dim uppercase tracking-wider font-bold">Health</div>
               <div className="h-4 bg-slate-800 w-full mt-1 rounded-sm overflow-hidden border border-slate-700">
                  <div className="h-full bg-lord-red transition-all duration-500 shadow-[0_0_8px_rgba(248,113,113,0.5)]" style={{ width: `${(player.hp / player.maxHp) * 100}%` }}></div>
               </div>
               <div className="text-lg text-right font-mono font-bold mt-1">{player.hp} / {player.maxHp}</div>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="p-3 bg-yellow-900/30 text-lord-amber rounded shadow-inner"><Coins size={28} /></div>
             <div>
               <div className="text-sm text-lord-dim uppercase tracking-wider font-bold">Gold</div>
               <div className="font-bold text-3xl text-white">{player.gold}</div>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="p-3 bg-green-900/30 text-lord-green rounded shadow-inner"><Trees size={28} /></div>
             <div>
               <div className="text-sm text-lord-dim uppercase tracking-wider font-bold">Fights Left</div>
               <div className="font-bold text-3xl text-white">{player.forestFights} <span className="text-lord-dim text-lg font-normal">/ {player.userFights} PvP</span></div>
             </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
          
          {/* Left Column: Game Screen */}
          <div className="flex-[2] overflow-y-auto pb-20 lg:pb-0 custom-scrollbar pr-2">
            {renderScreen()}
          </div>

          {/* Right Column: Stats & Logs */}
          <aside className="hidden lg:flex flex-1 flex-col gap-6 min-w-[400px] max-w-[450px]">
            <TerminalCard title="Equipment">
               <div className="space-y-4">
                  <div className="flex items-center gap-5 p-4 bg-slate-800/40 rounded border-2 border-slate-700/50">
                    <Sword size={32} className="text-lord-dim" />
                    <div>
                        <div className="text-sm text-lord-dim uppercase tracking-wider font-bold">Weapon</div>
                        <div className="text-2xl text-lord-text font-bold leading-tight">{player.weapon.name}</div>
                        <div className="text-base text-lord-green font-bold">+{player.weapon.value} ATK</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 p-4 bg-slate-800/40 rounded border-2 border-slate-700/50">
                    <Shield size={32} className="text-lord-dim" />
                    <div>
                        <div className="text-sm text-lord-dim uppercase tracking-wider font-bold">Armor</div>
                        <div className="text-2xl text-lord-text font-bold leading-tight">{player.armor.name}</div>
                        <div className="text-base text-lord-blue font-bold">+{player.armor.value} DEF</div>
                    </div>
                  </div>
               </div>
            </TerminalCard>

            <TerminalCard title="Attributes">
               <div className="space-y-1">
                   <StatsRow label="Strength" value={player.str} />
                   <StatsRow label="Defense" value={player.def} />
                   <StatsRow label="Charm" value={effectiveCharm} />
                   <StatsRow label="Experience" value={player.exp} />
               </div>
            </TerminalCard>

            <TerminalCard title="Adventure Log" className="flex-1 flex flex-col min-h-[300px]">
              <div className="flex-1 overflow-y-auto min-h-0 space-y-3 font-mono text-base custom-scrollbar pr-3">
                {logs.length === 0 && <div className="text-lord-dim italic opacity-50 p-2">Log is empty...</div>}
                {logs.slice().reverse().map((log) => (
                  <div key={log.id} className={`
                    leading-snug p-2 border-l-4 pl-3 rounded-r
                    ${log.type === LogType.DANGER ? 'text-lord-red border-lord-red bg-lord-red/10' : ''}
                    ${log.type === LogType.GAIN ? 'text-lord-green border-lord-green bg-lord-green/10' : ''}
                    ${log.type === LogType.INFO ? 'text-lord-dim border-lord-dim' : ''}
                    ${log.type === LogType.COMBAT_PLAYER ? 'text-lord-blue border-lord-blue' : ''}
                    ${log.type === LogType.COMBAT_ENEMY ? 'text-lord-red border-lord-red' : ''}
                  `}>
                    <span className="opacity-50 text-xs font-bold block mb-1">
                       [{log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '00:00'}]
                    </span> 
                    {log.text}
                  </div>
                ))}
              </div>
            </TerminalCard>
          </aside>

        </main>
      </div>
    </div>
  );
};

const Main = () => {
  const { location } = useGame();
  return location === GameLocation.LOGIN ? <LoginScreen /> : <GameLayout />;
};

export default function App() {
  return (
    <GameProvider>
      <Main />
    </GameProvider>
  );
}
