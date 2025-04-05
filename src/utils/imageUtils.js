/**
 * 게임 아이콘 경로를 CDN URL로 변환하는 함수
 * @param {string} iconPath - 아이콘 상대 경로
 * @returns {string} - 완전한 CDN URL 경로
 */
export const getIconUrl = (iconPath) => {
  if (!iconPath) return '';
  
  // 이미 URL 형식이면 그대로 반환
  if (iconPath.startsWith('http')) {
    return iconPath;
  }
  
  // 특수 접두사 처리 (콜론으로 시작하는 경로)
  if (iconPath.startsWith(':')) {
    iconPath = iconPath.substring(1);
  }
  
  // CDN 기본 URL
  const cdnBaseUrl = 'https://cdn-lostark.game.onstove.com/efui_iconatlas/';
  
  // 경로 구성 요소 분석 (예: "efuigl_item/gl_item_01_225.png" -> "gl_item/gl_item_01_225.png")
  let formattedPath = iconPath;
  
  // 경로 시작 부분 처리
  if (iconPath.startsWith('efuigl_item/')) {
    formattedPath = iconPath.replace('efuigl_item/', 'gl_item/');
  } else if (iconPath.startsWith('efuisru_item/')) {
    formattedPath = iconPath.replace('efuisru_item/', 'sru_item/');
  } else if (iconPath.startsWith('efuimsm_item/')) {
    formattedPath = iconPath.replace('efuimsm_item/', 'msm_item/');
  } else if (iconPath.startsWith('efuiacc/')) {
    formattedPath = iconPath.replace('efuiacc/', 'acc/');
  } else if (iconPath.startsWith('efuiuse/')) {
    formattedPath = iconPath.replace('efuiuse/', 'use/');
  } else if (iconPath.startsWith('efuiability/')) {
    formattedPath = iconPath.replace('efuiability/', 'ability/');
  } else if (iconPath.startsWith('efuiark_passive_evolution/')) {
    formattedPath = iconPath.replace('efuiark_passive_evolution/', 'ark_passive_evolution/');
  } else if (iconPath.startsWith('efuiark_passive_01/')) {
    formattedPath = iconPath.replace('efuiark_passive_01/', 'ark_passive_01/');
  } else if (iconPath.startsWith('efuiark_passive_02/')) {
    formattedPath = iconPath.replace('efuiark_passive_02/', 'ark_passive_02/');
  } else if (iconPath.startsWith('efuiark_passive_')) {
    // 기타 진화, 깨달음, 도약 노드 (efuiark_passive_dr 등)
    const regex = /efuiark_passive_([^/]+)\/(.*)/;
    const match = iconPath.match(regex);
    if (match) {
      formattedPath = `ark_passive_${match[1]}/${match[2]}`;
    }
  }
  
  // 최종 URL 반환
  return `${cdnBaseUrl}${formattedPath}`;
};

/**
 * 장비 데이터의 모든 아이콘 경로를 CDN URL로 변환
 * @param {Object} equipment - 장비 데이터 객체
 * @returns {Object} - 이미지 경로가 변환된 장비 데이터
 */
export const processEquipmentIcons = (equipment) => {
  if (!equipment) return equipment;
  
  const processed = {};
  
  // 각 장비 항목에 대해 이미지 URL 변환
  Object.entries(equipment).forEach(([slot, item]) => {
    processed[slot] = { ...item };
    if (processed[slot].Icon) {
      processed[slot].IconUrl = getIconUrl(processed[slot].Icon);
    }
  });
  
  return processed;
};

/**
 * 보석 데이터의 모든 아이콘 경로를 CDN URL로 변환
 * @param {Array} gems - 보석 데이터 배열
 * @returns {Array} - 이미지 경로가 변환된 보석 데이터
 */
export const processGemIcons = (gems) => {
  if (!gems || !Array.isArray(gems)) return gems;
  
  return gems.map(gem => {
    const newGem = [...gem];
    // 아이콘 인덱스가 5로 가정
    if (newGem[5]) {
      newGem.push(getIconUrl(newGem[5])); // IconUrl 추가
    }
    return newGem;
  });
};

/**
 * 아크 패시브 노드 아이콘 경로를 CDN URL로 변환
 * @param {Object} arkNodes - 아크 패시브 노드 데이터
 * @returns {Object} - 이미지 경로가 변환된 아크 패시브 노드 데이터
 */
export const processArkNodes = (arkNodes) => {
  if (!arkNodes || !arkNodes.nodes) return arkNodes;
  
  const processedNodes = {};
  
  // 진화, 깨달음, 도약 노드 처리
  Object.entries(arkNodes.nodes).forEach(([nodeType, tiers]) => {
    processedNodes[nodeType] = {};
    
    // 각 티어별 처리
    Object.entries(tiers).forEach(([tier, nodes]) => {
      processedNodes[nodeType][tier] = nodes.map(node => {
        const newNode = [...node];
        // 아이콘 인덱스가 2로 가정
        if (newNode[2]) {
          newNode.push(getIconUrl(newNode[2])); // IconUrl 추가
        }
        return newNode;
      });
    });
  });
  
  return {
    ...arkNodes,
    nodes: processedNodes
  };
};
