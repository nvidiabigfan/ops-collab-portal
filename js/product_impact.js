/* product_impact.js — 상품명 기준 영향 화면 조회 모듈
 * renderImpact() 를 오버라이드하여 탭 UI를 주입한다.
 * 탭1: 영향페이지 조회 (기존 renderPgTable 재사용)
 * 탭2: 상품영향 조회 (상품화면매핑 시트 기반)
 */

const PI_SHEET_ID = '12ZpwaDPNCV1V48xUtuWv2cooGtAjBZLIbClu3R88HoU';

// 상품화면매핑 CSV fetch
async function fetchProductMapping() {
  const url = 'https://docs.google.com/spreadsheets/d/' + PI_SHEET_ID
            + '/gviz/tq?tqx=out:csv&sheet=' + encodeURIComponent('상품화면매핑');
  const resp = await fetch(url);
  const csv  = await resp.text();
  const lines = csv.trim().split('\n');
  const headers = lines[0].replace(/"/g,'').split(',');
  return lines.slice(1).map(line => {
    const vals = [];
    let cur = '', inQ = false;
    for (const ch of line + ',') {
      if (ch === '"') { inQ = !inQ; }
      else if (ch === ',' && !inQ) { vals.push(cur); cur = ''; }
      else cur += ch;
    }
    const obj = {};
    headers.forEach((h,i) => { obj[h] = (vals[i]||'').trim(); });
    return obj;
  });
}

// 채널 뱃지 HTML
function _chBadge(ch) {
  return ch === '대표홈페이지'
    ? '<span style="background:#e3f0ff;color:#1a6cbf;padding:1px 7px;border-radius:4px;font-size:11px;font-weight:600">대표홈</span>'
    : '<span style="background:#e8f5e9;color:#2e7d32;padding:1px 7px;border-radius:4px;font-size:11px;font-weight:600">다이렉트</span>';
}

// 결과 테이블 HTML 생성
function _buildResultTable(rows, product) {
  const filtered = rows.filter(r => r['상품명'] === product);
  if (!filtered.length) return '<div style="padding:32px;text-align:center;color:#888">해당 상품의 영향 화면이 없습니다</div>';
  const tbody = filtered.map(r =>
    '<tr>'
    + '<td><code style="font-size:12px">' + r['페이지ID'] + '</code></td>'
    + '<td>' + _chBadge(r['채널']) + '</td>'
    + '<td style="font-size:12px">' + r['사이트'] + '</td>'
    + '<td style="font-weight:500">' + r['페이지명'] + '</td>'
    + '<td style="font-size:12px;color:#555">' + r['노출위치'] + '</td>'
    + '</tr>'
  ).join('');
  return '<div style="padding:8px 0 6px;font-size:13px">'
       + '<strong style="color:#1a6cbf">' + product + '</strong>'
       + ' 상품이 노출되는 화면 '
       + '<span style="background:#1a6cbf;color:#fff;border-radius:10px;padding:1px 8px;font-size:12px">' + filtered.length + '개</span>'
       + '</div>'
       + '<div class="tbl-wrap">'
       + '<table><thead><tr>'
       + '<th>페이지ID</th><th>채널</th><th>사이트</th><th>페이지명</th><th>노출위치</th>'
       + '</tr></thead><tbody>' + tbody + '</tbody></table></div>';
}

// 탭 버튼 스타일
function _tabStyle(active) {
  return active
    ? 'padding:8px 22px;border:none;background:#1a6cbf;color:#fff;cursor:pointer;font-size:14px;font-weight:600;border-radius:6px 6px 0 0;margin-right:4px'
    : 'padding:8px 22px;border:none;background:#f0f4fa;color:#666;cursor:pointer;font-size:14px;font-weight:600;border-radius:6px 6px 0 0;margin-right:4px';
}

// ── renderImpact 오버라이드 ──────────────────────────────────
const _origRenderImpact = window.renderImpact;

window.renderImpact = async function() {
  setContent(
    '<div style="display:flex;border-bottom:2px solid #e0e7ef;margin-bottom:16px">'
    + '<button id="tab-pg"  onclick="switchImpactTab(\'page\')"    style="' + _tabStyle(true)  + '">📋 영향페이지 조회</button>'
    + '<button id="tab-prd" onclick="switchImpactTab(\'product\')" style="' + _tabStyle(false) + '">🔍 상품영향 조회</button>'
    + '</div>'
    + '<div id="impact-tab-body"><div class="loading">⏳ 로딩 중...</div></div>'
  );
  setActions('<button class="btn btn-primary" onclick="openPgModal()">+ 페이지 등록</button>');
  window._impactTab = 'page';
  await _loadPgTab();
};

// ── 탭 전환 ─────────────────────────────────────────────────
window.switchImpactTab = async function(tab) {
  window._impactTab = tab;
  const pgBtn  = document.getElementById('tab-pg');
  const prdBtn = document.getElementById('tab-prd');
  if (!pgBtn || !prdBtn) return;
  pgBtn.style.cssText  = _tabStyle(tab === 'page');
  prdBtn.style.cssText = _tabStyle(tab === 'product');
  if (tab === 'page')    await _loadPgTab();
  else                   await _loadPrdTab();
};

// ── 탭1: 영향페이지 (기존 로직 재현) ───────────────────────
async function _loadPgTab() {
  const body = document.getElementById('impact-tab-body');
  if (!body) return;
  body.innerHTML = '<div class="loading">⏳ 로딩 중...</div>';
  try {
    const rows = await SheetsAPI.readSheet('영향페이지');
    window._pgData = rows;
    const sites = [...new Set(rows.map(r => r['사이트']).filter(Boolean))];
    const siteOpts = sites.map(s => '<option value="' + s + '">' + s + '</option>').join('');
    body.innerHTML =
      '<div class="card" style="margin-bottom:0">'
      + '<div class="filter-bar">'
      + '<input id="pg-q" placeholder="🔍 페이지명, 담당자, 화면ID 검색" oninput="renderPgTable()" value="">'
      + '<select id="pg-site-f" onchange="renderPgTable()"><option value="">전체 사이트</option>' + siteOpts + '</select>'
      + '<span class="filter-count" id="pg-count">0건</span>'
      + '</div>'
      + '<div class="tbl-wrap" id="pg-tbl-wrap"></div>'
      + '</div>';
    renderPgTable();
  } catch(e) {
    body.innerHTML = '<div style="padding:24px;color:red">영향페이지 로드 실패: ' + e.message + '</div>';
  }
}

// ── 탭2: 상품영향 조회 ───────────────────────────────────────
async function _loadPrdTab() {
  const body = document.getElementById('impact-tab-body');
  if (!body) return;
  body.innerHTML = '<div class="loading">⏳ 상품화면 매핑 로딩 중...</div>';
  try {
    const rows = await fetchProductMapping();
    window._mappingData = rows;
    const products = [...new Set(rows.map(r => r['상품명']))].filter(Boolean).sort((a,b) => a.localeCompare(b,'ko'));
    const opts = products.map(p => '<option value="' + p + '">' + p + '</option>').join('');
    body.innerHTML =
      '<div class="card" style="margin-bottom:12px">'
      + '<div class="filter-bar">'
      + '<label style="font-size:13px;font-weight:600;color:#333;white-space:nowrap">상품 선택</label>'
      + '<select id="prd-select" onchange="onPrdSelect()" style="min-width:260px;font-size:14px;padding:5px 8px">'
      + '<option value="">-- 상품을 선택하세요 --</option>' + opts
      + '</select>'
      + '<input id="prd-search" placeholder="🔍 직접 입력" oninput="onPrdSearch()"'
      + ' style="min-width:180px;font-size:14px;padding:5px 8px;border:1px solid #cdd;border-radius:5px">'
      + '</div></div>'
      + '<div id="prd-result">'
      + '<div style="padding:40px;text-align:center;color:#aaa;font-size:14px">상품을 선택하면 영향받는 화면 목록이 표시됩니다</div>'
      + '</div>';
  } catch(e) {
    body.innerHTML = '<div style="padding:24px;color:red">매핑 시트 로드 실패: ' + e.message + '</div>';
  }
}

// ── 상품 선택 이벤트 ─────────────────────────────────────────
window.onPrdSelect = function() {
  const val = (document.getElementById('prd-select') || {}).value || '';
  const inp = document.getElementById('prd-search');
  if (inp) inp.value = val;
  _showPrdResult(val);
};

window.onPrdSearch = function() {
  const val = ((document.getElementById('prd-search') || {}).value || '').trim();
  const sel = document.getElementById('prd-select');
  if (sel) { const o = [...sel.options].find(o => o.value === val); if(o) sel.value = val; }
  _showPrdResult(val);
};

function _showPrdResult(product) {
  const el = document.getElementById('prd-result');
  if (!el) return;
  if (!product) {
    el.innerHTML = '<div style="padding:40px;text-align:center;color:#aaa;font-size:14px">상품을 선택하면 영향받는 화면 목록이 표시됩니다</div>';
    return;
  }
  el.innerHTML = _buildResultTable(window._mappingData || [], product);
}