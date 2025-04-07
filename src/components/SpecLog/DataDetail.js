import React from 'react';
import { formatDate } from '../../utils/dateUtils';

// 세부 컴포넌트 가져오기
import SummarySection from './detail/SummarySection';
import ScoreDetailSection from './detail/ScoreDetailSection';
import EquipmentSection from './detail/EquipmentSection';
import AccessorySection from './detail/AccessorySection';
import GemsSection from './detail/GemsSection';
import ArkNodesSection from './detail/ArkNodesSection';
import EngravingsSection from './detail/EngravingsSection';
import CardsSection from './detail/CardsSection';

const DataDetail = ({ data, comparison = null, options = {} }) => {
  if (!data) return <div className="no-data">표시할 데이터가 없습니다.</div>;

  // 비교 데이터 존재 여부 확인
  const hasComparison = comparison !== null;
  
  // 데이터 할당 - 선택 순서대로 처리 (첫번째 선택 = 기준 데이터, 두번째 선택 = 비교 데이터)
  let oldData = null;
  let newData = null;
  
  if (hasComparison) {
    // 첫번째 선택된 항목이 기준 데이터, 두번째 선택된 항목이 비교 데이터
    newData = data;         // 첫번째 선택 = 기준 데이터
    oldData = comparison;   // 두번째 선택 = 비교 데이터
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
          {!hasComparison && (
            <span>| 관측 시간: {formatDate(newData.observed_at)}</span>
          )}
          {newData.build && ` | 빌드: ${newData.build}`}
        </p>
        
        {hasComparison && (
          <div className="comparison-indicator">
            <div className="comparison-status">
              <span className="comparison-base">기준 데이터: {formatDate(newData.observed_at)}</span>
              <span className="comparison-target">비교 데이터: {formatDate(oldData.observed_at)}</span>
            </div>
            
          </div>
        )}
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
          </div>
        )}
      </div>

      <div className="detail-info-container">
        <div className="gems-section">
          <GemsSection 
            newData={newData} 
            oldData={oldData}
            hasComparison={hasComparison}
          />
        </div>

        <div className="lower-info-container">
          <div className="lower-left-column">
            <ArkNodesSection 
              newData={newData} 
              oldData={oldData}
              hasComparison={hasComparison}
            />
          </div>
          
          <div className="lower-right-column">
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
    </div>
  );
};

export default DataDetail;