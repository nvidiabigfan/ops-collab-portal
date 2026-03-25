/* product_impact.js v2 â gviz ê¸°ë°, SheetsAPI ìì¡´ ìì */

const _PI_SID = "12ZpwaDPNCV1V48xUtuWv2cooGtAjBZLIbClu3R88HoU";

// gviz CSV fetch â ê°ì²´ ë°°ì´ (íììì ìì)
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

// ì±ë ë±ì§
function _chBadge(ch) {
  return ch === "ëíííì´ì§"
    ? '<span style="background:#e3f0ff;color:#1a6cbf;padding:1px 7px;border-radius:4px;font-size:11px;font-weight:600">ëíí</span>'
    : '<span style="background:#e8f5e9;color:#2e7d32;padding:1px 7px;border-radius:4px;font-size:11px;font-weight:600">ë¤ì´ë í¸</span>';
}

// í­ ë²í¼ ì¤íì¼
function _tStyle(on) {
  return on
    ? "padding:8px 22px;border:none;background:#1a6cbf;color:#fff;cursor:pointer;font-size:14px;font-weight:600;border-radius:6px 6px 0 0;margin-right:4px"
    : "padding:8px 22px;border:none;background:#f0f4fa;color:#555;cursor:pointer;font-size:14px;border-radius:6px 6px 0 0;margin-right:4px";
}

// ââ renderImpact ì¤ë²ë¼ì´ë âââââââââââââââââââââââââââââââââ
window.renderImpact = async function() {
  setContent(
    '<div style="display:flex;border-bottom:2px solid #e0e7ef;margin-bottom:16px">'
    + '<button id="tab-pg"  onclick="switchImpactTab(\'page\')"    style="' + _tStyle(true)  + '">ð ìí¥íì´ì§ ì¡°í</button>'
    + '<button id="tab-prd" onclick="switchImpactTab(\'product\')" style="' + _tStyle(false) + '">ð ìíìí¥ ì¡°í</button>'
    + '</div>'
    + '<div id="pi-body"><div class="loading">â³ ë¡ë© ì¤...</div></div>'
  );
  setActions('<button class="btn btn-primary" onclick="openPgModal()">+ íì´ì§ ë±ë¡</button>');
  switchImpactTab("page");
};

// ââ í­ ì í ââââââââââââââââââââââââââââââââââââââââââââââââ
window.switchImpactTab = function(tab) {
  const pg  = document.getElementById("tab-pg");
  const prd = document.getElementById("tab-prd");
  if (pg)  pg.style.cssText  = _tStyle(tab === "page");
  if (prd) prd.style.cssText = _tStyle(tab === "product");
  if (tab === "page") _loadPgTab();
  else                _loadPrdTab();
};

// ââ í­1: ìí¥íì´ì§ (gviz) ââââââââââââââââââââââââââââââââââ
async function _loadPgTab() {
  const body = document.getElementById("pi-body");
  if (!body) return;
  body.innerHTML = '<div class="loading">â³ ìí¥íì´ì§ ë¡ë© ì¤...</div>';
  try {
    const rows = await _gvizFetch("ìí¥íì´ì§");
    window._pgData = rows;
    const sites = [...new Set(rows.map(r=>r["ì¬ì´í¸"]).filter(Boolean))];
    const sOpts = sites.map(s=>'<option value="'+s+'">'+s+'</option>').join("");
    body.innerHTML =
      '<div class="card" style="margin-bottom:0">'
      + '<div class="filter-bar">'
      + '<input id="pg-q" placeholder="ð íì´ì§ëª, ë´ë¹ì, íë©´ID ê²ì" oninput="renderPgTable()" value="">'
      + '<select id="pg-site-f" onchange="renderPgTable()"><option value="">ì ì²´ ì¬ì´í¸</option>'+sOpts+'</select>'
      + '<span class="filter-count" id="pg-count">0ê±´</span>'
      + '</div><div class="tbl-wrap" id="pg-tbl-wrap"></div></div>';
    renderPgTable();
  } catch(e) {
    body.innerHTML = '<div style="padding:24px;color:red">ë¡ë ì¤í¨: ' + e.message + '</div>';
  }
}

