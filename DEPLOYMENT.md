# GitHub Pages 배포 가이드

이 프로젝트를 GitHub Pages에 배포하기 위한 단계별 안내서입니다.

## 사전 준비

1. GitHub 계정과 GitHub에 연결된 로컬 저장소가 필요합니다.
2. Node.js와 npm이 로컬 환경에 설치되어 있어야 합니다.

## 배포 단계

### 1. 의존성 패키지 설치

```bash
# gh-pages 패키지 설치
npm install --save-dev gh-pages
```

### 2. 프로젝트 빌드 및 배포

```bash
# 배포 명령 실행
npm run deploy
```

이 명령어는 다음 작업을 수행합니다:
- `npm run build`: 프로젝트를 빌드하여 정적 파일 생성
- `gh-pages -d build`: 빌드된 파일을 GitHub Pages에 배포

### 3. GitHub 저장소 설정

배포가 완료된 후 GitHub 저장소의 설정에서 GitHub Pages 설정을 확인합니다:

1. 저장소 페이지에서 "Settings" 탭으로 이동
2. 왼쪽 사이드바에서 "Pages" 선택
3. "Source" 섹션에서 브랜치가 `gh-pages`로 설정되어 있는지 확인

### 4. 배포 확인

몇 분 후, 다음 URL에서 프로젝트를 확인할 수 있습니다:
- `https://HeiNul.github.io/toolbox`

## 문제 해결

1. **404 오류 발생 시**:
   - GitHub Pages가 업데이트되는 데 시간이 걸릴 수 있습니다. 몇 분 후 다시 확인하세요.
   - 저장소 설정에서 Pages 소스가 올바르게 설정되었는지 확인하세요.

2. **라우팅 문제 발생 시**:
   - React Router가 올바르게 작동하도록 설정되었는지 확인하세요.
   - `404.html` 및 `index.html`의 리다이렉트 스크립트가 올바르게 추가되었는지 확인하세요.

3. **리소스 로딩 실패 시**:
   - 모든 리소스가 상대 경로를 사용하고 있는지 확인하세요.
   - `package.json`의 `homepage` 값이 올바른지 확인하세요.
