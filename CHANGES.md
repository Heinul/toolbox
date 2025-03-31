# 품질 판독기 업데이트 내용

## 변경 사항
1. 토글 버튼 제거 - 기준값을 하나로 통일했기 때문에 고대/유물 모드 구분이 더 이상 필요하지 않음
2. 데이터 구조 단순화 - 중첩 구조를 간소화하여 직관적으로 접근 가능하도록 변경
3. UI 레이아웃 조정 - 토글 제거로 인한 공간 재배치

## 수정된 파일 목록
- `src/data/qualityData.js`: 데이터 구조 단순화
- `src/pages/QualityReader.js`: 모드 전환 기능 제거 및 레이아웃 재구성
- `src/styles/QualityReader.css`: 토글 버튼 관련 스타일 제거

## 배포 방법
1. 변경사항 커밋:
   ```bash
   git add .
   git commit -m "토글 버튼 제거 및 데이터 구조 단순화"
   git push
   ```

2. GitHub Pages에 배포:
   ```bash
   npm run deploy
   ```

3. 배포 확인: `https://heinul.github.io/toolbox`
