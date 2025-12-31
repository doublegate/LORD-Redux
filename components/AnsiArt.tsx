
import React from 'react';

const ArtBox = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`font-mono text-xs md:text-sm lg:text-base leading-[1.15] whitespace-pre select-none flex flex-col items-center justify-center mb-6 overflow-hidden ${className}`}>
    {children}
  </div>
);

const R = ({ c }: { c: React.ReactNode }) => <div>{c}</div>;

// Shading characters
const L = "░";
const M = "▒";
const D = "▓";
const F = "█";
const B = "▀";
const T = "▄";

export const ArtTown = () => (
  <ArtBox>
    <R c={<><span className="text-sky-900">      ▄▄▄     </span><span className="text-sky-800">   ▄▄▄   </span></>} />
    <R c={<><span className="text-sky-800">    ▄█████▄   </span><span className="text-sky-700"> ▄█████▄ </span></>} />
    <R c={<><span className="text-amber-800">   ▐▓▓▓▓▓▓▓▌  </span><span className="text-slate-800">▐▓▓▓▓▓▓▓▌</span></>} />
    <R c={<><span className="text-amber-700">   ▐{D}{M}{M}{M}{M}{M}{D}▌  </span><span className="text-slate-700">▐{D}{M}{M}{M}{M}{M}{D}▌</span></>} />
    <R c={<><span className="text-amber-600">   ▐{F}{L}{L}□{L}{L}{F}▌  </span><span className="text-slate-600">▐{F}{L}{L}□{L}{L}{F}▌</span></>} />
    <R c={<><span className="text-emerald-800"> ▓▓▓███████▓▓▓▓███████▓▓▓</span></>} />
    <R c={<><span className="text-emerald-900">{D}{D}{D}{D}{D}{D}{D}{D}{D}{D}{D}{D}{D}{D}{D}{D}{D}{D}{D}{D}{D}{D}{D}{D}{D}</span></>} />
  </ArtBox>
);

export const ArtForest = () => (
  <ArtBox>
    <R c={<><span className="text-emerald-900">             .       </span><span className="text-emerald-800">      .      </span></>} />
    <R c={<><span className="text-emerald-700">      ▲      </span><span className="text-emerald-600">      ▲      </span></>} />
    <R c={<><span className="text-emerald-600">     {F}{F}{F}     </span><span className="text-emerald-500">     {F}{F}{F}     </span></>} />
    <R c={<><span className="text-emerald-700">    {D}{M}{L}{M}{D}    </span><span className="text-emerald-600">    {D}{M}{L}{M}{D}    </span></>} />
    <R c={<><span className="text-emerald-800">   {D}{D}{M}{L}{M}{D}{D}   </span><span className="text-emerald-700">   {D}{D}{M}{L}{M}{D}{D}   </span></>} />
    <R c={<><span className="text-amber-900">     ▐█▌     </span><span className="text-amber-950">     ▐█▌     </span></>} />
  </ArtBox>
);

export const ArtWeapon = () => (
  <ArtBox>
    <R c={<><span className="text-slate-600">         ▄</span></>} />
    <R c={<><span className="text-amber-600">O</span><span className="text-amber-500">|</span><span className="text-slate-400">===</span><span className="text-amber-500">|</span><span className="text-sky-300">▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒►</span></>} />
    <R c={<><span className="text-slate-600">         ▀</span></>} />
  </ArtBox>
);

export const ArtArmor = () => (
  <ArtBox>
    <R c={<><span className="text-slate-600">  ▄▄▄▄▄▄▄  </span></>} />
    <R c={<><span className="text-slate-500"> ▐{D}{D}{D}{D}{D}{D}{D}▌ </span></>} />
    <R c={<><span className="text-slate-400">▐{M}██{M}██{M}██{M}▌</span></>} />
    <R c={<><span className="text-slate-400">▐{M}{M}{M}{M}{M}{M}{M}{M}{M}▌</span></>} />
    <R c={<><span className="text-slate-500"> ▀{D}{D}{D}{D}{D}▀ </span></>} />
  </ArtBox>
);

