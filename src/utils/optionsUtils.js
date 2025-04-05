/**
 * 스펙로그 옵션 관련 유틸리티 함수
 */

// 기본 옵션 설정
export const DEFAULT_OPTIONS = {
  equipment: {
    showImages: true,
    showGrade: true,
    showQuality: true,
    showRefine: true,        // 재련
    showHigherRefine: true,  // 상급 재련
    showTranscendence: true, // 초월
    showElixir: true         // 엘릭서
  },
  accessory: {
    showImages: true,
    showGrade: true,
    showQuality: true
  },
  abilityStone: {
    show: true  // 어빌리티 스톤 표시 여부
  }
};

// 로컬 스토리지에서 옵션 불러오기
export const loadOptions = () => {
  try {
    const savedOptions = localStorage.getItem('speclog_options');
    if (savedOptions) {
      return JSON.parse(savedOptions);
    }
    // 저장된 옵션이 없으면 기본값 반환
    return DEFAULT_OPTIONS;
  } catch (error) {
    console.error('옵션 불러오기 실패:', error);
    return DEFAULT_OPTIONS;
  }
};

// 로컬 스토리지에 옵션 저장하기
export const saveOptions = (options) => {
  try {
    localStorage.setItem('speclog_options', JSON.stringify(options));
  } catch (error) {
    console.error('옵션 저장 실패:', error);
  }
};
