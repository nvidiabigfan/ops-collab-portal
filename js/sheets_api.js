/**
 * sheets_api.js — 운영협업포털 Google Sheets 연동 모듈
 */
const SheetsAPI = (() => {
  const cfg = () => window.PORTAL_CONFIG || {};
  const SHEET_GID = {
    일정: 0, 영향페이지: 741833915, 결함유형: 632503907, 운영링크: 1661644246, 이관항목: 694210402,
  };
  const ID_KEY = {
    일정: '일정ID', 영향페이지: '페이지ID', 결함유형: '결함ID', 이관항목: '이관ID',
  };

  async function readSheet(sheetName) {
    const gid = SHEET_GID[sheetName];
    if (gid === undefined) throw new Error('알 수 없는 시트: ' + sheetName);
    const sid = cfg().SPREADSHEET_ID;
    if (!sid) throw new Error('PORTAL_CONFIG.SPREADSHEET_ID 미설정');
    const url = 'https://docs.google.com/spreadsheets/d/' + sid + '/export?format=csv&gid=' + gid;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Sheets 읽기 실패: ' + res.status);
    return _csvToObjects(await res.text());
  }

  function _csvToObjects(csv) {
    const lines = csv.trim().split('\n').map(l => _parseCsvLine(l));
    if (lines.length < 2) return [];
    const headers = lines[0];
    return lines.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h.trim()] = (row[i] || '').trim(); });
      return obj;
    });
  }

  function _parseCsvLine(line) {
    const result = []; let cur = '', inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { if (inQuote && line[i+1]==='"') { cur+='"'; i++; } else inQuote=!inQuote; }
      else if (ch === ',' && !inQuote) { result.push(cur); cur=''; }
      else cur += ch;
    }
    result.push(cur); return result;
  }

  async function _dispatch(inputs) {
    const { GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN } = cfg();
    if (!GITHUB_TOKEN) return { ok: false, message: 'GITHUB_TOKEN 미설정' };
    const res = await fetch(
      'https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/actions/workflows/sheets-write.yml/dispatches',
      { method: 'POST',
        headers: { 'Authorization': 'Bearer ' + GITHUB_TOKEN, 'Accept': 'application/vnd.github+json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref: 'main', inputs }) }
    );
    if (res.status === 204) return { ok: true, message: '요청 완료' };
    const err = await res.json().catch(() => ({}));
    return { ok: false, message: err.message || 'HTTP ' + res.status };
  }

  function appendRow(sheetName, rowData) {
    return _dispatch({ sheet_name: sheetName, row_json: JSON.stringify(rowData), action: 'append', row_id_key: '', row_id_val: '' });
  }

  function updateRow(sheetName, rowData) {
    const idKey = ID_KEY[sheetName];
    if (!idKey) return Promise.resolve({ ok: false, message: 'updateRow: ' + sheetName + ' ID 컬럼 모름' });
    const idVal = rowData[idKey];
    if (!idVal) return Promise.resolve({ ok: false, message: 'updateRow: ID 값 없음 (' + idKey + ')' });
    return _dispatch({ sheet_name: sheetName, row_json: JSON.stringify(rowData), action: 'update', row_id_key: idKey, row_id_val: idVal });
  }

  function deleteRow(sheetName, idVal) {
    const idKey = ID_KEY[sheetName];
    if (!idKey) return Promise.resolve({ ok: false, message: 'deleteRow: ' + sheetName + ' ID 컬럼 모름' });
    if (!idVal) return Promise.resolve({ ok: false, message: 'deleteRow: ID 값 없음' });
    return _dispatch({ sheet_name: sheetName, row_json: '{}', action: 'delete', row_id_key: idKey, row_id_val: idVal });
  }

  return {
    readSheet, appendRow, updateRow, deleteRow,
    getSchedules:  () => readSheet('일정'),
    getPages:      () => readSheet('영향페이지'),
    getDefects:    () => readSheet('결함유형'),
    getLinks:      () => readSheet('운영링크'),
    getMigrations: () => readSheet('이관항목'),
    addSchedule:   row => appendRow('일정', row),
    addDefect:     row => appendRow('결함유형', row),
    addMigration:  row => appendRow('이관항목', row),
  };
})();
