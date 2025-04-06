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
    // 콜론 제거
    iconPath = iconPath.substring(1);
  }
  
  // CDN 기본 URL
  const cdnBaseUrl = 'https://cdn-lostark.game.onstove.com/efui_iconatlas/';
  
  // 아이템 (장비) 패턴: efui[XX]_item/[XX]_item_...
  // 예: efuidh_item/dh_item_01_250.png
  const itemPattern = /efui([a-z_]+)_item\/([a-z_]+)_item(.*)/;
  const itemMatch = iconPath.match(itemPattern);
  
  if (itemMatch) {
    const prefix = itemMatch[2]; // 'dh', 'gl', 'sm' 등
    return `${cdnBaseUrl}${prefix}_item/${prefix}_item${itemMatch[3]}`;
  }
  
  // 아크 패시브 패턴: efuiark_passive_[XX]/...
  const arkPattern = /efuiark_passive_([^/]+)\/(.*)/;
  const arkMatch = iconPath.match(arkPattern);
  
  if (arkMatch) {
    const type = arkMatch[1]; // '01', '02', 'evolution', 'dr' 등
    return `${cdnBaseUrl}ark_passive_${type}/${arkMatch[2]}`;
  }
  
  // 일반적인 패턴: efui[category]/...
  const generalPattern = /efui([a-z_]+)\/(.*)/;
  const generalMatch = iconPath.match(generalPattern);
  
  if (generalMatch) {
    const category = generalMatch[1]; // 'ability', 'acc', 'use' 등
    return `${cdnBaseUrl}${category}/${generalMatch[2]}`;
  }
  
  // 패턴 매칭에 실패한 경우 원본 경로 사용
  console.warn(`패턴 매칭 실패: ${iconPath}`);
  return `${cdnBaseUrl}${iconPath}`;
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
