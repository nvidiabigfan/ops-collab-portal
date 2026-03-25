// ââ ìë³¸ renderImpact ì¦ì ë¬´ë ¥í (ìºìë index.html ëì) ââââââ
(function() {
  // index.htmlì ìë³¸ renderImpact ë³¸ì²´ë¥¼ noopì¼ë¡ êµì²´
  // product_impact.js íë¨ì window.renderImpact = ... ê° ì´í ì¬ì ìí¨
  if (typeof window.renderImpact === "function"
      && window.renderImpact.toString().indexOf("replaced by product_impact") === -1
      && window.renderImpact.toString().indexOf("switchImpactTab") === -1) {
    window.renderImpact = async function() {};
  }
  // showPage í¨ì¹ â impact ì¼ì´ì¤ìì ì°ë¦¬ renderImpact í¸ì¶ ë³´ì¥
  if (typeof window.showPage === "function") {
    const _orig = window.showPage;
    window.showPage = function(page) {
      _orig(page);
      if (page === "impact") renderImpact();
    };
  }
})();
/* product_impact.js v2 ÃÂ¢ÃÂÃÂ gviz ÃÂªÃÂ¸ÃÂ°ÃÂ«ÃÂ°ÃÂ, SheetsAPI ÃÂ¬ÃÂÃÂÃÂ¬ÃÂ¡ÃÂ´ ÃÂ¬ÃÂÃÂÃÂ¬ÃÂÃÂ */

const _PI_SID = "12ZpwaDPNCV1V48xUtuWv2cooGtAjBZLIbClu3R88HoU";

// gviz CSV fetch ÃÂ¢ÃÂÃÂ ÃÂªÃÂ°ÃÂÃÂ¬ÃÂ²ÃÂ´ ÃÂ«ÃÂ°ÃÂ°ÃÂ¬ÃÂÃÂ´ (ÃÂ­ÃÂÃÂÃÂ¬ÃÂÃÂÃÂ¬ÃÂÃÂÃÂ¬ÃÂÃÂ ÃÂ¬ÃÂÃÂÃÂ¬ÃÂÃÂ)
async function _gvizFetch(sheetName) {
  const url = "https://docs.google.com/spreadsheets/d/" + _PI_SID
    + "/gviz/tq?tqx=out:csv&sheet=" + encodeURIComponent(sheetName);
  const resp = await fetch(url);
  const csv  = await resp.text();
  if (!csv.trim()) return [];
  const lines = csv.trim().split("\n");
  const hdrs  = lines[0].replace(/"/g,"").split(",");
  return lines.slice(1).map(line => {
    const vals = []; let cur = "", inQ = false;
    for (const ch of line + ",") {
      if (ch === '"') { inQ = !inQ; }
      else if (ch === "," && !inQ) { vals.push(cur); cur = ""; }
      else cur += ch;
    }
    const obj = {};
    hdrs.forEach((h,i) => { obj[h] = (vals[i]||"").trim(); });
    return obj;
  });
}

// ÃÂ¬ÃÂ±ÃÂÃÂ«ÃÂÃÂ ÃÂ«ÃÂ±ÃÂÃÂ¬ÃÂ§ÃÂ
function _chBadge(ch) {
  return ch === "ÃÂ«ÃÂÃÂÃÂ­ÃÂÃÂÃÂ­ÃÂÃÂÃÂ­ÃÂÃÂÃÂ¬ÃÂÃÂ´ÃÂ¬ÃÂ§ÃÂ"
    ? '<span style="background:#e3f0ff;color:#1a6cbf;padding:1px 7px;border-radius:4px;font-size:11px;font-weight:600">ÃÂ«ÃÂÃÂÃÂ­ÃÂÃÂÃÂ­ÃÂÃÂ</span>'
    : '<span style="background:#e8f5e9;color:#2e7d32;padding:1px 7px;border-radius:4px;font-size:11px;font-weight:600">ÃÂ«ÃÂÃÂ¤ÃÂ¬ÃÂÃÂ´ÃÂ«ÃÂ ÃÂÃÂ­ÃÂÃÂ¸</span>';
}

// ÃÂ­ÃÂÃÂ­ ÃÂ«ÃÂ²ÃÂÃÂ­ÃÂÃÂ¼ ÃÂ¬ÃÂÃÂ¤ÃÂ­ÃÂÃÂÃÂ¬ÃÂÃÂ¼
function _tStyle(on) {
  return on
    ? "padding:8px 22px;border:none;background:#1a6cbf;color:#fff;cursor:pointer;font-size:14px;font-weight:600;border-radius:6px 6px 0 0;margin-right:4px"
    : "padding:8px 22px;border:none;background:#f0f4fa;color:#555;cursor:pointer;font-size:14px;border-radius:6px 6px 0 0;margin-right:4px";
}

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ renderImpact ÃÂ¬ÃÂÃÂ¤ÃÂ«ÃÂ²ÃÂÃÂ«ÃÂÃÂ¼ÃÂ¬ÃÂÃÂ´ÃÂ«ÃÂÃÂ ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
window.renderImpact = async function() {
  setContent(
    '<div style="display:flex;border-bottom:2px solid #e0e7ef;margin-bottom:16px">'
    + '<button id="tab-pg"  onclick="switchImpactTab(\'page\')"    style="' + _tStyle(true)  + '">ÃÂ°ÃÂÃÂÃÂ ÃÂ¬ÃÂÃÂÃÂ­ÃÂÃÂ¥ÃÂ­ÃÂÃÂÃÂ¬ÃÂÃÂ´ÃÂ¬ÃÂ§ÃÂ ÃÂ¬ÃÂ¡ÃÂ°ÃÂ­ÃÂÃÂ</button>'
    + '<button id="tab-prd" onclick="switchImpactTab(\'product\')" style="' + _tStyle(false) + '">ÃÂ°ÃÂÃÂÃÂ ÃÂ¬ÃÂÃÂÃÂ­ÃÂÃÂÃÂ¬ÃÂÃÂÃÂ­ÃÂÃÂ¥ ÃÂ¬ÃÂ¡ÃÂ°ÃÂ­ÃÂÃÂ</button>'
    + '</div>'
    + '<div id="pi-body"><div class="loading">ÃÂ¢ÃÂÃÂ³ ÃÂ«ÃÂ¡ÃÂÃÂ«ÃÂÃÂ© ÃÂ¬ÃÂ¤ÃÂ...</div></div>'
  );
  setActions('<button class="btn btn-primary" onclick="openPgModal()">+ ÃÂ­ÃÂÃÂÃÂ¬ÃÂÃÂ´ÃÂ¬ÃÂ§ÃÂ ÃÂ«ÃÂÃÂ±ÃÂ«ÃÂ¡ÃÂ</button>');
  switchImpactTab("page");
};

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ ÃÂ­ÃÂÃÂ­ ÃÂ¬ÃÂ ÃÂÃÂ­ÃÂÃÂ ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
window.switchImpactTab = function(tab) {
  const pg  = document.getElementById("tab-pg");
  const prd = document.getElementById("tab-prd");
  if (pg)  pg.style.cssText  = _tStyle(tab === "page");
  if (prd) prd.style.cssText = _tStyle(tab === "product");
  if (tab === "page") _loadPgTab();
  else                _loadPrdTab();
};

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ ÃÂ­ÃÂÃÂ­1: ÃÂ¬ÃÂÃÂÃÂ­ÃÂÃÂ¥ÃÂ­ÃÂÃÂÃÂ¬ÃÂÃÂ´ÃÂ¬ÃÂ§ÃÂ (gviz) ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
async function _loadPgTab() {
  const body = document.getElementById("pi-body");
  if (!body) return;
  body.innerHTML = '<div class="loading">ÃÂ¢ÃÂÃÂ³ ÃÂ¬ÃÂÃÂÃÂ­ÃÂÃÂ¥ÃÂ­ÃÂÃÂÃÂ¬ÃÂÃÂ´ÃÂ¬ÃÂ§ÃÂ ÃÂ«ÃÂ¡ÃÂÃÂ«ÃÂÃÂ© ÃÂ¬ÃÂ¤ÃÂ...</div>';
  try {
    const rows = await _gvizFetch("ÃÂ¬ÃÂÃÂÃÂ­ÃÂÃÂ¥ÃÂ­ÃÂÃÂÃÂ¬ÃÂÃÂ´ÃÂ¬ÃÂ§ÃÂ");
    window._pgData = rows;
    const sites = [...new Set(rows.map(r=>r["ÃÂ¬ÃÂÃÂ¬ÃÂ¬ÃÂÃÂ´ÃÂ­ÃÂÃÂ¸"]).filter(Boolean))];
    const sOpts = sites.map(s=>'<option value="'+s+'">'+s+'</option>').join("");
    body.innerHTML =
      '<div class="card" style="margin-bottom:0">'
      + '<div class="filter-bar">'
      + '<input id="pg-q" placeholder="ÃÂ°ÃÂÃÂÃÂ ÃÂ­ÃÂÃÂÃÂ¬ÃÂÃÂ´ÃÂ¬ÃÂ§ÃÂÃÂ«ÃÂªÃÂ, ÃÂ«ÃÂÃÂ´ÃÂ«ÃÂÃÂ¹ÃÂ¬ÃÂÃÂ, ÃÂ­ÃÂÃÂÃÂ«ÃÂ©ÃÂ´ID ÃÂªÃÂ²ÃÂÃÂ¬ÃÂÃÂ" oninput="renderPgTable()" value="">'
      + '<select id="pg-site-f" onchange="renderPgTable()"><option value="">ÃÂ¬ÃÂ ÃÂÃÂ¬ÃÂ²ÃÂ´ ÃÂ¬ÃÂÃÂ¬ÃÂ¬ÃÂÃÂ´ÃÂ­ÃÂÃÂ¸</option>'+sOpts+'</select>'
      + '<span class="filter-count" id="pg-count">0ÃÂªÃÂ±ÃÂ´</span>'
      + '</div><div class="tbl-wrap" id="pg-tbl-wrap"></div></div>';
    // renderPgTable() 직접 호출 대신 pg-tbl-wrap에 직접 렌더링
    const wrap = document.getElementById('pg-tbl-wrap');
    if (!wrap) return;
    const q    = (document.getElementById('pg-q')     || {}).value || '';
    const site = (document.getElementById('pg-site-f')|| {}).value || '';
    const cnt  = document.getElementById('pg-count');
    const filtered = rows.filter(r =>
      (!q    || [r['페이지ID'],r['페이지명'],r['담당자'],r['화면ID']].some(v=>(v||'').includes(q))) &&
      (!site || r['사이트'] === site)
    );
    if (cnt) cnt.textContent = filtered.length + '건';
    if (!filtered.length) {
      wrap.innerHTML = '<table><thead><tr><th>ID</th><th>사이트</th><th>페이지명</th><th>담당자</th><th>변경일</th></tr></thead><tbody><tr class="empty-row"><td colspan="5">등록된 페이지가 없습니다</td></tr></tbody></table>';
      return;
    }
    const tbody = filtered.map(r =>
      '<tr>'
      + '<td><code style="font-size:12px">' + (r['페이지ID']||'') + '</code></td>'
      + '<td style="font-size:12px">' + (r['사이트']||'') + '</td>'
      + '<td>' + (r['페이지명']||'') + '</td>'
      + '<td>' + (r['담당자']||'') + '</td>'
      + '<td style="font-size:12px">' + (r['최근변경일']||'') + '</td>'
      + '</tr>'
    ).join('');
    wrap.innerHTML = '<table><thead><tr><th>ID</th><th>사이트</th><th>페이지명</th><th>담당자</th><th>변경일</th></tr></thead><tbody>' + tbody + '</tbody></table>';
  } catch(e) {
    body.innerHTML = '<div style="padding:24px;color:red">ÃÂ«ÃÂ¡ÃÂÃÂ«ÃÂÃÂ ÃÂ¬ÃÂÃÂ¤ÃÂ­ÃÂÃÂ¨: ' + e.message + '</div>';
  }
}

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ ÃÂ­ÃÂÃÂ­2: ÃÂ¬ÃÂÃÂÃÂ­ÃÂÃÂÃÂ¬ÃÂÃÂÃÂ­ÃÂÃÂ¥ ÃÂ¬ÃÂ¡ÃÂ°ÃÂ­ÃÂÃÂ ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
async function _loadPrdTab() {
  const body = document.getElementById("pi-body");
  if (!body) return;
  body.innerHTML = '<div class="loading">ÃÂ¢ÃÂÃÂ³ ÃÂ¬ÃÂÃÂÃÂ­ÃÂÃÂÃÂ­ÃÂÃÂÃÂ«ÃÂ©ÃÂ´ ÃÂ«ÃÂ§ÃÂ¤ÃÂ­ÃÂÃÂ ÃÂ«ÃÂ¡ÃÂÃÂ«ÃÂÃÂ© ÃÂ¬ÃÂ¤ÃÂ...</div>';
  try {
    const rows = await _gvizFetch("ÃÂ¬ÃÂÃÂÃÂ­ÃÂÃÂÃÂ­ÃÂÃÂÃÂ«ÃÂ©ÃÂ´ÃÂ«ÃÂ§ÃÂ¤ÃÂ­ÃÂÃÂ");
    window._mapData = rows;
    const prds = [...new Set(rows.map(r=>r["ÃÂ¬ÃÂÃÂÃÂ­ÃÂÃÂÃÂ«ÃÂªÃÂ"]))].filter(Boolean).sort((a,b)=>a.localeCompare(b,"ko"));
    const opts = prds.map(p=>'<option value="'+p+'">'+p+'</option>').join("");
    body.innerHTML =
      '<div class="card" style="margin-bottom:12px">'
      + '<div class="filter-bar">'
      + '<label style="font-size:13px;font-weight:600;white-space:nowrap">ÃÂ¬ÃÂÃÂÃÂ­ÃÂÃÂ ÃÂ¬ÃÂÃÂ ÃÂ­ÃÂÃÂ</label>'
      + '<select id="prd-sel" onchange="onPrdSel()" style="min-width:260px;font-size:14px;padding:5px 8px">'
      + '<option value="">-- ÃÂ¬ÃÂÃÂÃÂ­ÃÂÃÂÃÂ¬ÃÂÃÂ ÃÂ¬ÃÂÃÂ ÃÂ­ÃÂÃÂÃÂ­ÃÂÃÂÃÂ¬ÃÂÃÂ¸ÃÂ¬ÃÂÃÂ --</option>'+opts+'</select>'
      + '<input id="prd-inp" placeholder="ÃÂ°ÃÂÃÂÃÂ ÃÂ¬ÃÂ§ÃÂÃÂ¬ÃÂ ÃÂ ÃÂ¬ÃÂÃÂÃÂ«ÃÂ ÃÂ¥" oninput="onPrdInp()" style="min-width:180px;font-size:14px;padding:5px 8px;border:1px solid #ccc;border-radius:5px">'
      + '</div></div>'
      + '<div id="prd-result"><div style="padding:40px;text-align:center;color:#aaa">ÃÂ¬ÃÂÃÂÃÂ­ÃÂÃÂÃÂ¬ÃÂÃÂ ÃÂ¬ÃÂÃÂ ÃÂ­ÃÂÃÂÃÂ­ÃÂÃÂÃÂ«ÃÂ©ÃÂ´ ÃÂ¬ÃÂÃÂÃÂ­ÃÂÃÂ¥ÃÂ«ÃÂ°ÃÂÃÂ«ÃÂÃÂ ÃÂ­ÃÂÃÂÃÂ«ÃÂ©ÃÂ´ ÃÂ«ÃÂªÃÂ©ÃÂ«ÃÂ¡ÃÂÃÂ¬ÃÂÃÂ´ ÃÂ­ÃÂÃÂÃÂ¬ÃÂÃÂÃÂ«ÃÂÃÂ©ÃÂ«ÃÂÃÂÃÂ«ÃÂÃÂ¤</div></div>';
  } catch(e) {
    body.innerHTML = '<div style="padding:24px;color:red">ÃÂ«ÃÂ¡ÃÂÃÂ«ÃÂÃÂ ÃÂ¬ÃÂÃÂ¤ÃÂ­ÃÂÃÂ¨: ' + e.message + '</div>';
  }
}

// ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ ÃÂ¬ÃÂÃÂÃÂ­ÃÂÃÂ ÃÂ¬ÃÂÃÂ ÃÂ­ÃÂÃÂ ÃÂ¬ÃÂÃÂ´ÃÂ«ÃÂ²ÃÂ¤ÃÂ­ÃÂÃÂ¸ ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
window.onPrdSel = function() {
  const v = (document.getElementById("prd-sel")||{}).value||"";
  const i = document.getElementById("prd-inp"); if(i) i.value=v;
  _showPrd(v);
};
window.onPrdInp = function() {
  const v = ((document.getElementById("prd-inp")||{}).value||"").trim();
  const s = document.getElementById("prd-sel");
  if(s){const o=[...s.options].find(o=>o.value===v);if(o)s.value=v;}
  _showPrd(v);
};
function _showPrd(product) {
  const el = document.getElementById("prd-result"); if(!el) return;
  if (!product) { el.innerHTML='<div style="padding:40px;text-align:center;color:#aaa">ÃÂ¬ÃÂÃÂÃÂ­ÃÂÃÂÃÂ¬ÃÂÃÂ ÃÂ¬ÃÂÃÂ ÃÂ­ÃÂÃÂÃÂ­ÃÂÃÂÃÂ«ÃÂ©ÃÂ´ ÃÂ¬ÃÂÃÂÃÂ­ÃÂÃÂ¥ÃÂ«ÃÂ°ÃÂÃÂ«ÃÂÃÂ ÃÂ­ÃÂÃÂÃÂ«ÃÂ©ÃÂ´ ÃÂ«ÃÂªÃÂ©ÃÂ«ÃÂ¡ÃÂÃÂ¬ÃÂÃÂ´ ÃÂ­ÃÂÃÂÃÂ¬ÃÂÃÂÃÂ«ÃÂÃÂ©ÃÂ«ÃÂÃÂÃÂ«ÃÂÃÂ¤</div>'; return; }
  const rows = (window._mapData||[]).filter(r=>r["ÃÂ¬ÃÂÃÂÃÂ­ÃÂÃÂÃÂ«ÃÂªÃÂ"]===product);
  if (!rows.length) { el.innerHTML='<div style="padding:32px;text-align:center;color:#888">ÃÂ­ÃÂÃÂ´ÃÂ«ÃÂÃÂ¹ ÃÂ¬ÃÂÃÂÃÂ­ÃÂÃÂÃÂ¬ÃÂÃÂ ÃÂ¬ÃÂÃÂÃÂ­ÃÂÃÂ¥ ÃÂ­ÃÂÃÂÃÂ«ÃÂ©ÃÂ´ÃÂ¬ÃÂÃÂ´ ÃÂ¬ÃÂÃÂÃÂ¬ÃÂÃÂµÃÂ«ÃÂÃÂÃÂ«ÃÂÃÂ¤</div>'; return; }
  const tbody = rows.map(r=>
    "<tr>"
    + "<td><code style=\"font-size:12px\">"+r["ÃÂ­ÃÂÃÂÃÂ¬ÃÂÃÂ´ÃÂ¬ÃÂ§ÃÂID"]+"</code></td>"
    + "<td>"+_chBadge(r["ÃÂ¬ÃÂ±ÃÂÃÂ«ÃÂÃÂ"])+"</td>"
    + "<td style=\"font-size:12px\">"+r["ÃÂ¬ÃÂÃÂ¬ÃÂ¬ÃÂÃÂ´ÃÂ­ÃÂÃÂ¸"]+"</td>"
    + "<td style=\"font-weight:500\">"+r["ÃÂ­ÃÂÃÂÃÂ¬ÃÂÃÂ´ÃÂ¬ÃÂ§ÃÂÃÂ«ÃÂªÃÂ"]+"</td>"
    + "<td style=\"font-size:12px;color:#555\">"+r["ÃÂ«ÃÂÃÂ¸ÃÂ¬ÃÂ¶ÃÂÃÂ¬ÃÂÃÂÃÂ¬ÃÂ¹ÃÂ"]+"</td>"
    + "</tr>"
  ).join("");
  el.innerHTML =
    '<div style="padding:6px 0;font-size:13px">'
    + '<strong style="color:#1a6cbf">'+product+'</strong> ÃÂ¬ÃÂÃÂÃÂ­ÃÂÃÂÃÂ¬ÃÂÃÂ´ ÃÂ«ÃÂÃÂ¸ÃÂ¬ÃÂ¶ÃÂÃÂ«ÃÂÃÂÃÂ«ÃÂÃÂ ÃÂ­ÃÂÃÂÃÂ«ÃÂ©ÃÂ´ '
    + '<span style="background:#1a6cbf;color:#fff;border-radius:10px;padding:1px 8px;font-size:12px">'+rows.length+'ÃÂªÃÂ°ÃÂ</span>'
    + '</div>'
    + '<div class="tbl-wrap"><table>'
    + '<thead><tr><th>ÃÂ­ÃÂÃÂÃÂ¬ÃÂÃÂ´ÃÂ¬ÃÂ§ÃÂID</th><th>ÃÂ¬ÃÂ±ÃÂÃÂ«ÃÂÃÂ</th><th>ÃÂ¬ÃÂÃÂ¬ÃÂ¬ÃÂÃÂ´ÃÂ­ÃÂÃÂ¸</th><th>ÃÂ­ÃÂÃÂÃÂ¬ÃÂÃÂ´ÃÂ¬ÃÂ§ÃÂÃÂ«ÃÂªÃÂ</th><th>ÃÂ«ÃÂÃÂ¸ÃÂ¬ÃÂ¶ÃÂÃÂ¬ÃÂÃÂÃÂ¬ÃÂ¹ÃÂ</th></tr></thead>'
    + '<tbody>'+tbody+'</tbody></table></div>';
}

// Ã¢ÂÂÃ¢ÂÂ Ã¬ÂºÂÃ¬ÂÂ Ã¬ÂÂ°Ã­ÂÂÃ¬ÂÂ© nav Ã¬ÂÂ´Ã«Â²Â¤Ã­ÂÂ¸ Ã¬Â§ÂÃ¬Â Â Ã«Â°ÂÃ¬ÂÂ¸Ã«ÂÂ© Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
(function() {
  function _bindImpactNav() {
    const nav = document.getElementById("nav-impact");
    if (!nav) { setTimeout(_bindImpactNav, 300); return; }
    // onclick Ã¬ÂÂÃ¬ÂÂ± Ã¬Â ÂÃªÂ±Â° Ã­ÂÂ addEventListenerÃ«Â¡Â ÃªÂµÂÃ¬Â²Â´
    nav.removeAttribute("onclick");
    nav.addEventListener("click", function(e) {
      e.stopImmediatePropagation();
      // Ã«ÂÂ¤Ã«Â¥Â¸ nav Ã­ÂÂÃ¬ÂÂ±Ã­ÂÂ Ã¬Â²ÂÃ«Â¦Â¬ (ÃªÂ¸Â°Ã¬Â¡Â´ showPage Ã¬ÂÂ¼Ã«Â¶Â Ã¬ÂÂ¬Ã­ÂÂ)
      document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
      nav.classList.add("active");
      document.getElementById("topbar-title").textContent = "Ã¬ÂÂÃ­ÂÂ¥Ã«ÂÂÃªÂ´ÂÃ«Â¦Â¬";
      renderImpact();
    }, true);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", _bindImpactNav);
  } else {
    _bindImpactNav();
  }
})();