import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../firebase/config';
// 모킹 데이터는 임시로 참조만 함
import { mockCharacterData } from './mockData';
import { processEquipmentIcons, processGemIcons, processArkNodes } from './imageUtils';

/**
 * 캐릭터 이름으로 Firebase에서 데이터를 검색하는 함수
 * @param {string} characterName - 검색할 캐릭터 이름
 * @returns {Promise<Array>} - 검색 결과 배열
 */
export const searchCharacterData = async (characterName) => {
  try {
    console.log(`캐릭터 '${characterName}' 데이터를 Firebase에서 검색합니다.`);
    
    // 서버 목록 (모든 서버에서 검색)
    const servers = ['카제로스', '아브렐슈드', '카단', '니나브', '실리안', '아만'];
    let results = [];
    
    // 모든 서버에서 검색 시도
    for (const server of servers) {
      try {
        // 서버/캐릭터이름 경로로 접근
        const characterPath = `characters/${server}/${characterName}`;
        const characterRef = ref(database, characterPath);
        const snapshot = await get(characterRef);
        
        if (snapshot.exists()) {
          console.log(`${server} 서버에서 캐릭터 발견!`);
          const data = snapshot.val();
          
          // 데이터가 객체이고 여러 날짜가 있는 경우
          if (typeof data === 'object' && !Array.isArray(data)) {
            // 각 날짜의 데이터를 개별 데이터로 추가
            Object.entries(data).forEach(([dateKey, dateData]) => {
              if (typeof dateData === 'object') {
                results.push({
                  id: dateKey,
                  server: server,
                  charname: characterName,
                  ...dateData
                });
              }
            });
          } else {
            // 단일 데이터인 경우
            results.push({
              id: `${server}_${characterName}`,
              server: server,
              charname: characterName,
              ...data
            });
          }
        }
      } catch (err) {
        console.log(`${server} 서버 검색 중 오류:`, err);
        // 특정 서버 검색 오류는 건너뛰고 다음 서버 검색
      }
    }
    
    // 결과가 없으면 모킹 데이터 사용
    if (results.length === 0) {
      console.warn(`Firebase에서 데이터를 찾지 못했습니다. 모킹 데이터를 사용합니다.`);
      // 모킹 데이터 필터링
      const filteredData = mockCharacterData.filter(
        item => item.charname.toLowerCase() === characterName.toLowerCase()
      );
      results = filteredData;
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
    console.error('데이터 검색 오류:', error);
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