export const ArtInn = () => (
  <ArtBox>
    <R c={<><span className="text-amber-800">      ▄▄▄▄▄▄     </span></>} />
    <R c={<><span className="text-amber-700">    ▄████████▄   </span></>} />
    <R c={<><span className="text-amber-600">   ▐▓▓▓▓▓▓▓▓▓▓▌  </span><span className="text-yellow-500"> S</span></>} />
    <R c={<><span className="text-stone-600">   ▐{L}{L}{L}{L}{L}{L}{L}{L}{L}{L}▌  </span><span className="text-yellow-500"> }</span></>} />
    <R c={<><span className="text-stone-700">   ▐{D}{D}{D}██{D}{D}██{D}{D}▌  </span></>} />
  </ArtBox>
);

export const ArtBank = () => (
  <ArtBox>
    <R c={<><span className="text-yellow-600">   ▄▄▄▄▄▄▄▄   </span></>} />
    <R c={<><span className="text-yellow-500">  ▐{D}{D}{D}{D}{D}{D}{D}{D}▌  </span></>} />
    <R c={<><span className="text-yellow-400">  ▐{F} $$ $$ {F}▌  </span></>} />
    <R c={<><span className="text-yellow-400">  ▐{F} $$ $$ {F}▌  </span></>} />
    <R c={<><span className="text-yellow-500">  ▐{D}{D}{D}{D}{D}{D}{D}{D}▌  </span></>} />
    <R c={<><span className="text-yellow-600">   ▀▀▀▀▀▀▀▀   </span></>} />
  </ArtBox>
);

export const ArtTraining = () => (
  <ArtBox>
    <R c={<><span className="text-red-500">      {T}{T}      </span></>} />
    <R c={<><span className="text-red-600">     {F}{F}{F}{F}     </span></>} />
    <R c={<><span className="text-red-700">    {D}{D}{D}{D}{D}{D}    </span></>} />
    <R c={<><span className="text-stone-500">     ▐██▌     </span></>} />
    <R c={<><span className="text-stone-600">    ▄████▄    </span></>} />
  </ArtBox>
);

export const ArtSkull = () => (
  <ArtBox>
    <R c={<><span className="text-stone-300">    ▄▄▄▄▄▄    </span></>} />
    <R c={<><span className="text-stone-300">   █{L}{L}{L}{L}{L}{L}█   </span></>} />
    <R c={<><span className="text-stone-400">  █ {F}  {F} █  </span></>} />
    <R c={<><span className="text-stone-400">  █  ▄▄  █  </span></>} />
    <R c={<><span className="text-stone-500">   ▀▄▄▄▄▀   </span></>} />
  </ArtBox>
);

export const ArtSwords = () => (
  <ArtBox>
    <R c={<><span className="text-slate-400">      /\  /\      </span></>} />
    <R c={<><span className="text-slate-500">     //{M}\//{M}\     </span></>} />
    <R c={<><span className="text-slate-600">     \\{D}//\\{D}//     </span></>} />
    <R c={<><span className="text-slate-700">      \/  \/      </span></>} />
  </ArtBox>
);

export const ArtHealer = () => (
  <ArtBox>
    <R c={<><span className="text-red-600">      ▄▄      </span></>} />
    <R c={<><span className="text-red-600">      ██      </span></>} />
    <R c={<><span className="text-red-500">  ▄▄▄▄██▄▄▄▄  </span></>} />
    <R c={<><span className="text-red-500">  ██████████  </span></>} />
    <R c={<><span className="text-red-600">      ██      </span></>} />
    <R c={<><span className="text-red-600">      ▀▀      </span></>} />
  </ArtBox>
);

export const ArtLibrary = () => (
  <ArtBox>
    <R c={<><span className="text-amber-800">      ▄▄▄▄      </span></>} />
    <R c={<><span className="text-amber-700">    ▄▓▓▓▓▓▓▄    </span></>} />
    <R c={<><span className="text-amber-600">  ▄▓▓▓▓▓▓▓▓▓▓▄  </span></>} />
    <R c={<><span className="text-amber-500"> ▐{L}{L}{L}{L}{L}{L}{L}{L}{L}{L}▌ </span></>} />
    <R c={<><span className="text-amber-900"> ▀▀▀▀▀▀▀▀▀▀▀▀▀▀ </span></>} />
  </ArtBox>
);

export const ArtWall = () => (
  <ArtBox>
    <R c={<><span className="text-stone-600"> ▐{D}{D}{D}{D}▌▐{D}{D}{D}{D}▌▐{D}{D}{D}{D}▌ </span></>} />
    <R c={<><span className="text-stone-500"> ▐{D}{D}{D}{D}▌▐{D}{D}{D}{D}▌▐{D}{D}{D}{D}▌ </span></>} />
    <R c={<><span className="text-stone-600"> ▐{D}{D}{D}{D}▌▐{D}{D}{D}{D}▌▐{D}{D}{D}{D}▌ </span></>} />
  </ArtBox>
);

export const ArtGrave = () => (
  <ArtBox>
    <R c={<><span className="text-stone-700">      ▄▄      </span></>} />
    <R c={<><span className="text-stone-600">     ◢{D}{D}◣     </span></>} />
    <R c={<><span className="text-stone-500">    ▐{D}R{D}I{D}P{D}▌    </span></>} />
    <R c={<><span className="text-stone-500">    ▐{D}{D}{D}{D}{D}{D}{D}▌    </span></>} />
    <R c={<><span className="text-stone-800">  ▄▄▐{D}{D}{D}{D}{D}{D}{D}▌▄▄  </span></>} />
  </ArtBox>
);

export const ArtStats = () => (
  <ArtBox>
    <R c={<><span className="text-purple-400">   .  .      </span></>} />
    <R c={<><span className="text-purple-500">   |\/|      </span></>} />
    <R c={<><span className="text-purple-600">   |  |      </span></>} />
    <R c={<><span className="text-purple-500">  _L  L_     </span></>} />
    <R c={<><span className="text-purple-400"> /__||__\    </span></>} />
  </ArtBox>
);

export const ArtDragon = () => (
  <ArtBox className="mb-8">
    <R c={<><span className="text-red-600">              ,     \    /      ,        </span></>} />
    <R c={<><span className="text-red-500">             / \    )\__/(     / \       </span></>} />
    <R c={<><span className="text-red-500">            /   \  (_\  /_)   /   \      </span></>} />
    <R c={<><span className="text-orange-500">       ____/_____\__\@  @/___/_____\____ </span></>} />
    <R c={<><span className="text-orange-500">      |             |\../|              |</span></>} />
    <R c={<><span className="text-orange-600">      |              \VV/               |</span></>} />
    <R c={<><span className="text-red-900">      |      </span><span className="text-yellow-500 font-bold tracking-widest">LEGEND OF THE RED DRAGON</span><span className="text-red-900">   |</span></>} />
    <R c={<><span className="text-red-900">      |_________________________________|</span></>} />
    <R c={<><span className="text-red-800">       |    /\ /      \\       \ /\    | </span></>} />
    <R c={<><span className="text-red-800">       |  /   V        ))       V   \  | </span></>} />
    <R c={<><span className="text-red-700">       |/     `       //        '     \| </span></>} />
    <R c={<><span className="text-red-700">       `              V                ' </span></>} />
  </ArtBox>
);

export const ArtDailyNews = () => (
  <ArtBox>
    <R c={<><span className="text-amber-700">      ▄▄▄▄▄▄      </span></>} />
    <R c={<><span className="text-amber-500">     ▐{D}NEWS{D}▌     </span></>} />
    <R c={<><span className="text-amber-200">    ▐{L}{L}{L}{L}{L}{L}{L}{L}▌    </span></>} />
    <R c={<><span className="text-amber-100">   ▐{F} DRAGON {F}▌   </span></>} />
    <R c={<><span className="text-amber-100">   ▐{F} SIGHTD {F}▌   </span></>} />
    <R c={<><span className="text-amber-200">    ▐{L}{L}{L}{L}{L}{L}{L}{L}▌    </span></>} />
    <R c={<><span className="text-amber-700">     ▀▀▀▀▀▀       </span></>} />
  </ArtBox>
);
