# 리액트 툴박스

다양한 유용한 도구를 제공하는 리액트 기반 웹 애플리케이션입니다.

## 사용 가능한 도구

- **품질 판독기**: 로스트아크 장신구 품질 판독기 도구
  - 연마 단계(0-3)별 품질 계산 기능
  - 목걸이, 귀걸이, 반지 품질 동시 확인 가능
  - 연마 단계별 최소/최대 값 표시
  
- **스펙로그**: ZLoa History Tracker 확장 프로그램 연동 스펙 로그 도구
  - 수집된 캐릭터 정보 검색 기능
  - 시간별 스펙 변화 그래프 시각화
  - 두 시점 간 스펙 변화 비교 기능
  - 날짜 범위 필터링 기능
  - 설정 옵션 커스터마이징

## 개발 시작하기

이 프로젝트를 로컬에서 실행하기 위한 단계입니다.

### 사전 요구사항

- Node.js 및 npm이 설치되어 있어야 합니다.

### 설치 및 실행

1. 저장소를 클론합니다:
   ```bash
   git clone https://github.com/Heinul/toolbox.git
   cd toolbox
   ```

2. 의존성 패키지를 설치합니다:
   ```bash
   npm install
   ```

3. 개발 서버를 시작합니다:
   ```bash
   npm start
   ```

4. 브라우저에서 `http://localhost:3000`으로 접속하여 애플리케이션을 확인합니다.

## 배포하기

GitHub Pages에 배포하기 위해 다음 명령어를 실행합니다:

```bash
npm run deploy
```

배포된 앱은 [https://Heinul.github.io/toolbox](https://Heinul.github.io/toolbox)에서 확인할 수 있습니다.

## 최근 변경사항

### 품질 판독기 업데이트
- 토글 버튼 제거 - 기준값 통일
- 데이터 구조 단순화 및 UI 레이아웃 조정

### 스펙로그 추가
- ZLoa History Tracker 확장 프로그램 연동
- 시간별 스펙 변화 추적 및 비교 기능
- 그래프 시각화 및 날짜 필터링 기능

## 기술 스택

- React.js
- React Router
- CSS
- Firebase (백엔드 데이터 저장)
- Recharts (그래프 시각화)
- date-fns (날짜 처리)

## 관련 프로젝트

- [ZLoa History Tracker 확장 프로그램](https://chromewebstore.google.com/detail/zloa-history-tracker/pjpkjihggbjkhpkplkeihkelkmmmhaek?authuser=0&hl=ko)
- [GitHub 저장소](https://github.com/Heinul/ZLoaHistoryCollect)