// ââ í­2: ìíìí¥ ì¡°í âââââââââââââââââââââââââââââââââââââ
async function _loadPrdTab() {
  const body = document.getElementById("pi-body");
  if (!body) return;
  body.innerHTML = '<div class="loading">â³ ìííë©´ ë§¤í ë¡ë© ì¤...</div>';
  try {
    const rows = await _gvizFetch("ìííë©´ë§¤í");
    window._mapData = rows;
    const prds = [...new Set(rows.map(r=>r["ìíëª"]))].filter(Boolean).sort((a,b)=>a.localeCompare(b,"ko"));
    const opts = prds.map(p=>'<option value="'+p+'">'+p+'</option>').join("");
    body.innerHTML =
      '<div class="card" style="margin-bottom:12px">'
      + '<div class="filter-bar">'
      + '<label style="font-size:13px;font-weight:600;white-space:nowrap">ìí ì í</label>'
      + '<select id="prd-sel" onchange="onPrdSel()" style="min-width:260px;font-size:14px;padding:5px 8px">'
      + '<option value="">-- ìíì ì ííì¸ì --</option>'+opts+'</select>'
      + '<input id="prd-inp" placeholder="ð ì§ì  ìë ¥" oninput="onPrdInp()" style="min-width:180px;font-size:14px;padding:5px 8px;border:1px solid #ccc;border-radius:5px">'
      + '</div></div>'
      + '<div id="prd-result"><div style="padding:40px;text-align:center;color:#aaa">ìíì ì ííë©´ ìí¥ë°ë íë©´ ëª©ë¡ì´ íìë©ëë¤</div></div>';
  } catch(e) {
    body.innerHTML = '<div style="padding:24px;color:red">ë¡ë ì¤í¨: ' + e.message + '</div>';
  }
}

// ââ ìí ì í ì´ë²¤í¸ âââââââââââââââââââââââââââââââââââââââ
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
  if (!product) { el.innerHTML='<div style="padding:40px;text-align:center;color:#aaa">ìíì ì ííë©´ ìí¥ë°ë íë©´ ëª©ë¡ì´ íìë©ëë¤</div>'; return; }
  const rows = (window._mapData||[]).filter(r=>r["ìíëª"]===product);
  if (!rows.length) { el.innerHTML='<div style="padding:32px;text-align:center;color:#888">í´ë¹ ìíì ìí¥ íë©´ì´ ììµëë¤</div>'; return; }
  const tbody = rows.map(r=>
    "<tr>"
    + "<td><code style=\"font-size:12px\">"+r["íì´ì§ID"]+"</code></td>"
    + "<td>"+_chBadge(r["ì±ë"])+"</td>"
    + "<td style=\"font-size:12px\">"+r["ì¬ì´í¸"]+"</td>"
    + "<td style=\"font-weight:500\">"+r["íì´ì§ëª"]+"</td>"
    + "<td style=\"font-size:12px;color:#555\">"+r["ë¸ì¶ìì¹"]+"</td>"
    + "</tr>"
  ).join("");
  el.innerHTML =
    '<div style="padding:6px 0;font-size:13px">'
    + '<strong style="color:#1a6cbf">'+product+'</strong> ìíì´ ë¸ì¶ëë íë©´ '
    + '<span style="background:#1a6cbf;color:#fff;border-radius:10px;padding:1px 8px;font-size:12px">'+rows.length+'ê°</span>'
    + '</div>'
    + '<div class="tbl-wrap"><table>'
    + '<thead><tr><th>íì´ì§ID</th><th>ì±ë</th><th>ì¬ì´í¸</th><th>íì´ì§ëª</th><th>ë¸ì¶ìì¹</th></tr></thead>'
    + '<tbody>'+tbody+'</tbody></table></div>';
}

// ── 캐시 우회용 nav 이벤트 직접 바인딩 ─────────────────────
(function() {
  function _bindImpactNav() {
    const nav = document.getElementById("nav-impact");
    if (!nav) { setTimeout(_bindImpactNav, 300); return; }
    // onclick 속성 제거 후 addEventListener로 교체
    nav.removeAttribute("onclick");
    nav.addEventListener("click", function(e) {
      e.stopImmediatePropagation();
      // 다른 nav 활성화 처리 (기존 showPage 일부 재현)
      document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
      nav.classList.add("active");
      document.getElementById("topbar-title").textContent = "영향도관리";
      renderImpact();
    }, true);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", _bindImpactNav);
  } else {
    _bindImpactNav();
  }
})();