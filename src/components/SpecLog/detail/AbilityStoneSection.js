import React from 'react';
import { getIconUrl } from '../../../utils/imageUtils';

const AbilityStoneSection = ({ newData, oldData, hasComparison, options }) => {
  // options가 정의되지 않았거나 options.abilityStone이 정의되지 않은 경우 기본값 사용
  if (!options || !options.abilityStone || !options.abilityStone.show || !newData.display || !newData.display.equipment || !newData.display.equipment['어빌리티 스톤']) {
    return null;
  }
  
  return (
    <div className="ability-stone-section">
      <h5>어빌리티 스톤</h5>
      <div className="equipment-grid">
        <div 
          className={`equipment-item ${newData.display.equipment['어빌리티 스톤'].Grade ? newData.display.equipment['어빌리티 스톤'].Grade.toLowerCase() : ''}`}
        >
          <div className="equipment-header">
            <div className="slot-name">어빌리티 스톤</div>
            <div className="item-name">{newData.display.equipment['어빌리티 스톤'].Name}</div>
          </div>
          <div className="equipment-details">
            {options.accessory.showImages && newData.display.equipment['어빌리티 스톤'].Icon && (
              <div className="item-icon">
                <img 
                  src={newData.display.equipment['어빌리티 스톤'].IconUrl || getIconUrl(newData.display.equipment['어빌리티 스톤'].Icon)} 
                  alt={newData.display.equipment['어빌리티 스톤'].Name} 
                />
              </div>
            )}
            {options.accessory.showGrade && newData.display.equipment['어빌리티 스톤'].Grade && (
              <div>등급: {newData.display.equipment['어빌리티 스톤'].Grade}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbilityStoneSection;