// ── 원본 renderImpact 즉시 무력화 (캐시된 index.html 대응) ──────
(function() {
  // index.html의 원본 renderImpact 본체를 noop으로 교체
  // product_impact.js 하단의 window.renderImpact = ... 가 이후 재정의함
  if (typeof window.renderImpact === "function"
      && window.renderImpact.toString().indexOf("replaced by product_impact") === -1
      && window.renderImpact.toString().indexOf("switchImpactTab") === -1) {
    window.renderImpact = async function() {};
  }
  // showPage 패치 — impact 케이스에서 우리 renderImpact 호출 보장
  if (typeof window.showPage === "function") {
    const _orig = window.showPage;
    window.showPage = function(page) {
      _orig(page);
      if (page === "impact") renderImpact();
    };
  }
})();
/* product_impact.js v2 Ã¢ÂÂ gviz ÃªÂ¸Â°Ã«Â°Â, SheetsAPI Ã¬ÂÂÃ¬Â¡Â´ Ã¬ÂÂÃ¬ÂÂ */

const _PI_SID = "12ZpwaDPNCV1V48xUtuWv2cooGtAjBZLIbClu3R88HoU";

// gviz CSV fetch Ã¢ÂÂ ÃªÂ°ÂÃ¬Â²Â´ Ã«Â°Â°Ã¬ÂÂ´ (Ã­ÂÂÃ¬ÂÂÃ¬ÂÂÃ¬ÂÂ Ã¬ÂÂÃ¬ÂÂ)
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

// Ã¬Â±ÂÃ«ÂÂ Ã«Â±ÂÃ¬Â§Â
function _chBadge(ch) {
  return ch === "Ã«ÂÂÃ­ÂÂÃ­ÂÂÃ­ÂÂÃ¬ÂÂ´Ã¬Â§Â"
    ? '<span style="background:#e3f0ff;color:#1a6cbf;padding:1px 7px;border-radius:4px;font-size:11px;font-weight:600">Ã«ÂÂÃ­ÂÂÃ­ÂÂ</span>'
    : '<span style="background:#e8f5e9;color:#2e7d32;padding:1px 7px;border-radius:4px;font-size:11px;font-weight:600">Ã«ÂÂ¤Ã¬ÂÂ´Ã«Â ÂÃ­ÂÂ¸</span>';
}

// Ã­ÂÂ­ Ã«Â²ÂÃ­ÂÂ¼ Ã¬ÂÂ¤Ã­ÂÂÃ¬ÂÂ¼
function _tStyle(on) {
  return on
    ? "padding:8px 22px;border:none;background:#1a6cbf;color:#fff;cursor:pointer;font-size:14px;font-weight:600;border-radius:6px 6px 0 0;margin-right:4px"
    : "padding:8px 22px;border:none;background:#f0f4fa;color:#555;cursor:pointer;font-size:14px;border-radius:6px 6px 0 0;margin-right:4px";
}

// Ã¢ÂÂÃ¢ÂÂ renderImpact Ã¬ÂÂ¤Ã«Â²ÂÃ«ÂÂ¼Ã¬ÂÂ´Ã«ÂÂ Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
window.renderImpact = async function() {
  setContent(
    '<div style="display:flex;border-bottom:2px solid #e0e7ef;margin-bottom:16px">'
    + '<button id="tab-pg"  onclick="switchImpactTab(\'page\')"    style="' + _tStyle(true)  + '">Ã°ÂÂÂ Ã¬ÂÂÃ­ÂÂ¥Ã­ÂÂÃ¬ÂÂ´Ã¬Â§Â Ã¬Â¡Â°Ã­ÂÂ</button>'
    + '<button id="tab-prd" onclick="switchImpactTab(\'product\')" style="' + _tStyle(false) + '">Ã°ÂÂÂ Ã¬ÂÂÃ­ÂÂÃ¬ÂÂÃ­ÂÂ¥ Ã¬Â¡Â°Ã­ÂÂ</button>'
    + '</div>'
    + '<div id="pi-body"><div class="loading">Ã¢ÂÂ³ Ã«Â¡ÂÃ«ÂÂ© Ã¬Â¤Â...</div></div>'
  );
  setActions('<button class="btn btn-primary" onclick="openPgModal()">+ Ã­ÂÂÃ¬ÂÂ´Ã¬Â§Â Ã«ÂÂ±Ã«Â¡Â</button>');
  switchImpactTab("page");
};

// Ã¢ÂÂÃ¢ÂÂ Ã­ÂÂ­ Ã¬Â ÂÃ­ÂÂ Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
window.switchImpactTab = function(tab) {
  const pg  = document.getElementById("tab-pg");
  const prd = document.getElementById("tab-prd");
  if (pg)  pg.style.cssText  = _tStyle(tab === "page");
  if (prd) prd.style.cssText = _tStyle(tab === "product");
  if (tab === "page") _loadPgTab();
  else                _loadPrdTab();
};

// Ã¢ÂÂÃ¢ÂÂ Ã­ÂÂ­1: Ã¬ÂÂÃ­ÂÂ¥Ã­ÂÂÃ¬ÂÂ´Ã¬Â§Â (gviz) Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
async function _loadPgTab() {
  const body = document.getElementById("pi-body");
  if (!body) return;
  body.innerHTML = '<div class="loading">Ã¢ÂÂ³ Ã¬ÂÂÃ­ÂÂ¥Ã­ÂÂÃ¬ÂÂ´Ã¬Â§Â Ã«Â¡ÂÃ«ÂÂ© Ã¬Â¤Â...</div>';
  try {
    const rows = await _gvizFetch("Ã¬ÂÂÃ­ÂÂ¥Ã­ÂÂÃ¬ÂÂ´Ã¬Â§Â");
    window._pgData = rows;
    const sites = [...new Set(rows.map(r=>r["Ã¬ÂÂ¬Ã¬ÂÂ´Ã­ÂÂ¸"]).filter(Boolean))];
    const sOpts = sites.map(s=>'<option value="'+s+'">'+s+'</option>').join("");
    body.innerHTML =
      '<div class="card" style="margin-bottom:0">'
      + '<div class="filter-bar">'
      + '<input id="pg-q" placeholder="Ã°ÂÂÂ Ã­ÂÂÃ¬ÂÂ´Ã¬Â§ÂÃ«ÂªÂ, Ã«ÂÂ´Ã«ÂÂ¹Ã¬ÂÂ, Ã­ÂÂÃ«Â©Â´ID ÃªÂ²ÂÃ¬ÂÂ" oninput="renderPgTable()" value="">'
      + '<select id="pg-site-f" onchange="renderPgTable()"><option value="">Ã¬Â ÂÃ¬Â²Â´ Ã¬ÂÂ¬Ã¬ÂÂ´Ã­ÂÂ¸</option>'+sOpts+'</select>'
      + '<span class="filter-count" id="pg-count">0ÃªÂ±Â´</span>'
      + '</div><div class="tbl-wrap" id="pg-tbl-wrap"></div></div>';
    renderPgTable();
  } catch(e) {
    body.innerHTML = '<div style="padding:24px;color:red">Ã«Â¡ÂÃ«ÂÂ Ã¬ÂÂ¤Ã­ÂÂ¨: ' + e.message + '</div>';
  }
}

// Ã¢ÂÂÃ¢ÂÂ Ã­ÂÂ­2: Ã¬ÂÂÃ­ÂÂÃ¬ÂÂÃ­ÂÂ¥ Ã¬Â¡Â°Ã­ÂÂ Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
async function _loadPrdTab() {
  const body = document.getElementById("pi-body");
  if (!body) return;
  body.innerHTML = '<div class="loading">Ã¢ÂÂ³ Ã¬ÂÂÃ­ÂÂÃ­ÂÂÃ«Â©Â´ Ã«Â§Â¤Ã­ÂÂ Ã«Â¡ÂÃ«ÂÂ© Ã¬Â¤Â...</div>';
  try {
    const rows = await _gvizFetch("Ã¬ÂÂÃ­ÂÂÃ­ÂÂÃ«Â©Â´Ã«Â§Â¤Ã­ÂÂ");
    window._mapData = rows;
    const prds = [...new Set(rows.map(r=>r["Ã¬ÂÂÃ­ÂÂÃ«ÂªÂ"]))].filter(Boolean).sort((a,b)=>a.localeCompare(b,"ko"));
    const opts = prds.map(p=>'<option value="'+p+'">'+p+'</option>').join("");
    body.innerHTML =
      '<div class="card" style="margin-bottom:12px">'
      + '<div class="filter-bar">'
      + '<label style="font-size:13px;font-weight:600;white-space:nowrap">Ã¬ÂÂÃ­ÂÂ Ã¬ÂÂ Ã­ÂÂ</label>'
      + '<select id="prd-sel" onchange="onPrdSel()" style="min-width:260px;font-size:14px;padding:5px 8px">'
      + '<option value="">-- Ã¬ÂÂÃ­ÂÂÃ¬ÂÂ Ã¬ÂÂ Ã­ÂÂÃ­ÂÂÃ¬ÂÂ¸Ã¬ÂÂ --</option>'+opts+'</select>'
      + '<input id="prd-inp" placeholder="Ã°ÂÂÂ Ã¬Â§ÂÃ¬Â Â Ã¬ÂÂÃ«Â Â¥" oninput="onPrdInp()" style="min-width:180px;font-size:14px;padding:5px 8px;border:1px solid #ccc;border-radius:5px">'
      + '</div></div>'
      + '<div id="prd-result"><div style="padding:40px;text-align:center;color:#aaa">Ã¬ÂÂÃ­ÂÂÃ¬ÂÂ Ã¬ÂÂ Ã­ÂÂÃ­ÂÂÃ«Â©Â´ Ã¬ÂÂÃ­ÂÂ¥Ã«Â°ÂÃ«ÂÂ Ã­ÂÂÃ«Â©Â´ Ã«ÂªÂ©Ã«Â¡ÂÃ¬ÂÂ´ Ã­ÂÂÃ¬ÂÂÃ«ÂÂ©Ã«ÂÂÃ«ÂÂ¤</div></div>';
  } catch(e) {
    body.innerHTML = '<div style="padding:24px;color:red">Ã«Â¡ÂÃ«ÂÂ Ã¬ÂÂ¤Ã­ÂÂ¨: ' + e.message + '</div>';
  }
}

// Ã¢ÂÂÃ¢ÂÂ Ã¬ÂÂÃ­ÂÂ Ã¬ÂÂ Ã­ÂÂ Ã¬ÂÂ´Ã«Â²Â¤Ã­ÂÂ¸ Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
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
  if (!product) { el.innerHTML='<div style="padding:40px;text-align:center;color:#aaa">Ã¬ÂÂÃ­ÂÂÃ¬ÂÂ Ã¬ÂÂ Ã­ÂÂÃ­ÂÂÃ«Â©Â´ Ã¬ÂÂÃ­ÂÂ¥Ã«Â°ÂÃ«ÂÂ Ã­ÂÂÃ«Â©Â´ Ã«ÂªÂ©Ã«Â¡ÂÃ¬ÂÂ´ Ã­ÂÂÃ¬ÂÂÃ«ÂÂ©Ã«ÂÂÃ«ÂÂ¤</div>'; return; }
  const rows = (window._mapData||[]).filter(r=>r["Ã¬ÂÂÃ­ÂÂÃ«ÂªÂ"]===product);
  if (!rows.length) { el.innerHTML='<div style="padding:32px;text-align:center;color:#888">Ã­ÂÂ´Ã«ÂÂ¹ Ã¬ÂÂÃ­ÂÂÃ¬ÂÂ Ã¬ÂÂÃ­ÂÂ¥ Ã­ÂÂÃ«Â©Â´Ã¬ÂÂ´ Ã¬ÂÂÃ¬ÂÂµÃ«ÂÂÃ«ÂÂ¤</div>'; return; }
  const tbody = rows.map(r=>
    "<tr>"
    + "<td><code style=\"font-size:12px\">"+r["Ã­ÂÂÃ¬ÂÂ´Ã¬Â§ÂID"]+"</code></td>"
    + "<td>"+_chBadge(r["Ã¬Â±ÂÃ«ÂÂ"])+"</td>"
    + "<td style=\"font-size:12px\">"+r["Ã¬ÂÂ¬Ã¬ÂÂ´Ã­ÂÂ¸"]+"</td>"
    + "<td style=\"font-weight:500\">"+r["Ã­ÂÂÃ¬ÂÂ´Ã¬Â§ÂÃ«ÂªÂ"]+"</td>"
    + "<td style=\"font-size:12px;color:#555\">"+r["Ã«ÂÂ¸Ã¬Â¶ÂÃ¬ÂÂÃ¬Â¹Â"]+"</td>"
    + "</tr>"
  ).join("");
  el.innerHTML =
    '<div style="padding:6px 0;font-size:13px">'
    + '<strong style="color:#1a6cbf">'+product+'</strong> Ã¬ÂÂÃ­ÂÂÃ¬ÂÂ´ Ã«ÂÂ¸Ã¬Â¶ÂÃ«ÂÂÃ«ÂÂ Ã­ÂÂÃ«Â©Â´ '
    + '<span style="background:#1a6cbf;color:#fff;border-radius:10px;padding:1px 8px;font-size:12px">'+rows.length+'ÃªÂ°Â</span>'
    + '</div>'
    + '<div class="tbl-wrap"><table>'
    + '<thead><tr><th>Ã­ÂÂÃ¬ÂÂ´Ã¬Â§ÂID</th><th>Ã¬Â±ÂÃ«ÂÂ</th><th>Ã¬ÂÂ¬Ã¬ÂÂ´Ã­ÂÂ¸</th><th>Ã­ÂÂÃ¬ÂÂ´Ã¬Â§ÂÃ«ÂªÂ</th><th>Ã«ÂÂ¸Ã¬Â¶ÂÃ¬ÂÂÃ¬Â¹Â</th></tr></thead>'
    + '<tbody>'+tbody+'</tbody></table></div>';
}

// ââ ìºì ì°íì© nav ì´ë²¤í¸ ì§ì  ë°ì¸ë© âââââââââââââââââââââ
(function() {
  function _bindImpactNav() {
    const nav = document.getElementById("nav-impact");
    if (!nav) { setTimeout(_bindImpactNav, 300); return; }
    // onclick ìì± ì ê±° í addEventListenerë¡ êµì²´
    nav.removeAttribute("onclick");
    nav.addEventListener("click", function(e) {
      e.stopImmediatePropagation();
      // ë¤ë¥¸ nav íì±í ì²ë¦¬ (ê¸°ì¡´ showPage ì¼ë¶ ì¬í)
      document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
      nav.classList.add("active");
      document.getElementById("topbar-title").textContent = "ìí¥ëê´ë¦¬";
      renderImpact();
    }, true);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", _bindImpactNav);
  } else {
    _bindImpactNav();
  }
})();