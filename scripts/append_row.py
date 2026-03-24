import os, json, sys
from datetime import datetime
import gspread
from google.oauth2.service_account import Credentials

SCOPES = ["https://www.googleapis.com/auth/spreadsheets","https://www.googleapis.com/auth/drive.readonly"]

def load_env():
    sa_json    = os.environ.get("GCP_SERVICE_ACCOUNT_JSON","")
    sheet_id   = os.environ.get("SPREADSHEET_ID","")
    sheet_name = os.environ.get("SHEET_NAME","")
    row_json   = os.environ.get("ROW_JSON","{}")
    if not sa_json:    sys.exit("❌ GCP_SERVICE_ACCOUNT_JSON 없음")
    if not sheet_id:   sys.exit("❌ SPREADSHEET_ID 없음")
    if not sheet_name: sys.exit("❌ SHEET_NAME 없음")
    return sa_json, sheet_id, sheet_name, row_json

def get_client(sa_json_str):
    creds = Credentials.from_service_account_info(json.loads(sa_json_str), scopes=SCOPES)
    return gspread.authorize(creds)

def append_row(client, sheet_id, sheet_name, row_data):
    ws = client.open_by_key(sheet_id).worksheet(sheet_name)
    headers = ws.row_values(1)
    if not headers: sys.exit(f"❌ '{sheet_name}' 헤더 없음")
    ws.append_row([str(row_data.get(h,"")) for h in headers], value_input_option="USER_ENTERED")
    print(f"✅ '{sheet_name}' 행 추가: {json.dumps(row_data, ensure_ascii=False)}")
    print(f"   시각: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    sa_json, sheet_id, sheet_name, row_json_str = load_env()
    try: row_data = json.loads(row_json_str)
    except json.JSONDecodeError as e: sys.exit(f"❌ ROW_JSON 파싱 실패: {e}")
    append_row(get_client(sa_json), sheet_id, sheet_name, row_data)
