import os, json, sys
from datetime import datetime
import gspread
from google.oauth2.service_account import Credentials

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.readonly"
]

def load_env():
    sa_json    = os.environ.get("GCP_SERVICE_ACCOUNT_JSON", "")
    sheet_id   = os.environ.get("SPREADSHEET_ID", "")
    sheet_name = os.environ.get("SHEET_NAME", "")
    row_json   = os.environ.get("ROW_JSON", "{}")
    action     = os.environ.get("ACTION", "append")
    row_id_key = os.environ.get("ROW_ID_KEY", "")
    row_id_val = os.environ.get("ROW_ID_VAL", "")
    if not sa_json:    sys.exit("GCP_SERVICE_ACCOUNT_JSON 없음")
    if not sheet_id:   sys.exit("SPREADSHEET_ID 없음")
    if not sheet_name: sys.exit("SHEET_NAME 없음")
    return sa_json, sheet_id, sheet_name, row_json, action, row_id_key, row_id_val

def get_client(sa_json_str):
    creds = Credentials.from_service_account_info(json.loads(sa_json_str), scopes=SCOPES)
    return gspread.authorize(creds)

def find_row_index(ws, id_key, id_val):
    headers = ws.row_values(1)
    if id_key not in headers:
        sys.exit(f"ID 컬럼 '{id_key}' 없음 (헤더: {headers})")
    col_idx = headers.index(id_key) + 1
    col_values = ws.col_values(col_idx)
    for i, v in enumerate(col_values[1:], start=2):
        if v == id_val:
            return i
    return None

def do_append(ws, headers, row_data):
    ws.append_row([str(row_data.get(h, "")) for h in headers], value_input_option="USER_ENTERED")
    print(f"append OK: {json.dumps(row_data, ensure_ascii=False)}")

def do_update(ws, headers, row_data, id_key, id_val):
    row_idx = find_row_index(ws, id_key, id_val)
    if row_idx is None:
        sys.exit(f"'{id_key}'='{id_val}' 행 없음")
    ws.update(f"A{row_idx}", [[str(row_data.get(h, "")) for h in headers]], value_input_option="USER_ENTERED")
    print(f"update row {row_idx} OK")

def do_delete(ws, id_key, id_val):
    row_idx = find_row_index(ws, id_key, id_val)
    if row_idx is None:
        sys.exit(f"'{id_key}'='{id_val}' 행 없음")
    ws.delete_rows(row_idx)
    print(f"delete row {row_idx} OK: {id_key}={id_val}")

if __name__ == "__main__":
    sa_json, sheet_id, sheet_name, row_json_str, action, id_key, id_val = load_env()
    try:
        row_data = json.loads(row_json_str)
    except json.JSONDecodeError as e:
        sys.exit(f"ROW_JSON 파싱 실패: {e}")
    client = get_client(sa_json)
    ws = client.open_by_key(sheet_id).worksheet(sheet_name)
    headers = ws.row_values(1)
    if not headers:
        sys.exit(f"'{sheet_name}' 헤더 없음")
    print(f"action={action} sheet={sheet_name} id_key={id_key} id_val={id_val}")
    print(f"시각: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    if action == "append":
        do_append(ws, headers, row_data)
    elif action == "update":
        if not id_key or not id_val: sys.exit("update: ROW_ID_KEY, ROW_ID_VAL 필수")
        do_update(ws, headers, row_data, id_key, id_val)
    elif action == "delete":
        if not id_key or not id_val: sys.exit("delete: ROW_ID_KEY, ROW_ID_VAL 필수")
        do_delete(ws, id_key, id_val)
    else:
        sys.exit(f"알 수 없는 action: {action}")
