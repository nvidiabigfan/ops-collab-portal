/* product_impact.js v2 — gviz 기반, SheetsAPI 의존 없음 */

const _PI_SID = "12ZpwaDPNCV1V48xUtuWv2cooGtAjBZLIbClu3R88HoU";

// gviz CSV fetch → 객체 배열 (타임아웃 없음)
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

// 채널 뱃지
function _chBadge(ch) {
  return ch === "대표홈페이지"
    ? '<span style="background:#e3f0ff;color:#1a6cbf;padding:1px 7px;border-radius:4px;font-size:11px;font-weight:600">대표홈</span>'
    : '<span style="background:#e8f5e9;color:#2e7d32;padding:1px 7px;border-radius:4px;font-size:11px;font-weight:600">다이렉트</span>';
}

// 탭 버튼 스타일
function _tStyle(on) {
  return on
    ? "padding:8px 22px;border:none;background:#1a6cbf;color:#fff;cursor:pointer;font-size:14px;font-weight:600;border-radius:6px 6px 0 0;margin-right:4px"
    : "padding:8px 22px;border:none;background:#f0f4fa;color:#555;cursor:pointer;font-size:14px;border-radius:6px 6px 0 0;margin-right:4px";
}

// ── renderImpact 오버라이드 ─────────────────────────────────
window.renderImpact = async function() {
  setContent(
    '<div style="display:flex;border-bottom:2px solid #e0e7ef;margin-bottom:16px">'
    + '<button id="tab-pg"  onclick="switchImpactTab(\'page\')"    style="' + _tStyle(true)  + '">📋 영향페이지 조회</button>'
    + '<button id="tab-prd" onclick="switchImpactTab(\'product\')" style="' + _tStyle(false) + '">🔍 상품영향 조회</button>'
    + '</div>'
    + '<div id="pi-body"><div class="loading">⏳ 로딩 중...</div></div>'
  );
  setActions('<button class="btn btn-primary" onclick="openPgModal()">+ 페이지 등록</button>');
  switchImpactTab("page");
};

// ── 탭 전환 ────────────────────────────────────────────────
window.switchImpactTab = function(tab) {
  const pg  = document.getElementById("tab-pg");
  const prd = document.getElementById("tab-prd");
  if (pg)  pg.style.cssText  = _tStyle(tab === "page");
  if (prd) prd.style.cssText = _tStyle(tab === "product");
  if (tab === "page") _loadPgTab();
  else                _loadPrdTab();
};

// ── 탭1: 영향페이지 (gviz) ──────────────────────────────────
async function _loadPgTab() {
  const body = document.getElementById("pi-body");
  if (!body) return;
  body.innerHTML = '<div class="loading">⏳ 영향페이지 로딩 중...</div>';
  try {
    const rows = await _gvizFetch("영향페이지");
    window._pgData = rows;
    const sites = [...new Set(rows.map(r=>r["사이트"]).filter(Boolean))];
    const sOpts = sites.map(s=>'<option value="'+s+'">'+s+'</option>').join("");
    body.innerHTML =
      '<div class="card" style="margin-bottom:0">'
      + '<div class="filter-bar">'
      + '<input id="pg-q" placeholder="🔍 페이지명, 담당자, 화면ID 검색" oninput="renderPgTable()" value="">'
      + '<select id="pg-site-f" onchange="renderPgTable()"><option value="">전체 사이트</option>'+sOpts+'</select>'
      + '<span class="filter-count" id="pg-count">0건</span>'
      + '</div><div class="tbl-wrap" id="pg-tbl-wrap"></div></div>';
    renderPgTable();
  } catch(e) {
    body.innerHTML = '<div style="padding:24px;color:red">로드 실패: ' + e.message + '</div>';
  }
}

// ── 탭2: 상품영향 조회 ─────────────────────────────────────
async function _loadPrdTab() {
  const body = document.getElementById("pi-body");
  if (!body) return;
  body.innerHTML = '<div class="loading">⏳ 상품화면 매핑 로딩 중...</div>';
  try {
    const rows = await _gvizFetch("상품화면매핑");
    window._mapData = rows;
    const prds = [...new Set(rows.map(r=>r["상품명"]))].filter(Boolean).sort((a,b)=>a.localeCompare(b,"ko"));
    const opts = prds.map(p=>'<option value="'+p+'">'+p+'</option>').join("");
    body.innerHTML =
      '<div class="card" style="margin-bottom:12px">'
      + '<div class="filter-bar">'
      + '<label style="font-size:13px;font-weight:600;white-space:nowrap">상품 선택</label>'
      + '<select id="prd-sel" onchange="onPrdSel()" style="min-width:260px;font-size:14px;padding:5px 8px">'
      + '<option value="">-- 상품을 선택하세요 --</option>'+opts+'</select>'
      + '<input id="prd-inp" placeholder="🔍 직접 입력" oninput="onPrdInp()" style="min-width:180px;font-size:14px;padding:5px 8px;border:1px solid #ccc;border-radius:5px">'
      + '</div></div>'
      + '<div id="prd-result"><div style="padding:40px;text-align:center;color:#aaa">상품을 선택하면 영향받는 화면 목록이 표시됩니다</div></div>';
  } catch(e) {
    body.innerHTML = '<div style="padding:24px;color:red">로드 실패: ' + e.message + '</div>';
  }
}

// ── 상품 선택 이벤트 ───────────────────────────────────────
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
  if (!product) { el.innerHTML='<div style="padding:40px;text-align:center;color:#aaa">상품을 선택하면 영향받는 화면 목록이 표시됩니다</div>'; return; }
  const rows = (window._mapData||[]).filter(r=>r["상품명"]===product);
  if (!rows.length) { el.innerHTML='<div style="padding:32px;text-align:center;color:#888">해당 상품의 영향 화면이 없습니다</div>'; return; }
  const tbody = rows.map(r=>
    "<tr>"
    + "<td><code style=\"font-size:12px\">"+r["페이지ID"]+"</code></td>"
    + "<td>"+_chBadge(r["채널"])+"</td>"
    + "<td style=\"font-size:12px\">"+r["사이트"]+"</td>"
    + "<td style=\"font-weight:500\">"+r["페이지명"]+"</td>"
    + "<td style=\"font-size:12px;color:#555\">"+r["노출위치"]+"</td>"
    + "</tr>"
  ).join("");
  el.innerHTML =
    '<div style="padding:6px 0;font-size:13px">'
    + '<strong style="color:#1a6cbf">'+product+'</strong> 상품이 노출되는 화면 '
    + '<span style="background:#1a6cbf;color:#fff;border-radius:10px;padding:1px 8px;font-size:12px">'+rows.length+'개</span>'
    + '</div>'
    + '<div class="tbl-wrap"><table>'
    + '<thead><tr><th>페이지ID</th><th>채널</th><th>사이트</th><th>페이지명</th><th>노출위치</th></tr></thead>'
    + '<tbody>'+tbody+'</tbody></table></div>';
}