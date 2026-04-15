import { useState, useEffect, useCallback } from "react";

const MENU_ITEMS = [
  "8 Ct Nuggets","12 Ct Nuggets","Original Chicken Sandwich",
  "Spicy Chicken Sandwich","Deluxe Chicken Sandwich","Spicy Deluxe Sandwich",
  "Southwest Veggie Wrap","Grilled Chicken Wrap",
];
const SAUCES = [
  "Chik Fila Sauce","Honey Roasted BBQ","Garden Herb","Zesty Buffalo",
  "Polynesian","Avocado Ranch","BBQ","Fat Free Honey Mustard","Ranch","Honey Mustard",
];
const INITIAL_ROSTER = [
  {id:"r01",name:"Olivia Schurr",item:"8 Ct Nuggets",sauce:"Honey Roasted BBQ"},
  {id:"r02",name:"Violet Junger",item:"8 Ct Nuggets",sauce:"Garden Herb"},
  {id:"r03",name:"Katie Ahern",item:"8 Ct Nuggets",sauce:"Garden Herb"},
  {id:"r04",name:"Wren",item:"Grilled Chicken Wrap",sauce:"Avocado Ranch"},
  {id:"r05",name:"Riley Ervin",item:"Original Chicken Sandwich",sauce:""},
  {id:"r06",name:"Coach Mize",item:"8 Ct Nuggets",sauce:"Chik Fila Sauce"},
  {id:"r07",name:"Jocelyn Miller",item:"Southwest Veggie Wrap",sauce:""},
  {id:"r08",name:"Dami/Eunice Fadairo",item:"Spicy Chicken Sandwich",sauce:""},
  {id:"r09",name:"Lexi Conner",item:"8 Ct Nuggets",sauce:"Zesty Buffalo"},
  {id:"r10",name:"Isabelle Corn",item:"Original Chicken Sandwich",sauce:""},
  {id:"r11",name:"Praise Akinsiku",item:"8 Ct Nuggets",sauce:"Polynesian"},
  {id:"r12",name:"Jane Hersam",item:"8 Ct Nuggets",sauce:"Chik Fila Sauce"},
  {id:"r13",name:"Shelby Stevens",item:"8 Ct Nuggets",sauce:"Chik Fila Sauce"},
  {id:"r14",name:"Kayla Bosserman",item:"Original Chicken Sandwich",sauce:""},
  {id:"r15",name:"Rose Jacoboski",item:"Original Chicken Sandwich",sauce:""},
  {id:"r16",name:"Janelle Francois Jonassaint",item:"8 Ct Nuggets",sauce:"Chik Fila Sauce"},
  {id:"r17",name:"Fatoumata Wade",item:"Spicy Chicken Sandwich",sauce:""},
  {id:"r18",name:"Dmitrii",item:"8 Ct Nuggets",sauce:"Chik Fila Sauce"},
  {id:"r19",name:"Ethan Bodnar",item:"Spicy Chicken Sandwich",sauce:""},
  {id:"r20",name:"Dani",item:"8 Ct Nuggets",sauce:"Chik Fila Sauce"},
  {id:"r21",name:"Brittain Bills",item:"8 Ct Nuggets",sauce:"Chik Fila Sauce"},
  {id:"r22",name:"Melanie Janko",item:"Original Chicken Sandwich",sauce:""},
  {id:"r23",name:"Sami Miller",item:"Spicy Chicken Sandwich",sauce:""},
  {id:"r24",name:"Siena Lister",item:"8 Ct Nuggets",sauce:"Chik Fila Sauce"},
  {id:"r25",name:"Brooke Widner",item:"8 Ct Nuggets",sauce:"Chik Fila Sauce"},
  {id:"r26",name:"Delaney Smith",item:"8 Ct Nuggets",sauce:"Chik Fila Sauce"},
  {id:"r27",name:"Zoe Smyth",item:"Original Chicken Sandwich",sauce:""},
  {id:"r28",name:"Adelaide Mabanta",item:"8 Ct Nuggets",sauce:"Chik Fila Sauce"},
  {id:"r29",name:"Hayden Sherman",item:"Original Chicken Sandwich",sauce:""},
  {id:"r30",name:"Michelle Nwosu",item:"Spicy Chicken Sandwich",sauce:""},
  {id:"r31",name:"Alivya Velez",item:"Original Chicken Sandwich",sauce:""},
  {id:"r32",name:"Amelia Cadle",item:"8 Ct Nuggets",sauce:"BBQ"},
  {id:"r33",name:"Aaliyah Carruthers",item:"Original Chicken Sandwich",sauce:"Chik Fila Sauce"},
  {id:"r34",name:"Claire Bowsher",item:"Original Chicken Sandwich",sauce:""},
  {id:"r35",name:"Alexandra Coffey",item:"Southwest Veggie Wrap",sauce:"Fat Free Honey Mustard"},
  {id:"r36",name:"Nora Corn",item:"Original Chicken Sandwich",sauce:""},
  {id:"r37",name:"Avery Olsen",item:"8 Ct Nuggets",sauce:"Garden Herb"},
  {id:"r38",name:"Kayden Krawiec",item:"8 Ct Nuggets",sauce:"Garden Herb"},
];

