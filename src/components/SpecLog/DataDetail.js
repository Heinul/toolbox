import React from 'react';
import { formatDate } from '../../utils/dateUtils';

// 세부 컴포넌트 가져오기
import SummarySection from './detail/SummarySection';
import ScoreDetailSection from './detail/ScoreDetailSection';
import EquipmentSection from './detail/EquipmentSection';
import AccessorySection from './detail/AccessorySection';
import AbilityStoneSection from './detail/AbilityStoneSection';
import GemsSection from './detail/GemsSection';
import ArkNodesSection from './detail/ArkNodesSection';
import EngravingsSection from './detail/EngravingsSection';
import CardsSection from './detail/CardsSection';

/**
 * 캐릭터 데이터 세부 정보 표시 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.data - 표시할 캐릭터 데이터
 * @param {Object} props.comparison - 비교 데이터 (선택적)
 * @param {Object} props.options - 화면 표시 옵션
 * @returns {JSX.Element} - 데이터 세부 정보 컴포넌트
 */
const DataDetail = ({ data, comparison = null, options = {} }) => {
  if (!data) return <div className="no-data">표시할 데이터가 없습니다.</div>;

  // 비교 데이터 존재 여부 확인
  const hasComparison = comparison !== null;
  
  // 데이터 비교 정보 가공 - 좌측은 과거, 우측은 최신 데이터
  let oldData = null;
  let newData = null;
  
  if (hasComparison) {
    // 날짜 기준으로 더 오래된 데이터와 최신 데이터 구분
    const date1 = new Date(data.observed_at);
    const date2 = new Date(comparison.observed_at);
    
    if (date1 < date2) {
      oldData = data;
      newData = comparison;
    } else {
      oldData = comparison;
      newData = data;
    }
  } else {
    // 비교 데이터가 없으면 현재 데이터만 사용
    newData = data;
  }
  
  // options가 없을 경우 기본값 제공
  const defaultOptions = {
    equipment: {
      showImages: true,
      showGrade: true,
      showQuality: true,
      showRefine: true,
      showHigherRefine: true,
      showTranscendence: true,
      showElixir: true
    },
    accessory: {
      showImages: true,
      showGrade: true,
      showQuality: true
    },
    abilityStone: {
      show: true
    }
  };
  
  // 전달받은 options가 없을 경우 기본값을 사용하고, 있는 경우 기본값을 유지하면서 전달받은 options를 덮어쓰기
  const mergedOptions = {
    equipment: { ...defaultOptions.equipment, ...(options.equipment || {}) },
    accessory: { ...defaultOptions.accessory, ...(options.accessory || {}) },
    abilityStone: { ...defaultOptions.abilityStone, ...(options.abilityStone || {}) }
  };

  return (
    <div className="data-detail-container">
      <div className="data-header">
        <h3>{newData.charname} ({newData.class})</h3>
        <p>
          서버: {newData.server} 
          {hasComparison && (
            <span className="date-range">
              | 기간: {formatDate(oldData.observed_at)} ~ {formatDate(newData.observed_at)}
            </span>
          )}
          {!hasComparison && (
            <span>| 관측 시간: {formatDate(newData.observed_at)}</span>
          )}
          {newData.build && ` | 빌드: ${newData.build}`}
        </p>
      </div>

      <SummarySection newData={newData} oldData={oldData} hasComparison={hasComparison} />
      
      <ScoreDetailSection newData={newData} oldData={oldData} hasComparison={hasComparison} />
      
      <div className="data-equipment">
        <h4>장비 정보</h4>
        {newData.display && newData.display.equipment && (
          <div className="equipment-container">
            <EquipmentSection 
              newData={newData} 
              oldData={oldData} 
              hasComparison={hasComparison} 
              options={mergedOptions} 
            />
            
            <AccessorySection 
              newData={newData} 
              oldData={oldData} 
              hasComparison={hasComparison} 
              options={mergedOptions} 
            />
            
            <AbilityStoneSection 
              newData={newData} 
              oldData={oldData} 
              hasComparison={hasComparison} 
              options={mergedOptions} 
            />
          </div>
        )}
      </div>

      <div className="info-container">
        <div className="left-column">
          <GemsSection 
            newData={newData} 
            oldData={oldData}
            hasComparison={hasComparison}
          />

          <ArkNodesSection 
            newData={newData} 
            oldData={oldData}
            hasComparison={hasComparison}
          />
        </div>
        
        <div className="right-column">
          <EngravingsSection 
            newData={newData} 
            oldData={oldData}
            hasComparison={hasComparison}
          />

          <CardsSection 
            newData={newData} 
            oldData={oldData}
            hasComparison={hasComparison}
          />
        </div>
      </div>
    </div>
  );
};

export default DataDetail;