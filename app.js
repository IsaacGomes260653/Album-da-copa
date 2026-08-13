const BALL_SVG = `<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="21" fill="#fff" stroke="#151515" stroke-width="3"/><path fill="#151515" d="M24 12l7 5-2.6 8.2h-8.8L17 17z"/><path fill="#151515" d="M9 20l4-8 3 1-1 8zM9 20l3 10 6-3-2-8zM39 20l-4-8-3 1 1 8zM39 20l-3 10-6-3 2-8zM24 40l-6-3 1-7h10l1 7z"/></svg>`;

/* ===================== estado (multi-álbum) ===================== */
const STORE_KEY = 'wc2026-album-v3';
let state = loadState();
saveState();

function uid(){ return Math.random().toString(36).slice(2,10); }

function loadState(){
  try{
    const raw = localStorage.getItem(STORE_KEY);
    if(raw){ const s = JSON.parse(raw); if(s.albums && s.albums.length) return s; }
  }catch(e){}
  // migração de uma versão anterior de álbum único
  let migratedStickers = {};
  try{
    const old = localStorage.getItem('wc2026-album-v2') || localStorage.getItem('wc2026-album-v1');
    if(old) migratedStickers = (JSON.parse(old)||{}).stickers || {};
  }catch(e){}
  const id = uid();
  return { albums:[{ id, name:'Meu Álbum', stickers: migratedStickers }], activeId: id };
}
function saveState(){ localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
function currentAlbum(){ return state.albums.find(a=>a.id===state.activeId) || state.albums[0]; }

function createAlbum(name){
  const a = { id:uid(), name: name.trim()||'Novo álbum', stickers:{} };
  state.albums.push(a); state.activeId = a.id; saveState();
}
function renameAlbum(id,name){
  const a = state.albums.find(x=>x.id===id); if(!a) return;
  a.name = name.trim()||a.name; saveState();
}
function deleteAlbum(id){
  if(state.albums.length<=1) return toast('Você precisa ter pelo menos um álbum');
  state.albums = state.albums.filter(a=>a.id!==id);
  if(state.activeId===id) state.activeId = state.albums[0].id;
  saveState();
}
function switchAlbum(id){ state.activeId = id; saveState(); closeAlbumMenu(); route(); }

/* ===================== figurinhas ===================== */
function key(groupId,no){ return groupId+'_'+no; }
function getSticker(groupId,no){
  return currentAlbum().stickers[key(groupId,no)] || { owned:false, dup:0 };
}
function setSticker(groupId,no,patch){
  const alb = currentAlbum();
  const k = key(groupId,no);
  const cur = alb.stickers[k] || { owned:false, dup:0 };
  const next = Object.assign({}, cur, patch);
  if(!next.owned) next.dup = 0;
  if(!next.owned && next.dup===0){ delete alb.stickers[k]; }
  else alb.stickers[k] = next;
  saveState();
}
function toggleOwned(groupId,no){
  const s = getSticker(groupId,no);
  setSticker(groupId,no,{ owned: !s.owned });
}
function changeDup(groupId,no,delta){
  const s = getSticker(groupId,no);
  if(!s.owned) return;
  const dup = Math.max(0, (s.dup||0)+delta);
  setSticker(groupId,no,{ dup });
}
function stickerCode(group, no){
  if(typeof no === 'number') return group.code+' '+String(no).padStart(2,'0');
  return no;
}

/* ===================== helpers de dados ===================== */
const TEAMS_BY_ID = {};
WC2026_TEAMS.forEach(t=>TEAMS_BY_ID[t.id]=t);
const SPECIALS_GROUP = { id:'specials', name:'Especiais', code:'FWC', c1:'#B18CFF', c2:'#5b3fa8', players: WC2026_SPECIALS };
const COCA_GROUP = { id:'coca', name:'Especiais Coca-Cola', code:'CC', c1:'#ff4757', c2:'#8a0f1e', players: WC2026_COCA };
const ALL_GROUPS = WC2026_TEAMS.concat([SPECIALS_GROUP, COCA_GROUP]);
function groupById(id){ return id==='specials'?SPECIALS_GROUP : id==='coca'?COCA_GROUP : TEAMS_BY_ID[id]; }

function groupOwnedCount(group){
  let n=0; group.players.forEach(p=>{ if(getSticker(group.id,p.no).owned) n++; });
  return n;
}
function globalCounts(){
  let owned=0, total=0;
  ALL_GROUPS.forEach(g=>{ total+=g.players.length; owned+=groupOwnedCount(g); });
  return { owned, total };
}
function normalize(s){
  return (s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
}
function flagImg(teamId, cls){
  const src = WC2026_FLAGS[teamId];
  return src ? `<img src="${src}" alt="">` : '';
}

/* ===================== roteamento ===================== */
function goHome(){ location.hash = '#/'; }
function setView(v){ location.hash = v==='trade' ? '#/trade' : '#/'; }
function openTeam(id){ location.hash = '#/team/'+id; }

window.addEventListener('hashchange', route);
function boot(){ route(); updateGlobalBar(); updateAlbumSwitcher(); initHoverPreview(); }
if(document.readyState==='loading') window.addEventListener('DOMContentLoaded', boot);
else boot();

function route(){
  closeAlbumMenu();
  const h = location.hash.replace(/^#\/?/, '');
  document.querySelectorAll('.navbtn').forEach(b=>b.classList.remove('active'));
  if(h.startsWith('team/')){
    renderTeam(h.slice(5));
  } else if(h.startsWith('trade')){
    document.querySelector('.navbtn[data-view="trade"]').classList.add('active');
    const tab = h.includes('faltam') ? 'missing' : 'dup';
    renderTrade(tab);
  } else {
    document.querySelector('.navbtn[data-view="home"]').classList.add('active');
    renderHome();
  }
  window.scrollTo({top:0,behavior:'instant'in window?'instant':'auto'});
  updateGlobalBar();
  updateAlbumSwitcher();
}

function updateGlobalBar(){
  const {owned,total} = globalCounts();
  const pct = total? Math.round(owned/total*100) : 0;
  document.getElementById('globalProgressFill').style.width = pct+'%';
  document.getElementById('globalProgressLabel').textContent = owned+' / '+total+' ('+pct+'%)';
}
function updateAlbumSwitcher(){
  document.getElementById('albumSwitcherName').textContent = currentAlbum().name;
}

/* ===================== menu de álbuns ===================== */
function toggleAlbumMenu(){
  const el = document.getElementById('albumMenu');
  el.classList.contains('hidden') ? openAlbumMenu() : closeAlbumMenu();
}
function openAlbumMenu(){
  const el = document.getElementById('albumMenu');
  el.innerHTML = `<div class="album-menu-panel">
    ${state.albums.map(a=>`
      <div class="album-item ${a.id===state.activeId?'active':''}">
        <span class="nm" onclick="switchAlbum('${a.id}')">${esc(a.name)}</span>
        <button class="ic" title="Renomear" onclick="promptRenameAlbum('${a.id}')">✎</button>
        <button class="ic" title="Excluir" onclick="confirmDeleteAlbum('${a.id}')">🗑</button>
      </div>`).join('')}
    <div class="album-menu-new" onclick="promptNewAlbum()">+ Novo álbum</div>
  </div>`;
  el.classList.remove('hidden');
  setTimeout(()=>document.addEventListener('click', onDocClickCloseAlbumMenu),0);
}
function closeAlbumMenu(){
  document.getElementById('albumMenu').classList.add('hidden');
  document.getElementById('albumMenu').innerHTML='';
  document.removeEventListener('click', onDocClickCloseAlbumMenu);
}
function onDocClickCloseAlbumMenu(e){
  if(!e.target.closest('.album-menu') && !e.target.closest('.album-switcher')) closeAlbumMenu();
}
function promptNewAlbum(){
  openModal(`<h3>Novo álbum</h3>
    <input id="mNewAlbumName" placeholder="Ex.: Álbum do João" maxlength="40">
    <div class="modal-actions"><button class="btn ghost" onclick="closeModal()">Cancelar</button>
    <button class="btn" onclick="const v=document.getElementById('mNewAlbumName').value; if(v.trim()){createAlbum(v);closeModal();closeAlbumMenu();route();toast('Álbum criado!')}">Criar</button></div>`);
  setTimeout(()=>document.getElementById('mNewAlbumName').focus(),30);
}
function promptRenameAlbum(id){
  const a = state.albums.find(x=>x.id===id);
  openModal(`<h3>Renomear álbum</h3>
    <input id="mRenameAlbumName" value="${esc(a.name)}" maxlength="40">
    <div class="modal-actions"><button class="btn ghost" onclick="closeModal()">Cancelar</button>
    <button class="btn" onclick="renameAlbum('${id}',document.getElementById('mRenameAlbumName').value);closeModal();closeAlbumMenu();openAlbumMenu();updateAlbumSwitcher();">Salvar</button></div>`);
  setTimeout(()=>{ const el=document.getElementById('mRenameAlbumName'); el.focus(); el.select(); },30);
}
function confirmDeleteAlbum(id){
  const a = state.albums.find(x=>x.id===id);
  if(!confirm(`Excluir o álbum "${a.name}"? Isso apaga todas as marcações dele.`)) return;
  deleteAlbum(id); closeAlbumMenu(); route(); toast('Álbum excluído');
}
function esc(s){ const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }

/* ===================== modal genérico ===================== */
function openModal(innerHtml){
  document.getElementById('modalRoot').innerHTML = `<div class="modal-scrim" onclick="if(event.target===this)closeModal()"><div class="modal-box">${innerHtml}</div></div>`;
}
function closeModal(){ document.getElementById('modalRoot').innerHTML=''; }

/* ===================== home ===================== */
function renderHome(){
  const main = document.getElementById('main');
  const {owned,total} = globalCounts();
  const teamsComplete = WC2026_TEAMS.filter(t=>groupOwnedCount(t)===t.players.length).length;
  let dupTotal = 0;
  Object.values(currentAlbum().stickers).forEach(s=>{ dupTotal += (s.dup||0); });

  const groups = {};
  WC2026_TEAMS.forEach(t=>{ (groups[t.group] = groups[t.group]||[]).push(t); });

  const spOwned = groupOwnedCount(SPECIALS_GROUP);
  const ccOwned = groupOwnedCount(COCA_GROUP);

  let html = `
  <div class="hero">
    <h1><span class="ball" style="display:inline-block;width:38px;height:38px;vertical-align:-8px">${BALL_SVG}</span> Meu Álbum da Copa</h1>
    <p>Marque as figurinhas que você já colou, controle as repetidas e as faltantes, e organize suas trocas — Copa do Mundo FIFA 2026, ${WC2026_TEAMS.length*20+WC2026_SPECIALS.length+WC2026_COCA.length} figurinhas na ordem oficial do álbum.</p>
  </div>
  <div class="stats-row">
    <div class="stat-box"><div class="v">${owned}</div><div class="k">Coladas</div></div>
    <div class="stat-box"><div class="v">${total-owned}</div><div class="k">Faltam</div></div>
    <div class="stat-box"><div class="v">${dupTotal}</div><div class="k">Repetidas</div></div>
    <div class="stat-box"><div class="v">${teamsComplete}/48</div><div class="k">Álbuns completos</div></div>
  </div>
  <div class="specials-row">
    <div class="specials-banner" onclick="openTeam('specials')">
      <div class="icon">✦</div>
      <div>
        <div class="t">Figurinhas Especiais</div>
        <div class="s">Escudo Panini, emblema, mascote, bola e a história das Copas</div>
      </div>
      <div class="prog">${spOwned}/${SPECIALS_GROUP.players.length}</div>
    </div>
    <div class="specials-banner coca" onclick="openTeam('coca')">
      <div class="icon">🥤</div>
      <div>
        <div class="t">Especiais Coca-Cola</div>
        <div class="s">Prancha exclusiva com 12 craques, encontradas em garrafas Coca-Cola</div>
      </div>
      <div class="prog">${ccOwned}/${COCA_GROUP.players.length}</div>
    </div>
  </div>
  <div class="groups-grid">`;

  Object.keys(groups).sort().forEach(g=>{
    html += `<div class="group-block"><h2>Grupo ${g}</h2><div class="teams-grid">`;
    groups[g].forEach(t=>{
      const oc = groupOwnedCount(t);
      const pct = Math.round(oc/t.players.length*100);
      const complete = oc===t.players.length;
      html += `
      <div class="team-card ${complete?'complete':''}" data-team-id="${t.id}" style="--c1:${t.c1};--c2:${t.c2}" onclick="openTeam('${t.id}')">
        <div class="team-flag">${flagImg(t.id)}</div>
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

/* ===================== prévia em miniatura (hover) ===================== */
function initHoverPreview(){
  const main = document.getElementById('main');
  main.addEventListener('mousemove', e=>{
    const card = e.target.closest('.team-card');
    if(!card){ hideHoverPreview(); return; }
    showHoverPreview(card.dataset.teamId, e.clientX, e.clientY);
  });
  main.addEventListener('mouseleave', hideHoverPreview);
}
function showHoverPreview(teamId, x, y){
  const t = TEAMS_BY_ID[teamId]; if(!t) return;
  const el = document.getElementById('hoverPreview');
  const cells = t.players.map(p=>`<span class="hp-cell ${getSticker(t.id,p.no).owned?'on':''}"></span>`).join('');
  el.innerHTML = `<div class="hp-title">${t.name}</div><div class="hp-grid">${cells}</div>`;
  const left = Math.min(x+16, window.innerWidth-100);
  const top = Math.min(y+16, window.innerHeight-100);
  el.style.left = left+'px'; el.style.top = top+'px';
  el.classList.add('show'); el.classList.remove('hidden');
}
function hideHoverPreview(){
  const el = document.getElementById('hoverPreview');
  el.classList.remove('show'); el.classList.add('hidden');
}

/* ===================== página da seleção / especiais ===================== */
function renderTeam(teamId){
  const t = groupById(teamId);
  const main = document.getElementById('main');
  if(!t){ main.innerHTML = '<p>Não encontrado.</p>'; return; }
  main.innerHTML = teamPageShell(t);
  renderStickerGrid(t);
}

function teamPageShell(t){
  const oc = groupOwnedCount(t);
  let dup = 0;
  t.players.forEach(p=>{ dup += getSticker(t.id,p.no).dup||0; });
  const isTeam = !!TEAMS_BY_ID[t.id];
  const subtitle = t.id==='specials' ? 'Emblema, mascote, bola oficial e a história das Copas do Mundo'
    : t.id==='coca' ? 'Prancha exclusiva de 12 craques — figurinhas encontradas em garrafas Coca-Cola'
    : `Grupo ${t.group} · figurinhas 1 a 20`;
  const flagBlock = isTeam
    ? `<div class="team-header-flag">${flagImg(t.id)}</div>`
    : `<div class="team-header-flag" style="display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.15);font-family:'Barlow Condensed';font-weight:800;font-size:16px">${t.code}</div>`;
  return `
  <button class="back-btn" onclick="goHome()">← Voltar ao álbum</button>
  <div class="team-header" style="--team-c1:${t.c1};--team-c2:${t.c2}">
    <div class="team-header-row">
      ${flagBlock}
      <div>
        <div class="team-header-name font-head">${t.name}</div>
        <div class="team-header-meta">${subtitle}</div>
      </div>
    </div>
    <div class="team-header-stats">
      <div class="ths"><div class="v">${oc}/${t.players.length}</div><div class="k">Coladas</div></div>
      <div class="ths"><div class="v">${Math.round(oc/t.players.length*100)}%</div><div class="k">Completo</div></div>
      <div class="ths"><div class="v">${dup}</div><div class="k">Repetidas</div></div>
    </div>
  </div>
  <div class="sticker-grid" id="stickerGrid"></div>
  `;
}

function renderStickerGrid(t){
  const grid = document.getElementById('stickerGrid');
  grid.innerHTML = t.players.map(p=>{
    const s = getSticker(t.id,p.no);
    const kindClass = p.kind ? 'kind-'+p.kind : '';
    return `
    <div class="sticker ${kindClass} ${s.owned?'owned':''}" style="--team-c1:${t.c1};--team-c2:${t.c2}" onclick="toggleOwned('${t.id}',${JSON.stringify(p.no)});refreshSticker('${t.id}')">
      ${p.kind==='logo'?'<span class="sticker-badge">✦ BRILHANTE</span>':''}
      <div class="sticker-top">
        <div class="sticker-no">${typeof p.no==='number'?'#'+p.no:p.no}</div>
        <div class="sticker-check"></div>
      </div>
      <div class="sticker-name">${p.name}</div>
      ${s.owned?`
      <div class="sticker-dup" onclick="event.stopPropagation()">
        <span class="lbl">Repetida</span>
        <div class="stepper">
          <button onclick="changeDup('${t.id}',${JSON.stringify(p.no)},-1);refreshSticker('${t.id}')">–</button>
          <span class="n ${s.dup>0?'has':''}">${s.dup||0}</span>
          <button onclick="changeDup('${t.id}',${JSON.stringify(p.no)},1);refreshSticker('${t.id}')">+</button>
        </div>
      </div>`:''}
    </div>`;
  }).join('');
}

function refreshSticker(teamId){
  const t = groupById(teamId);
  renderStickerGrid(t);
  const header = document.querySelector('.team-header');
  if(header){
    const tmp = document.createElement('div');
    tmp.innerHTML = teamPageShell(t);
    header.outerHTML = tmp.querySelector('.team-header').outerHTML;
  }
  updateGlobalBar();
}

/* ===================== trocas: repetidas + faltantes ===================== */
function renderTrade(tab){
  tab = tab || 'dup';
  const main = document.getElementById('main');
  let rows = [];
  ALL_GROUPS.forEach(t=>{
    t.players.forEach(p=>{
      const s = getSticker(t.id,p.no);
      if(tab==='dup' && s.owned && s.dup>0) rows.push({ team:t, player:p, qty:s.dup });
      if(tab==='missing' && !s.owned) rows.push({ team:t, player:p });
    });
  });
  rows.sort((a,b)=> a.team.name.localeCompare(b.team.name) || (''+a.player.no).localeCompare(''+b.player.no));

  const tabsHtml = `<div class="trade-tabs">
    <button class="trade-tab ${tab==='dup'?'active':''}" onclick="location.hash='#/trade'">🔁 Repetidas</button>
    <button class="trade-tab ${tab==='missing'?'active':''}" onclick="location.hash='#/trade/faltam'">📋 Faltantes</button>
  </div>`;

  if(!rows.length){
    main.innerHTML = tabsHtml + `
    <div class="trade-empty">
      <div class="big">${tab==='dup'?'Nenhuma repetida ainda':'Nenhuma faltante — álbum completo! 🎉'}</div>
      ${tab==='dup'?'Quando você marcar figurinhas repetidas, elas aparecem aqui — prontas pra organizar suas trocas.':''}
    </div>`;
    return;
  }

  const totalDup = tab==='dup' ? rows.reduce((a,r)=>a+r.qty,0) : 0;
  const countLabel = tab==='dup'
    ? `${rows.length} figurinha${rows.length===1?'':'s'} diferente${rows.length===1?'':'s'} · ${totalDup} repetida${totalDup===1?'':'s'} no total`
    : `${rows.length} figurinha${rows.length===1?'':'s'} faltando`;

  main.innerHTML = tabsHtml + `
  <div class="trade-toolbar">
    <div class="count">${countLabel}</div>
    <button class="btn ghost" onclick="copyList('${tab}')">📋 Copiar lista</button>
  </div>
  <div class="trade-list">
    ${rows.map(r=>`
      <div class="trade-row">
        <span class="tflag">${TEAMS_BY_ID[r.team.id]?flagImg(r.team.id):''}</span>
        <span class="tcode">${stickerCode(r.team,r.player.no)}</span>
        <div class="tinfo">
          <div class="tteam">${r.team.name}</div>
          <div class="tname">${r.player.name}</div>
        </div>
        ${tab==='dup'?`<span class="tqty">${r.qty}x</span>`:''}
      </div>`).join('')}
  </div>`;
  window._tradeRows = rows;
  window._tradeTab = tab;
}

function copyList(tab){
  const rows = window._tradeRows||[];
  const title = tab==='dup' ? '🔁 Minhas repetidas' : '📋 O que me falta';
  const lines = [title+' — Álbum Copa 2026 ('+currentAlbum().name+')', ''];
  rows.forEach(r=> lines.push(`${stickerCode(r.team,r.player.no)} ${r.player.name}${tab==='dup'?' — '+r.qty+'x':''}`));
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
    el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1A1C23;color:#F4F2EA;padding:10px 18px;border-radius:999px;font-weight:700;font-size:13px;z-index:200;border:1px solid rgba(255,255,255,.16);box-shadow:0 12px 30px rgba(0,0,0,.5);opacity:0;transition:opacity .25s';
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
  ALL_GROUPS.forEach(t=>{
    if(TEAMS_BY_ID[t.id] && normalize(t.name).includes(q)){
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
    <div class="search-panel-head"><b>Resultados para "${esc(q)}"</b><button class="search-close" onclick="closeSearch()">✕</button></div>`;
  if(!results.length){
    html += `<div class="search-empty">Nada encontrado. Tente outro nome.</div>`;
  } else {
    results.forEach(r=>{
      const flagHtml = TEAMS_BY_ID[r.team.id] ? flagImg(r.team.id) : '';
      if(r.type==='team'){
        html += `<div class="search-item" onclick="closeSearch();openTeam('${r.team.id}')">
          <span class="sflag">${flagHtml}</span>
          <div class="sinfo"><div class="sname">${r.team.name}</div><div class="steam">Grupo ${r.team.group} · seleção</div></div>
        </div>`;
      } else {
        html += `<div class="search-item" onclick="closeSearch();openTeam('${r.team.id}')">
          <span class="sflag">${flagHtml}</span>
          <div class="sinfo"><div class="sname">${r.player.name}</div><div class="steam">${r.team.name}</div></div>
          <span class="sno">${stickerCode(r.team,r.player.no)}</span>
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
