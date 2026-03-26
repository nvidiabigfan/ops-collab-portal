import os, json, sys
import gspread
from google.oauth2.service_account import Credentials

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]
SHEET_NAME = "상품화면매핑"

def main():
    sa_json = os.environ.get("GCP_SERVICE_ACCOUNT_JSON", "")
    sheet_id = os.environ.get("SPREADSHEET_ID", "")
    if not sa_json: sys.exit("GCP_SERVICE_ACCOUNT_JSON 없음")
    if not sheet_id: sys.exit("SPREADSHEET_ID 없음")

    creds = Credentials.from_service_account_info(json.loads(sa_json), scopes=SCOPES)
    gc = gspread.authorize(creds)
    spreadsheet = gc.open_by_key(sheet_id)

    # 시트 존재 확인 후 생성 또는 초기화
    try:
        ws = spreadsheet.worksheet(SHEET_NAME)
        ws.clear()
        print(f"기존 '{SHEET_NAME}' 시트 초기화 완료")
    except gspread.exceptions.WorksheetNotFound:
        ws = spreadsheet.add_worksheet(title=SHEET_NAME, rows=200, cols=10)
        print(f"'{SHEET_NAME}' 시트 신규 생성 완료")

    # 데이터 입력
    data = [
        ["상품및서비스명", "페이지ID", "페이지명", "채널", "사이트", "노출위치", "태그"],
        ["미니골프보험", "MAIN0000M01", "대표 홈 메인", "대표홈페이지", "shinhanez.co.kr", "메인 상품 아이콘 그리드", "메인, 전상품노출"],
        ["미니골프보험", "PRD11001M01", "미니골프보험 상품안내", "대표홈페이지", "shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "미니, 골프"],
        ["미니골프보험", "DIR_HMEHMEHME_M01_1", "다이렉트 상품 목록", "다이렉트", "direct.shinhanez.co.kr", "전체 상품 카드 목록", "상품목록"],
        ["미니생활보험", "MAIN0000M01", "대표 홈 메인", "대표홈페이지", "shinhanez.co.kr", "메인 상품 아이콘 그리드", "메인, 전상품노출"],
        ["미니생활보험", "DIR_HMEHMEHME_M01", "다이렉트 홈 메인", "다이렉트", "direct.shinhanez.co.kr", "상품 목록 섹션 (운동/생활 카테고리)", "홈메인, 상품목록"],
        ["미니생활보험", "DIR_HMEHMEHME_M01_1", "다이렉트 상품 목록", "다이렉트", "direct.shinhanez.co.kr", "전체 상품 카드 목록", "상품목록"],
        ["미니생활보험", "DIR_PDRCLICLI_M01", "다이렉트 미니생활보험 상품메인", "다이렉트", "direct.shinhanez.co.kr", "히어로배너 / 상품명 타이틀 / 케어선택 섹션 / 브랜드메시지", "미니, 생활"],
        ["미니운동보험", "MAIN0000M01", "대표 홈 메인", "대표홈페이지", "shinhanez.co.kr", "메인 상품 아이콘 그리드", "메인, 전상품노출"],
        ["미니운동보험", "PRD11004M01", "미니운동보험 상품안내", "대표홈페이지", "shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "미니, 운동"],
        ["미니운동보험", "DIR_HMEHMEHME_M01_1", "다이렉트 상품 목록", "다이렉트", "direct.shinhanez.co.kr", "전체 상품 카드 목록", "상품목록"],
        ["신한SOL국내여행보험", "MAIN0000M01", "대표 홈 메인", "대표홈페이지", "shinhanez.co.kr", "메인 상품 아이콘 그리드", "메인, 전상품노출"],
        ["신한SOL국내여행보험", "PRD20002M01", "국내여행보험 상품안내", "대표홈페이지", "shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "국내여행"],
        ["신한SOL국내여행보험", "DIR_PDRDTIDTI_M01", "다이렉트 국내여행보험 상품메인", "다이렉트", "direct.shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "국내여행"],
        ["신한SOL금융안심보험", "MAIN0000M01", "대표 홈 메인", "대표홈페이지", "shinhanez.co.kr", "메인 상품 아이콘 그리드", "메인, 전상품노출"],
        ["신한SOL금융안심보험", "PRD11000M01", "금융안심보험 상품안내", "대표홈페이지", "shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "금융안심"],
        ["신한SOL금융안심보험", "DIR_PDRFINFIN_M01", "다이렉트 금융안심보험 상품메인", "다이렉트", "direct.shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "금융안심"],
        ["신한SOL뇌·심장보험", "MAIN0000M01", "대표 홈 메인", "대표홈페이지", "shinhanez.co.kr", "메인 상품 아이콘 그리드", "메인, 전상품노출"],
        ["신한SOL뇌·심장보험", "PRD70000M02", "뇌심장보험 상품안내", "대표홈페이지", "shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "뇌심장"],
        ["신한SOL뇌·심장보험", "DIR_HMEHMEHME_M01", "다이렉트 홈 메인", "다이렉트", "direct.shinhanez.co.kr", "상품 목록 섹션 (운동/생활 카테고리)", "홈메인, 상품목록"],
        ["신한SOL뇌·심장보험", "DIR_HMEHMEHME_M01_1", "다이렉트 상품 목록", "다이렉트", "direct.shinhanez.co.kr", "전체 상품 카드 목록", "상품목록"],
        ["신한SOL뇌·심장보험", "DIR_PDRSHISHI_M02", "다이렉트 뇌심장보험 상품메인", "다이렉트", "direct.shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "뇌심장"],
        ["신한SOL면역질환보험", "MAIN0000M01", "대표 홈 메인", "대표홈페이지", "shinhanez.co.kr", "메인 상품 아이콘 그리드", "메인, 전상품노출"],
        ["신한SOL면역질환보험", "PRD70000M04", "면역질환보험 상품안내", "대표홈페이지", "shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "면역질환"],
        ["신한SOL면역질환보험", "DIR_HMEHMEHME_M01", "다이렉트 홈 메인", "다이렉트", "direct.shinhanez.co.kr", "상품 목록 섹션 (운동/생활 카테고리)", "홈메인, 상품목록"],
        ["신한SOL면역질환보험", "DIR_HMEHMEHME_M01_1", "다이렉트 상품 목록", "다이렉트", "direct.shinhanez.co.kr", "전체 상품 카드 목록", "상품목록"],
        ["신한SOL면역질환보험", "DIR_PDRSHISHI_M04", "다이렉트 면역질환보험 상품메인", "다이렉트", "direct.shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "면역질환"],
        ["신한SOL암보험", "MAIN0000M01", "대표 홈 메인", "대표홈페이지", "shinhanez.co.kr", "메인 상품 아이콘 그리드", "메인, 전상품노출"],
        ["신한SOL암보험", "PRD70000M03", "암보험 상품안내", "대표홈페이지", "shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "암"],
        ["신한SOL암보험", "DIR_HMEHMEHME_M01", "다이렉트 홈 메인", "다이렉트", "direct.shinhanez.co.kr", "상품 목록 섹션 (운동/생활 카테고리)", "홈메인, 상품목록"],
        ["신한SOL암보험", "DIR_HMEHMEHME_M01_1", "다이렉트 상품 목록", "다이렉트", "direct.shinhanez.co.kr", "전체 상품 카드 목록", "상품목록"],
        ["신한SOL암보험", "DIR_PDRSHISHI_M03", "다이렉트 암보험 상품메인", "다이렉트", "direct.shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "암"],
        ["신한SOL일본여행보험", "MAIN0000M01", "대표 홈 메인", "대표홈페이지", "shinhanez.co.kr", "메인 상품 아이콘 그리드", "메인, 전상품노출"],
        ["신한SOL일본여행보험", "PRD20001M01", "일본여행보험 상품안내", "대표홈페이지", "shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "일본여행"],
        ["신한SOL일본여행보험", "DIR_PDROTIJPN_M01", "다이렉트 일본여행보험 상품메인", "다이렉트", "direct.shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "일본여행"],
        ["신한SOL주택화재보험(무배당)", "MAIN0000M01", "대표 홈 메인", "대표홈페이지", "shinhanez.co.kr", "메인 상품 아이콘 그리드", "메인, 전상품노출"],
        ["신한SOL주택화재보험(무배당)", "PRD80000M01", "화재보험 상품안내", "대표홈페이지", "shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "화재"],
        ["신한SOL주택화재보험(무배당)", "DIR_HMEHMEHME_M01_3", "다이렉트 마이 탭", "다이렉트", "direct.shinhanez.co.kr", "마이탭 추천보험 콘텐츠 섹션 (스와이프)", "마이탭, 추천보험, 개인화"],
        ["신한SOL주택화재보험(무배당)", "DIR_PDRHFIHFI_M01", "다이렉트 주택화재보험 상품메인", "다이렉트", "direct.shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "화재"],
        ["신한SOL처음건강보험(무배당)(자동갱신형)", "MAIN0000M01", "대표 홈 메인", "대표홈페이지", "shinhanez.co.kr", "메인 상품 아이콘 그리드", "메인, 전상품노출"],
        ["신한SOL처음건강보험(무배당)(자동갱신형)", "PRD70000M01", "건강보험 상품안내", "대표홈페이지", "shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "건강"],
        ["신한SOL처음건강보험(무배당)(자동갱신형)", "DIR_HMEHMEHME_M01", "다이렉트 홈 메인", "다이렉트", "direct.shinhanez.co.kr", "상품 목록 섹션 (운동/생활 카테고리)", "홈메인, 상품목록"],
        ["신한SOL처음건강보험(무배당)(자동갱신형)", "DIR_HMEHMEHME_M01_1", "다이렉트 상품 목록", "다이렉트", "direct.shinhanez.co.kr", "전체 상품 카드 목록", "상품목록"],
        ["신한SOL처음건강보험(무배당)(자동갱신형)", "DIR_HMEHMEHME_M01_3", "다이렉트 마이 탭", "다이렉트", "direct.shinhanez.co.kr", "마이탭 추천보험 콘텐츠 섹션 (스와이프)", "마이탭, 추천보험, 개인화"],
        ["신한SOL처음건강보험(무배당)(자동갱신형)", "DIR_HMEHMEHME_M03", "다이렉트 혜택 탭", "다이렉트", "direct.shinhanez.co.kr", "제휴 혜택 배너", "혜택탭, 제휴"],
        ["신한SOL처음건강보험(무배당)(자동갱신형)", "DIR_PDRSHISHI_M01", "다이렉트 종합건강보험 상품메인", "다이렉트", "direct.shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "건강"],
        ["신한SOL처음실손의료보험(무배당)", "MAIN0000M01", "대표 홈 메인", "대표홈페이지", "shinhanez.co.kr", "메인 상품 아이콘 그리드", "메인, 전상품노출"],
        ["신한SOL처음실손의료보험(무배당)", "PRD12000M01", "실손의료보험 상품안내", "대표홈페이지", "shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "실손"],
        ["신한SOL처음실손의료보험(무배당)", "DIR_HMEHMEHME_M01_3", "다이렉트 마이 탭", "다이렉트", "direct.shinhanez.co.kr", "마이탭 추천보험 콘텐츠 섹션 (스와이프)", "마이탭, 추천보험, 개인화"],
        ["신한SOL처음실손의료보험(무배당)", "DIR_PDRSIISII_M01", "다이렉트 실손의료보험 상품메인", "다이렉트", "direct.shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "실손"],
        ["신한SOL처음운전자보험(무배당)", "MAIN0000M01", "대표 홈 메인", "대표홈페이지", "shinhanez.co.kr", "메인 상품 아이콘 그리드", "메인, 전상품노출"],
        ["신한SOL처음운전자보험(무배당)", "PRD50000M01", "운전자보험 상품안내", "대표홈페이지", "shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "운전자"],
        ["신한SOL처음운전자보험(무배당)", "DIR_HMEHMEHME_M01", "다이렉트 홈 메인", "다이렉트", "direct.shinhanez.co.kr", "상품 목록 섹션 (운동/생활 카테고리)", "홈메인, 상품목록"],
        ["신한SOL처음운전자보험(무배당)", "DIR_HMEHMEHME_M01_1", "다이렉트 상품 목록", "다이렉트", "direct.shinhanez.co.kr", "전체 상품 카드 목록", "상품목록"],
        ["신한SOL처음운전자보험(무배당)", "DIR_HMEHMEHME_M01_3", "다이렉트 마이 탭", "다이렉트", "direct.shinhanez.co.kr", "마이탭 추천보험 콘텐츠 섹션 (스와이프)", "마이탭, 추천보험, 개인화"],
        ["신한SOL처음운전자보험(무배당)", "DIR_HMEHMEHME_M03", "다이렉트 혜택 탭", "다이렉트", "direct.shinhanez.co.kr", "제휴 혜택 배너", "혜택탭, 제휴"],
        ["신한SOL처음운전자보험(무배당)", "DIR_PDRFDIFDI_M01", "다이렉트 운전자보험 상품메인", "다이렉트", "direct.shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "운전자"],
        ["신한SOL처음해외여행보험", "MAIN0000M01", "대표 홈 메인", "대표홈페이지", "shinhanez.co.kr", "메인 상품 아이콘 그리드", "메인, 전상품노출"],
        ["신한SOL처음해외여행보험", "PRD20000M01", "해외여행보험 상품안내", "대표홈페이지", "shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "해외여행"],
        ["신한SOL처음해외여행보험", "DIR_HMEHMEHME_M01_3", "다이렉트 마이 탭", "다이렉트", "direct.shinhanez.co.kr", "마이탭 추천보험 콘텐츠 섹션 (스와이프)", "마이탭, 추천보험, 개인화"],
        ["신한SOL처음해외여행보험", "DIR_PDROTIOTI_M01", "다이렉트 해외여행보험 상품메인", "다이렉트", "direct.shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "해외여행"],
        ["신한SOL해외장기체류보험", "MAIN0000M01", "대표 홈 메인", "대표홈페이지", "shinhanez.co.kr", "메인 상품 아이콘 그리드", "메인, 전상품노출"],
        ["신한SOL해외장기체류보험", "PRD30000M01", "해외장기체류보험 상품안내", "대표홈페이지", "shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "해외장기체류"],
        ["신한SOL해외장기체류보험", "DIR_PDRLTIOSI_M01", "다이렉트 해외장기체류보험 상품메인", "다이렉트", "direct.shinhanez.co.kr", "히어로배너 / 상품명 / 가입하기버튼", "해외장기체류"]
    ]
    ws.update('A1', data)
    print(f"총 {len(data)-1}행 입력 완료 (헤더 제외)")

    # 헤더 행 볼드 처리
    ws.format('A1:G1', {
        "textFormat": {"bold": True},
        "backgroundColor": {"red": 0.85, "green": 0.92, "blue": 0.98}
    })
    print("헤더 스타일 적용 완료")

if __name__ == "__main__":
    main()
