import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../firebase/config';
import { processEquipmentIcons, processGemIcons, processArkNodes } from './imageUtils';
import logger from './logUtils';

/**
 * 캐릭터 이름으로 Firebase에서 데이터를 검색하는 함수
 * @param {string} characterName - 검색할 캐릭터 이름
 * @returns {Promise<Array>} - 검색 결과 배열
 */
export const searchCharacterData = async (characterName) => {
  try {
    logger.log(`캐릭터 '${characterName}' 데이터를 Firebase에서 검색합니다.`);
    
    // 정규화된 검색어 (공백 제거, 소문자로 변환)
    const normalizedSearchTerm = characterName.trim().toLowerCase();
    
    // 서버 목록 (모든 서버에서 검색)
    const servers = ['카제로스', '아브렐슈드', '카단', '니나브', '실리안', '아만'];
    let results = [];
    
    // 루프 전에 출력용 디버그 메시지
    logger.log(`검색어(${normalizedSearchTerm})로 모든 서버에서 일치하는 캐릭터를 찾습니다`);

    // 모든 서버에서 검색 시도
    for (const server of servers) {
      try {
        // 서버 경로 접근
        const charactersPath = `characters/${server}`;
        const charactersRef = ref(database, charactersPath);
        const charactersSnapshot = await get(charactersRef);

        if (!charactersSnapshot.exists()) {
          logger.log(`${server} 서버에 데이터가 없습니다.`);
          continue;
        }

        const charactersData = charactersSnapshot.val();

        // 모든 캐릭터 이름 검색
        for (const characterKey in charactersData) {
          // 대소문자 구분 없이 비교
          if (characterKey.toLowerCase() === normalizedSearchTerm) {
            logger.log(`${server} 서버에서 ${characterKey} 캐릭터 발견!`);
            
            // 캐릭터 데이터 참조
            const characterData = charactersData[characterKey];
            
            // 데이터가 객체인지 확인(여러 날짜가 있는 경우)
            if (typeof characterData === 'object' && !Array.isArray(characterData)) {
              // 각 날짜간 데이터 추출
              for (const dateKey in characterData) {
                const dateData = characterData[dateKey];
                
                if (typeof dateData === 'object') {
                  results.push({
                    id: dateKey,
                    server: server,
                    charname: characterKey, // 원래 대소문자를 유지한 캐릭터명 사용
                    ...dateData
                  });
                }
              }
            } else {
              // 단일 데이터인 경우
              results.push({
                id: `${server}_${characterKey}`,
                server: server,
                charname: characterKey,
                ...characterData
              });
            }
          }
        }
      } catch (err) {
        logger.error(`${server} 서버 검색 중 오류:`, err);
      }
    }
    
    if (results.length === 0) {
      logger.warn(`Firebase에서 '${characterName}' 데이터를 찾지 못했습니다.`);
    } else {
      logger.log(`'${characterName}' 검색 결과 ${results.length}개의 데이터를 찾았습니다.`);
    }
    
    // 관측 시간 기준으로 과거부터 최신 순으로 정렬
    results.sort((a, b) => new Date(a.observed_at) - new Date(b.observed_at));
    
    // 이미지 경로 처리
    const processedResults = results.map(item => {
      const newItem = { ...item };
      
      // 장비 데이터 이미지 처리
      if (newItem.display && newItem.display.equipment) {
        newItem.display.equipment = processEquipmentIcons(newItem.display.equipment);
      }
      
      // 보석 데이터 이미지 처리
      if (newItem.display && newItem.display.gem) {
        newItem.display.gem = processGemIcons(newItem.display.gem);
      }
      
      // 아크 패시브 노드 처리
      if (newItem.display && newItem.display.arkp) {
        newItem.display.arkp = processArkNodes(newItem.display.arkp);
      }
      
      return newItem;
    });
    
    return processedResults;
  } catch (error) {
    logger.error('데이터 검색 오류:', error);
    throw error;
  }
};

/**
 * 점수 변화 데이터를 계산하는 함수
 * @param {Array} data - 캐릭터 데이터 배열
 * @returns {Array} - 날짜별 점수 변화 데이터
 */
export const calculateScoreChanges = (data) => {
  if (!data || data.length === 0) return [];
  
  return data.map((item, index) => {
    const prevItem = index < data.length - 1 ? data[index + 1] : null;
    
    return {
      id: item.id,
      date: new Date(item.observed_at),
      score: item.converted_zp || 0,
      scoreChange: prevItem 
        ? (item.converted_zp || 0) - (prevItem.converted_zp || 0) 
        : 0,
      data: item
    };
  });
};