async function apiGet() {
  const res = await fetch("/api/data");
  return res.json();
}
async function apiSaveRoster(roster) {
  await fetch("/api/roster", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(roster) });
}
async function apiSaveGames(games) {
  await fetch("/api/games", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(games) });
}

export default function App() {
  const [screen, setScreen] = useState("games");
  const [roster, setRoster] = useState([]);
  const [games, setGames] = useState([]);
  const [selGameId, setSelGameId] = useState(null);
  const [gameTab, setGameTab] = useState("config");
  const [checked, setChecked] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    apiGet().then(data => {
      setRoster(data.roster ?? INITIAL_ROSTER);
      setGames(data.games ?? []);
      setReady(true);
    });
  }, []);

  const saveRoster = useCallback(async r => { setRoster(r); await apiSaveRoster(r); }, []);
  const saveGames = useCallback(async g => { setGames(g); await apiSaveGames(g); }, []);

  const selGame = games.find(g => g.id === selGameId);
  const getOrders = g => [
    ...roster.filter(r => g.attendees.includes(r.id)).map(r => ({...r, isAdHoc: false})),
    ...g.adHocOrders,
  ];

  const openGame = id => { setSelGameId(id); setGameTab("config"); setChecked({}); setScreen("game"); };

  const createGame = (name, date) => {
    const g = { id: `g${Date.now()}`, name, date, attendees: roster.map(r=>r.id), adHocOrders: [] };
    const ng = [...games, g];
    saveGames(ng);
    openGame(g.id);
  };

  const delGame = id => { saveGames(games.filter(g=>g.id!==id)); if (screen==="game") setScreen("games"); };

  const toggleMember = aid => saveGames(games.map(g => {
    if (g.id !== selGameId) return g;
    const a = g.attendees.includes(aid) ? g.attendees.filter(x=>x!==aid) : [...g.attendees, aid];
    return {...g, attendees: a};
  }));

  const setAllMembers = all => saveGames(games.map(g =>
    g.id !== selGameId ? g : {...g, attendees: all ? roster.map(r=>r.id) : []}
  ));

  const addAdHoc = (label, item, sauce, count) => {
    const orders = Array.from({length: count}, (_, i) => ({
      id: `ah${Date.now()}${i}`, name: count>1?`${label} ${i+1}`:label, item, sauce, isAdHoc: true,
    }));
    saveGames(games.map(g => g.id!==selGameId ? g : {...g, adHocOrders:[...g.adHocOrders,...orders]}));
  };

  const delAdHoc = oid => saveGames(games.map(g =>
    g.id!==selGameId ? g : {...g, adHocOrders: g.adHocOrders.filter(o=>o.id!==oid)}
  ));

  if (!ready) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"#fafafa"}}>
      <div style={{fontSize:48,marginBottom:8}}>🍗</div>
      <p style={{color:"#999",fontSize:14}}>Loading your orders...</p>
    </div>
  );

  if (screen === "game" && selGame) return (
    <GameScreen game={selGame} roster={roster} tab={gameTab} setTab={setGameTab}
      checked={checked} setChecked={setChecked} getOrders={getOrders}
      onToggle={toggleMember} onSetAll={setAllMembers}
      onAddAdHoc={addAdHoc} onDelAdHoc={delAdHoc}
      onBack={() => setScreen("games")} />
  );
  if (screen === "roster") return (
    <RosterScreen roster={roster} onSave={saveRoster} onBack={() => setScreen("games")} />
  );
  return (
    <GamesScreen games={games} getOrders={getOrders} onCreate={createGame}
      onOpen={openGame} onDelete={delGame} onRoster={() => setScreen("roster")} />
  );
}

