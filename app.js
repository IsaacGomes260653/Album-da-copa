/* ===================== estado ===================== */
const STORE_KEY = 'wc2026-album-v1';
let state = loadState();

function loadState(){
  try{
    const raw = localStorage.getItem(STORE_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return { stickers:{} };
}
function saveState(){ localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

function key(teamId,no){ return teamId+'_'+no; }
function getSticker(teamId,no){
  return state.stickers[key(teamId,no)] || { owned:false, dup:0 };
}
function setSticker(teamId,no,patch){
  const k = key(teamId,no);
  const cur = state.stickers[k] || { owned:false, dup:0 };
  const next = Object.assign({}, cur, patch);
  if(!next.owned) next.dup = 0;
  if(!next.owned && next.dup===0){ delete state.stickers[k]; }
  else state.stickers[k] = next;
  saveState();
}
function toggleOwned(teamId,no){
  const s = getSticker(teamId,no);
  setSticker(teamId,no,{ owned: !s.owned });
}
function changeDup(teamId,no,delta){
  const s = getSticker(teamId,no);
  if(!s.owned) return;
  const dup = Math.max(0, (s.dup||0)+delta);
  setSticker(teamId,no,{ dup });
}

/* ===================== helpers de dados ===================== */
const TEAMS_BY_ID = {};
WC2026_TEAMS.forEach(t=>TEAMS_BY_ID[t.id]=t);

const POS_LABEL = { GK:'Gol', DF:'Zaga', MF:'Meio', FW:'Ataque' };

function teamOwnedCount(team){
  let n=0; team.players.forEach(p=>{ if(getSticker(team.id,p.no).owned) n++; });
  return n;
}
function globalCounts(){
  let owned=0, total=0;
  WC2026_TEAMS.forEach(t=>{ total+=t.players.length; owned+=teamOwnedCount(t); });
  return { owned, total };
}
function normalize(s){
  return (s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
}

/* ===================== roteamento ===================== */
function goHome(){ location.hash = '#/'; }
function setView(v){ location.hash = v==='trade' ? '#/trade' : '#/'; }
function openTeam(id){ location.hash = '#/team/'+id; }

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', ()=>{ route(); updateGlobalBar(); });

function route(){
  const h = location.hash.replace(/^#\/?/, '');
  document.querySelectorAll('.navbtn').forEach(b=>b.classList.remove('active'));
  if(h.startsWith('team/')){
    const id = h.slice(5);
    renderTeam(id);
  } else if(h==='trade'){
    document.querySelector('.navbtn[data-view="trade"]').classList.add('active');
    renderTrade();
  } else {
    document.querySelector('.navbtn[data-view="home"]').classList.add('active');
    renderHome();
  }
  window.scrollTo({top:0,behavior:'instant'in window?'instant':'auto'});
  updateGlobalBar();
}

function updateGlobalBar(){
  const {owned,total} = globalCounts();
  const pct = total? Math.round(owned/total*100) : 0;
  document.getElementById('globalProgressFill').style.width = pct+'%';
  document.getElementById('globalProgressLabel').textContent = owned+' / '+total+' ('+pct+'%)';
}

/* ===================== home ===================== */
function renderHome(){
  const main = document.getElementById('main');
  const {owned,total} = globalCounts();
  const teamsComplete = WC2026_TEAMS.filter(t=>teamOwnedCount(t)===t.players.length).length;
  let dupTotal = 0;
  Object.values(state.stickers).forEach(s=>{ dupTotal += (s.dup||0); });

  const groups = {};
  WC2026_TEAMS.forEach(t=>{ (groups[t.group] = groups[t.group]||[]).push(t); });

  let html = `
  <div class="hero">
    <h1>Meu Álbum da Copa</h1>
    <p>Marque as figurinhas que você já colou, controle as repetidas e organize suas trocas — Copa do Mundo FIFA 2026, com os 48 elencos e números oficiais.</p>
  </div>
  <div class="stats-row">
    <div class="stat-box"><div class="v">${owned}</div><div class="k">Coladas</div></div>
    <div class="stat-box"><div class="v">${total-owned}</div><div class="k">Faltam</div></div>
    <div class="stat-box"><div class="v">${dupTotal}</div><div class="k">Repetidas</div></div>
    <div class="stat-box"><div class="v">${teamsComplete}/48</div><div class="k">Álbuns completos</div></div>
  </div>
  <div class="groups-grid">`;

  Object.keys(groups).sort().forEach(g=>{
    html += `<div class="group-block"><h2>Grupo ${g}</h2><div class="teams-grid">`;
    groups[g].forEach(t=>{
      const oc = teamOwnedCount(t);
      const pct = Math.round(oc/t.players.length*100);
      const complete = oc===t.players.length;
      html += `
      <div class="team-card ${complete?'complete':''}" style="--c1:${t.c1};--c2:${t.c2}" onclick="openTeam('${t.id}')">
        <div class="bg"></div>
        <div class="team-badge">${t.code}</div>
        <div class="team-name">${t.name}</div>
        <div class="team-progress"><div class="team-progress-fill" style="width:${pct}%"></div></div>
        <div class="team-progress-label">${oc}/${t.players.length}</div>
      </div>`;
    });
    html += `</div></div>`;
  });
  html += `</div>`;
  main.innerHTML = html;
}

/* ===================== página da seleção ===================== */
let curPosFilter = 'ALL';
function renderTeam(teamId){
  const t = TEAMS_BY_ID[teamId];
  const main = document.getElementById('main');
  if(!t){ main.innerHTML = '<p>Seleção não encontrada.</p>'; return; }
  curPosFilter = 'ALL';
  main.innerHTML = teamPageShell(t);
  renderStickerGrid(t);
}

function teamPageShell(t){
  const oc = teamOwnedCount(t);
  let dup = 0;
  t.players.forEach(p=>{ dup += getSticker(t.id,p.no).dup||0; });
  return `
  <button class="back-btn" onclick="goHome()">← Voltar ao álbum</button>
  <div class="team-header" style="--team-c1:${t.c1};--team-c2:${t.c2}">
    <div class="team-header-row">
      <div class="team-header-flag">${t.code}</div>
      <div>
        <div class="team-header-name font-head">${t.name}</div>
        <div class="team-header-meta">Grupo ${t.group} · Técnico: ${t.coach||'—'}</div>
      </div>
    </div>
    <div class="team-header-stats">
      <div class="ths"><div class="v">${oc}/${t.players.length}</div><div class="k">Coladas</div></div>
      <div class="ths"><div class="v">${Math.round(oc/t.players.length*100)}%</div><div class="k">Completo</div></div>
      <div class="ths"><div class="v">${dup}</div><div class="k">Repetidas</div></div>
    </div>
  </div>
  <div class="pos-tabs" id="posTabs"></div>
  <div class="sticker-grid" id="stickerGrid"></div>
  `;
}

function renderStickerGrid(t){
  const tabsEl = document.getElementById('posTabs');
  const tabs = [['ALL','Todos'],['GK','Goleiros'],['DF','Zagueiros'],['MF','Meio-campo'],['FW','Atacantes']];
  tabsEl.innerHTML = tabs.map(([k,label])=>
    `<button class="pos-tab ${curPosFilter===k?'active':''}" onclick="filterPos('${t.id}','${k}')">${label}</button>`
  ).join('');

  const grid = document.getElementById('stickerGrid');
  const players = t.players.filter(p=> curPosFilter==='ALL' || p.pos===curPosFilter);
  grid.innerHTML = players.map(p=>{
    const s = getSticker(t.id,p.no);
    return `
    <div class="sticker ${s.owned?'owned':''}" style="--team-c1:${t.c1};--team-c2:${t.c2}" id="stk_${t.id}_${p.no}">
      <div class="sticker-top" onclick="toggleOwned('${t.id}',${p.no}); refreshSticker('${t.id}',${p.no})">
        <div class="sticker-no">#${p.no}</div>
        <div class="sticker-pos">${POS_LABEL[p.pos]||p.pos}</div>
      </div>
      <div class="sticker-name" onclick="toggleOwned('${t.id}',${p.no}); refreshSticker('${t.id}',${p.no})">${p.name}${p.cap?'<div class="sticker-cap">Capitão</div>':''}</div>
      <div class="sticker-check">${s.owned?'✓ Colada':'Toque para marcar'}</div>
      ${s.owned?`
      <div class="sticker-dup">
        <span class="lbl">Repetida</span>
        <div class="stepper">
          <button onclick="event.stopPropagation();changeDup('${t.id}',${p.no},-1);refreshSticker('${t.id}',${p.no})">–</button>
          <span class="n ${s.dup>0?'has':''}">${s.dup||0}</span>
          <button onclick="event.stopPropagation();changeDup('${t.id}',${p.no},1);refreshSticker('${t.id}',${p.no})">+</button>
        </div>
      </div>`:''}
    </div>`;
  }).join('');
}

function filterPos(teamId,pos){
  curPosFilter = pos;
  renderStickerGrid(TEAMS_BY_ID[teamId]);
}

function refreshSticker(teamId,no){
  renderStickerGrid(TEAMS_BY_ID[teamId]);
  // atualiza cabeçalho (contadores) sem re-renderizar tudo
  const t = TEAMS_BY_ID[teamId];
  const header = document.querySelector('.team-header');
  if(header) header.outerHTML = teamPageShellHeaderOnly(t);
  updateGlobalBar();
}
function teamPageShellHeaderOnly(t){
  const oc = teamOwnedCount(t);
  let dup = 0;
  t.players.forEach(p=>{ dup += getSticker(t.id,p.no).dup||0; });
  return `<div class="team-header" style="--team-c1:${t.c1};--team-c2:${t.c2}">
    <div class="team-header-row">
      <div class="team-header-flag">${t.code}</div>
      <div>
        <div class="team-header-name font-head">${t.name}</div>
        <div class="team-header-meta">Grupo ${t.group} · Técnico: ${t.coach||'—'}</div>
      </div>
    </div>
    <div class="team-header-stats">
      <div class="ths"><div class="v">${oc}/${t.players.length}</div><div class="k">Coladas</div></div>
      <div class="ths"><div class="v">${Math.round(oc/t.players.length*100)}%</div><div class="k">Completo</div></div>
      <div class="ths"><div class="v">${dup}</div><div class="k">Repetidas</div></div>
    </div>
  </div>`;
}

/* ===================== repetidas / trocas ===================== */
function renderTrade(){
  const main = document.getElementById('main');
  const rows = [];
  WC2026_TEAMS.forEach(t=>{
    t.players.forEach(p=>{
      const s = getSticker(t.id,p.no);
      if(s.owned && s.dup>0){
        rows.push({ team:t, player:p, qty:s.dup });
      }
    });
  });
  rows.sort((a,b)=> a.team.name.localeCompare(b.team.name) || a.player.no-b.player.no);

  if(!rows.length){
    main.innerHTML = `
    <div class="trade-empty">
      <div class="big">Nenhuma repetida ainda</div>
      Quando você marcar figurinhas repetidas nas páginas das seleções, elas aparecem aqui — prontas pra organizar suas trocas.
    </div>`;
    return;
  }

  const totalDup = rows.reduce((a,r)=>a+r.qty,0);
  main.innerHTML = `
  <div class="trade-toolbar">
    <div class="count">${rows.length} figurinha${rows.length===1?'':'s'} diferente${rows.length===1?'':'s'} · ${totalDup} repetida${totalDup===1?'':'s'} no total</div>
    <button class="btn ghost" onclick="copyTradeList()">📋 Copiar lista para troca</button>
  </div>
  <div class="trade-list">
    ${rows.map(r=>`
      <div class="trade-row">
        <span class="tflag" style="--c1:${r.team.c1};--c2:${r.team.c2}">${r.team.code}</span>
        <span class="tno">#${r.player.no}</span>
        <div class="tinfo">
          <div class="tteam">${r.team.name}</div>
          <div class="tname">${r.player.name}</div>
        </div>
        <span class="tqty">${r.qty}x</span>
      </div>`).join('')}
  </div>`;
  window._tradeRows = rows;
}

function copyTradeList(){
  const rows = window._tradeRows||[];
  const lines = ['🔁 Minhas repetidas — Álbum Copa 2026', ''];
  rows.forEach(r=> lines.push(`${r.team.name} #${r.player.no} ${r.player.name} — ${r.qty}x`));
  const text = lines.join('\n');
  if(navigator.clipboard){
    navigator.clipboard.writeText(text).then(()=> toast('Lista copiada!')).catch(()=>fallbackCopy(text));
  } else fallbackCopy(text);
}
function fallbackCopy(text){
  const ta = document.createElement('textarea');
  ta.value = text; document.body.appendChild(ta); ta.select();
  try{ document.execCommand('copy'); toast('Lista copiada!'); }catch(e){}
  document.body.removeChild(ta);
}
function toast(msg){
  let el = document.getElementById('toastEl');
  if(!el){
    el = document.createElement('div'); el.id='toastEl';
    el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#20201c;color:#f4efe2;padding:10px 18px;border-radius:999px;font-weight:700;font-size:13px;z-index:200;box-shadow:0 10px 30px rgba(0,0,0,.3);opacity:0;transition:opacity .25s';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  requestAnimationFrame(()=>{ el.style.opacity='1'; setTimeout(()=>{ el.style.opacity='0'; },1600); });
}

/* ===================== busca ===================== */
const searchInput = document.getElementById('searchInput');
const searchOverlay = document.getElementById('searchResults');
searchInput.addEventListener('input', doSearch);
searchInput.addEventListener('focus', ()=>{ if(searchInput.value.trim()) doSearch(); });
searchOverlay.addEventListener('click', e=>{ if(e.target===searchOverlay) closeSearch(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeSearch(); });

function doSearch(){
  const q = normalize(searchInput.value.trim());
  if(!q){ closeSearch(); return; }
  const results = [];
  WC2026_TEAMS.forEach(t=>{
    if(normalize(t.name).includes(q)){
      results.push({ type:'team', team:t });
    }
    t.players.forEach(p=>{
      if(normalize(p.name).includes(q)) results.push({ type:'player', team:t, player:p });
    });
  });
  renderSearch(results.slice(0,40), searchInput.value.trim());
}
function renderSearch(results, q){
  searchOverlay.classList.remove('hidden');
  let html = `<div class="search-panel">
    <div class="search-panel-head"><b>Resultados para "${q}"</b><button class="search-close" onclick="closeSearch()">✕</button></div>`;
  if(!results.length){
    html += `<div class="search-empty">Nada encontrado. Tente outro nome.</div>`;
  } else {
    results.forEach(r=>{
      if(r.type==='team'){
        html += `<div class="search-item" onclick="closeSearch();openTeam('${r.team.id}')">
          <span class="sflag" style="--c1:${r.team.c1};--c2:${r.team.c2}">${r.team.code}</span>
          <div class="sinfo"><div class="sname">${r.team.name}</div><div class="steam">Grupo ${r.team.group} · seleção</div></div>
        </div>`;
      } else {
        html += `<div class="search-item" onclick="closeSearch();openTeam('${r.team.id}')">
          <span class="sflag" style="--c1:${r.team.c1};--c2:${r.team.c2}">${r.team.code}</span>
          <div class="sinfo"><div class="sname">${r.player.name}</div><div class="steam">${r.team.name} · ${POS_LABEL[r.player.pos]||r.player.pos}</div></div>
          <span class="sno">#${r.player.no}</span>
        </div>`;
      }
    });
  }
  html += `</div>`;
  searchOverlay.innerHTML = html;
}
function closeSearch(){
  searchOverlay.classList.add('hidden');
  searchOverlay.innerHTML = '';
}