function GamesScreen({ games, getOrders, onCreate, onOpen, onDelete, onRoster }) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [delConfirm, setDelConfirm] = useState(null);

  const submit = () => {
    if (!name.trim()) return;
    onCreate(name.trim(), date);
    setCreating(false); setName(""); setDate("");
  };

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 pt-6 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span style={{fontSize:22}}>🍗</span>
              <h1 className="text-xl font-bold text-gray-900">CFA Order Manager</h1>
            </div>
            <p className="text-xs text-gray-400 mt-0.5 ml-8">Avon Tennis &middot; Away Games</p>
          </div>
          <button onClick={onRoster}
            className="text-xs font-semibold text-red-600 border border-red-200 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 mt-1 transition-colors">
            👥 Roster
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {!creating ? (
          <button onClick={() => setCreating(true)}
            className="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl hover:bg-red-700 active:scale-95 transition-all shadow text-sm tracking-wide">
            + New Game Order
          </button>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">New Game Order</h3>
            <input type="text" placeholder="Game name (e.g. vs Brownsburg)" value={name}
              onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} autoFocus
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mb-2 outline-none focus:ring-2 focus:ring-red-300" />
            <input type="date" value={date} onChange={e=>setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mb-3 outline-none focus:ring-2 focus:ring-red-300" />
            <div className="flex gap-2">
              <button onClick={submit} className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-red-700">Create</button>
              <button onClick={() => {setCreating(false);setName("");setDate("");}}
                className="flex-1 border border-gray-200 text-gray-500 font-medium py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        )}

        {games.length === 0 && !creating ? (
          <div className="text-center py-20 text-gray-400">
            <div style={{fontSize:52}} className="mb-3">🏟️</div>
            <p className="font-semibold text-gray-500">No games yet</p>
            <p className="text-sm mt-1">Create your first game order above</p>
          </div>
        ) : (
          [...games].reverse().map(game => {
            const orders = getOrders(game);
            const isDel = delConfirm === game.id;
            const dateStr = game.date
              ? new Date(game.date+"T12:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})
              : null;
            return (
              <div key={game.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center p-4 gap-3">
                  <div className="flex-1 cursor-pointer min-w-0" onClick={() => onOpen(game.id)}>
                    <h3 className="font-bold text-gray-900 truncate">{game.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{dateStr ? dateStr+" \u00b7 " : ""}{orders.length} total orders</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isDel ? (
                      <>
                        <button onClick={e=>{e.stopPropagation();onDelete(game.id);setDelConfirm(null);}}
                          className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold">Delete</button>
                        <button onClick={e=>{e.stopPropagation();setDelConfirm(null);}}
                          className="text-xs border border-gray-300 text-gray-500 px-3 py-1.5 rounded-lg font-medium">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={e=>{e.stopPropagation();setDelConfirm(game.id);}} className="text-gray-300 hover:text-red-400 text-lg p-1">🗑️</button>
                        <button onClick={() => onOpen(game.id)}
                          className="bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-red-700">Open →</button>
                      </>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 border-t border-gray-100 px-4 py-2 flex gap-4 text-xs text-gray-400">
                  <span className="text-green-600 font-medium">✓ {game.attendees.length} athletes</span>
                  {game.adHocOrders.length > 0 && <span className="text-amber-600 font-medium">+ {game.adHocOrders.length} extra</span>}
                  <span className="ml-auto text-red-500 font-bold">{orders.length} total</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function GameScreen({ game, roster, tab, setTab, checked, setChecked, getOrders, onToggle, onSetAll, onAddAdHoc, onDelAdHoc, onBack }) {
  const orders = getOrders(game);
  const dateStr = game.date
    ? new Date(game.date+"T12:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})
    : null;
  const TABS = [{id:"config",label:"⚙️ Configure"},{id:"summary",label:"📋 Summary"},{id:"handout",label:"✅ Hand Out"}];

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 pt-4 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="text-red-600 text-sm font-semibold flex-shrink-0">← Games</button>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-gray-900 truncate">{game.name}</h2>
            {dateStr && <p className="text-xs text-gray-400">{dateStr}</p>}
          </div>
          <span className="text-sm font-black text-red-600 flex-shrink-0">{orders.length} orders</span>
        </div>
        <div className="flex gap-1 pb-0">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 text-xs font-bold py-2.5 rounded-t-xl transition-colors ${
                tab===t.id ? "bg-red-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4">
        {tab==="config"  && <ConfigTab game={game} roster={roster} onToggle={onToggle} onSetAll={onSetAll} onAddAdHoc={onAddAdHoc} onDelAdHoc={onDelAdHoc} />}
        {tab==="summary" && <SummaryTab orders={orders} />}
        {tab==="handout" && <HandOutTab orders={orders} checked={checked} setChecked={setChecked} />}
      </div>
    </div>
  );
}

function ConfigTab({ game, roster, onToggle, onSetAll, onAddAdHoc, onDelAdHoc }) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState("");
  const [item, setItem] = useState("Original Chicken Sandwich");
  const [sauce, setSauce] = useState("");
  const [count, setCount] = useState(1);

  const attending = roster.filter(r => game.attendees.includes(r.id));
  const filtered  = roster.filter(r => {
    const name = r.name.toLowerCase();
    const terms = search.toLowerCase().split(",").map(s => s.trim()).filter(Boolean);
    if (terms.length === 0) return true;
    return terms.some(term => name.includes(term));
  });

  const submitAdHoc = () => {
    if (!label.trim()) return;
    onAddAdHoc(label.trim(), item, sauce, count);
    setLabel(""); setSauce(""); setCount(1); setItem("Original Chicken Sandwich"); setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <Stat value={attending.length} label="Attending" color="green" />
        <Stat value={roster.length - attending.length} label="Not Going" color="gray" />
        <Stat value={game.adHocOrders.length} label="Ad-Hoc" color="amber" />
      </div>

      <Card>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-sm">Extra / Ad-Hoc Orders</h3>
          <button onClick={() => setShowForm(!showForm)}
            className="text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-amber-600 transition-colors">
            + Add
          </button>
        </div>

        {showForm && (
          <div className="p-3 bg-amber-50 border-b border-amber-100 space-y-2">
            <div className="flex gap-2">
              <div>
                <label className="text-xs text-gray-500 block mb-1 font-medium">Qty</label>
                <select value={count} onChange={e=>setCount(Number(e.target.value))}
                  className="w-16 border border-gray-300 rounded-lg px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400">
                  {[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1 font-medium">Label / Name</label>
                <input type="text" placeholder={count>1?"e.g. Manager":"Name or label"} value={label}
                  onChange={e=>setLabel(e.target.value)} autoFocus
                  className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1 font-medium">Item</label>
              <select value={item} onChange={e=>{setItem(e.target.value);setSauce("");}}
                className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400">
                {MENU_ITEMS.map(i=><option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1 font-medium">Sauce (optional)</label>
              <select value={sauce} onChange={e=>setSauce(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400">
                <option value="">No preference</option>
                {SAUCES.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={submitAdHoc}
                className="flex-1 bg-amber-500 text-white text-sm font-bold py-2 rounded-xl hover:bg-amber-600">
                Add {count>1?`${count} Orders`:"Order"}
              </button>
              <button onClick={()=>setShowForm(false)}
                className="flex-1 border border-gray-300 text-gray-500 text-sm font-medium py-2 rounded-xl hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        )}

        {game.adHocOrders.length === 0 ? (
          <p className="text-sm text-gray-400 px-4 py-3 italic">No extra orders for this game</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {game.adHocOrders.map(o => (
              <div key={o.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{o.name}</p>
                  <p className="text-xs text-gray-400">{o.item}{o.sauce ? ` \u00b7 ${o.sauce}` : ""}</p>
                </div>
                <button onClick={() => onDelAdHoc(o.id)} className="text-gray-300 hover:text-red-500 text-2xl leading-none font-light ml-3">&times;</button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <div className="px-4 py-3 border-b border-gray-100 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 text-sm">Athlete Attendance</h3>
            <div className="flex gap-1.5">
              <button onClick={() => onSetAll(true)} className="text-xs text-green-600 border border-green-200 bg-green-50 px-2.5 py-1 rounded-lg hover:bg-green-100 font-semibold transition-colors">All In</button>
              <button onClick={() => onSetAll(false)} className="text-xs text-gray-500 border border-gray-200 px-2.5 py-1 rounded-lg hover:bg-gray-100 font-medium transition-colors">Clear</button>
            </div>
          </div>
          <input type="text" placeholder="Search athletes..." value={search} onChange={e=>setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-300" />
        </div>
        <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
          {filtered.map(a => {
            const on = game.attendees.includes(a.id);
            return (
              <div key={a.id} onClick={() => onToggle(a.id)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors ${!on?"opacity-40":""}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${on?"bg-green-500 border-green-500":"border-gray-300"}`}>
                  {on && <span className="text-white text-xs leading-none font-bold">✓</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${on?"text-gray-900":"text-gray-400 line-through"}`}>{a.name}</p>
                  <p className="text-xs text-gray-400 truncate">{a.item}{a.sauce ? ` \u00b7 ${a.sauce}` : ""}</p>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <p className="text-sm text-gray-400 px-4 py-4 text-center italic">No athletes found</p>}
        </div>
      </Card>
    </div>
  );
}

function SummaryTab({ orders }) {
  const ORDER = ["8 Ct Nuggets","12 Ct Nuggets","Original Chicken Sandwich","Spicy Chicken Sandwich","Deluxe Chicken Sandwich","Spicy Deluxe Sandwich","Southwest Veggie Wrap","Grilled Chicken Wrap"];
  const groups = {};
  orders.forEach(o => {
    if (!groups[o.item]) groups[o.item] = { count: 0, sauces: {} };
    groups[o.item].count++;
    const sk = o.sauce || "No sauce specified";
    groups[o.item].sauces[sk] = (groups[o.item].sauces[sk] || 0) + 1;
  });
  const items = Object.keys(groups).sort((a,b) => {
    const ai = ORDER.indexOf(a), bi = ORDER.indexOf(b);
    return (ai===-1?99:ai)-(bi===-1?99:bi);
  });

  return (
    <div className="space-y-3">
      <div className="rounded-2xl p-5 text-white shadow-md" style={{background:"linear-gradient(135deg,#dc2626,#b91c1c)"}}>
        <p className="text-sm font-semibold opacity-80">Total Orders to Pick Up</p>
        <p className="text-6xl font-black mt-1 tracking-tight">{orders.length}</p>
        <p className="text-xs opacity-60 mt-2">{items.length} item type{items.length!==1?"s":""}</p>
      </div>

      {items.map(item => {
        const g = groups[item];
        const sauces = Object.entries(g.sauces).sort((a,b)=>b[1]-a[1]);
        const nonEmpty = sauces.filter(([s])=>s!=="No sauce specified");
        const noSauce = sauces.find(([s])=>s==="No sauce specified");
        return (
          <Card key={item}>
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">{item}</h3>
              <span className="bg-red-600 text-white text-sm font-black w-8 h-8 rounded-full flex items-center justify-center">{g.count}</span>
            </div>
            <div className="divide-y divide-gray-100">
              {nonEmpty.map(([sauce,cnt]) => (
                <div key={sauce} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-sm text-gray-700">{sauce}</span>
                  <span className="text-sm font-bold text-gray-800 bg-gray-100 px-2.5 py-0.5 rounded-full">&times;{cnt}</span>
                </div>
              ))}
              {noSauce && (
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-sm text-gray-400 italic">No sauce specified</span>
                  <span className="text-sm font-bold text-gray-400 bg-gray-50 px-2.5 py-0.5 rounded-full">&times;{noSauce[1]}</span>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function HandOutTab({ orders, checked, setChecked }) {
  const toggle = id => setChecked(p => ({...p, [id]: !p[id]}));
  const doneCount = Object.values(checked).filter(Boolean).length;
  const pct = orders.length ? Math.round(doneCount/orders.length*100) : 0;
  const remaining = orders.filter(o => !checked[o.id]);
  const done = orders.filter(o => checked[o.id]);

  return (
    <div className="space-y-3">
      <Card>
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gray-700">Handed Out</span>
            <span className="text-sm font-black text-gray-900">{doneCount} / {orders.length}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div className="h-3 rounded-full transition-all duration-500"
              style={{width:`${pct}%`, background:"#22c55e"}} />
          </div>
          {pct===100 && orders.length>0 && (
            <p className="text-center text-green-600 font-bold text-sm mt-2">🎉 All orders handed out!</p>
          )}
        </div>
      </Card>

      {remaining.length > 0 && (
        <Card>
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-700">Remaining — {remaining.length}</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {remaining.map(o => (
              <div key={o.id} onClick={() => toggle(o.id)}
                className="flex items-center gap-3 px-4 py-4 cursor-pointer hover:bg-gray-50 active:bg-green-50 transition-colors select-none">
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0 hover:border-green-400 transition-colors" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">{o.name}</p>
                  <p className="text-xs text-gray-400">{o.item}{o.sauce ? ` \u00b7 ${o.sauce}` : ""}</p>
                </div>
                {o.isAdHoc && <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-semibold flex-shrink-0">extra</span>}
              </div>
            ))}
          </div>
        </Card>
      )}

      {done.length > 0 && (
        <div className="opacity-50">
          <Card>
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-500">✅ Done — {done.length}</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {done.map(o => (
                <div key={o.id} onClick={() => toggle(o.id)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors select-none">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-400 line-through truncate">{o.name}</p>
                    <p className="text-xs text-gray-300 truncate">{o.item}{o.sauce ? ` \u00b7 ${o.sauce}` : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function RosterScreen({ roster, onSave, onBack }) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [item, setItem] = useState("8 Ct Nuggets");
  const [sauce, setSauce] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  const filtered = roster.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  const add = () => {
    if (!name.trim()) return;
    onSave([...roster, {id:`r${Date.now()}`, name:name.trim(), item, sauce}]);
    setName(""); setSauce(""); setItem("8 Ct Nuggets"); setShowAdd(false);
  };

  const remove = id => onSave(roster.filter(r => r.id !== id));

  const saveEdit = () => {
    if (!editing.name.trim()) return;
    onSave(roster.map(r => r.id===editing.id ? {id:r.id, name:editing.name.trim(), item:editing.item, sauce:editing.sauce} : r));
    setEditing(null);
  };

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 pt-4 pb-3 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-red-600 text-sm font-semibold">← Games</button>
          <h2 className="flex-1 font-bold text-gray-900">Master Roster</h2>
          <span className="text-sm text-gray-400 font-medium">{roster.length} athletes</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <button onClick={() => {setShowAdd(!showAdd);setEditing(null);}}
          className="w-full bg-red-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-red-700 transition-colors">
          + Add Athlete
        </button>

        {showAdd && (
          <Card>
            <div className="p-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3">New Athlete</h3>
              <FormFields name={name} setName={setName} item={item} setItem={setItem} sauce={sauce} setSauce={setSauce} autoFocus />
              <div className="flex gap-2 mt-3">
                <button onClick={add} className="flex-1 bg-red-600 text-white text-sm font-bold py-2.5 rounded-xl hover:bg-red-700">Add to Roster</button>
                <button onClick={()=>setShowAdd(false)} className="flex-1 border border-gray-200 text-gray-500 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          </Card>
        )}

        {editing && (
          <div className="bg-white rounded-2xl border-2 border-red-200 shadow-sm">
            <div className="p-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Edit — {roster.find(r=>r.id===editing.id)?.name}</h3>
              <FormFields
                name={editing.name} setName={v=>setEditing({...editing,name:v})}
                item={editing.item} setItem={v=>setEditing({...editing,item:v,sauce:""})}
                sauce={editing.sauce} setSauce={v=>setEditing({...editing,sauce:v})}
                autoFocus />
              <div className="flex gap-2 mt-3">
                <button onClick={saveEdit} className="flex-1 bg-red-600 text-white text-sm font-bold py-2.5 rounded-xl hover:bg-red-700">Save Changes</button>
                <button onClick={()=>setEditing(null)} className="flex-1 border border-gray-200 text-gray-500 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <input type="text" placeholder="Search roster..." value={search} onChange={e=>setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-red-300 shadow-sm" />

        <Card>
          {filtered.map(a => (
            <div key={a.id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{a.name}</p>
                <p className="text-xs text-gray-400">{a.item}{a.sauce ? ` \u00b7 ${a.sauce}` : ""}</p>
              </div>
              <button onClick={()=>{setEditing({...a});setShowAdd(false);}}
                className="text-xs text-blue-500 border border-blue-200 px-2.5 py-1 rounded-lg hover:bg-blue-50 font-semibold transition-colors">Edit</button>
              <button onClick={()=>remove(a.id)} className="text-gray-300 hover:text-red-500 text-2xl leading-none font-light ml-1">&times;</button>
            </div>
          ))}
          {filtered.length===0 && <p className="text-sm text-gray-400 px-4 py-6 text-center italic">No athletes found</p>}
        </Card>
      </div>
    </div>
  );
}

function Card({ children }) {
  return <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">{children}</div>;
}

function Stat({ value, label, color }) {
  const colors = {green:"bg-green-50 border-green-100 text-green-600 text-green-500", gray:"bg-gray-100 border-gray-100 text-gray-400 text-gray-400", amber:"bg-amber-50 border-amber-100 text-amber-600 text-amber-500"};
  const [bg, border, val, lbl] = colors[color].split(" ");
  return (
    <div className={`${bg} border ${border} rounded-2xl p-3 text-center`}>
      <div className={`text-2xl font-black ${val}`}>{value}</div>
      <div className={`text-xs font-semibold ${lbl}`}>{label}</div>
    </div>
  );
}

function FormFields({ name, setName, item, setItem, sauce, setSauce, autoFocus }) {
  return (
    <div className="space-y-2">
      <input type="text" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} autoFocus={autoFocus}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300" />
      <select value={item} onChange={e=>{setItem(e.target.value);setSauce("");}}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300">
        {MENU_ITEMS.map(i=><option key={i} value={i}>{i}</option>)}
      </select>
      <select value={sauce} onChange={e=>setSauce(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300">
        <option value="">No sauce preference</option>
        {SAUCES.map(s=><option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );
}
