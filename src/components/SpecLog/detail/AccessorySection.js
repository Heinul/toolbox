import React from 'react';
import { getIconUrl } from '../../../utils/imageUtils';

const AccessorySection = ({ newData, oldData, hasComparison, options }) => {
  // 유효성 검사
  if (!newData || !newData.display || !newData.display.equipment || !options || !options.accessory) {
    return null;
  }

  // 기본 악세사리 슬롯 + 어빌리티 스톤
  const accessorySlots = [
    '목걸이', '귀걸이', '귀걸이2', '반지', '반지2', '팔찌', 
    ...(options.abilityStone && options.abilityStone.show ? ['어빌리티 스톤'] : [])
  ];

  return (
    <div className="accessory-section">
      <h5>악세사리</h5>
      <div className="equipment-grid">
        {accessorySlots.map(slotName => {
          if (!newData.display.equipment[slotName]) return null;
          const item = newData.display.equipment[slotName];
          
          const oldItem = hasComparison && oldData.display && oldData.display.equipment && oldData.display.equipment[slotName];
          const hasChanged = oldItem && (
            oldItem.Name !== item.Name ||
            oldItem.Grade !== item.Grade ||
            oldItem.품질 !== item.품질 ||
            JSON.stringify(oldItem['연마 효과']) !== JSON.stringify(item['연마 효과']) ||
            JSON.stringify(oldItem['기본옵']) !== JSON.stringify(item['기본옵']) ||
            JSON.stringify(oldItem['특옵']) !== JSON.stringify(item['특옵'])
          );
          
          return (
            <div 
              key={slotName} 
              className={`equipment-item ${item.Grade ? item.Grade.toLowerCase() : ''} ${hasChanged ? 'item-changed' : ''}`}
            >
              <div className="equipment-header">
                <div className="slot-name">{slotName}</div>
                <div className="item-name">{item.Name}</div>
                {hasChanged && <div className="changed-marker">변경됨</div>}
              </div>
              <div className="equipment-details">
                {options.accessory.showImages && item.Icon && (
                  <div className="item-icon">
                    <img src={item.IconUrl || getIconUrl(item.Icon)} alt={item.Name} />
                  </div>
                )}
                {options.accessory.showGrade && item.Grade && <div>등급: {item.Grade}</div>}
                {options.accessory.showQuality && item.품질 && (
                  <div>
                    품질: {item.품질}
                    {hasChanged && oldItem.품질 && oldItem.품질 !== item.품질 && (
                      <span className={`change-value ${item.품질 > oldItem.품질 ? 'positive' : 'negative'}`}>
                        ({oldItem.품질} → {item.품질})
                      </span>
                    )}
                  </div>
                )}
                {/* 연마 효과 */}
                {item['연마 효과'] && Array.isArray(item['연마 효과']) && (
                  <div className="polish-effects">
                    <div className="effect-title">연마 효과:</div>
                    {item['연마 효과'].map((effect, idx) => (
                      <div key={idx} className="polish-effect">
                        {effect[0]}: {effect[1]}{effect[2]}
                      </div>
                    ))}
                  </div>
                )}
                {/* 기본 옵션 */}
                {item['기본옵'] && Array.isArray(item['기본옵']) && (
                  <div className="base-options">
                    <div className="effect-title">기본 옵션:</div>
                    {item['기본옵'].map((opt, idx) => (
                      <div key={idx} className="base-option">
                        {opt[0]}: +{opt[1]}
                      </div>
                    ))}
                  </div>
                )}
                {/* 특수 옵션 */}
                {item['특옵'] && Array.isArray(item['특옵']) && (
                  <div className="special-options">
                    <div className="effect-title">특수 옵션:</div>
                    {item['특옵'].map((opt, idx) => (
                      <div key={idx} className="special-option">
                        {opt[0]}{opt.length > 1 ? ` Lv.${opt[1]}` : ''}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* 이전 데이터와 비교했을 때 툴팁 표시 */}
                {hasChanged && (
                  <div className="item-tooltip">
                    <div className="tooltip-title">이전 아이템 정보</div>
                    <div className="tooltip-content">
                      <div><strong>이름:</strong> {oldItem.Name}</div>
                      {oldItem.Grade && <div><strong>등급:</strong> {oldItem.Grade}</div>}
                      {oldItem.품질 && <div><strong>품질:</strong> {oldItem.품질}</div>}
                      {oldItem['연마 효과'] && Array.isArray(oldItem['연마 효과']) && (
                        <div>
                          <strong>연마 효과:</strong>
                          {oldItem['연마 효과'].map((effect, idx) => (
                            <div key={idx}>{effect[0]}: {effect[1]}{effect[2]}</div>
                          ))}
                        </div>
                      )}
                      {oldItem['기본옵'] && Array.isArray(oldItem['기본옵']) && (
                        <div>
                          <strong>기본 옵션:</strong>
                          {oldItem['기본옵'].map((opt, idx) => (
                            <div key={idx}>{opt[0]}: +{opt[1]}</div>
                          ))}
                        </div>
                      )}
                      {oldItem['특옵'] && Array.isArray(oldItem['특옵']) && (
                        <div>
                          <strong>특수 옵션:</strong>
                          {oldItem['특옵'].map((opt, idx) => (
                            <div key={idx}>{opt[0]}{opt.length > 1 ? ` Lv.${opt[1]}` : ''}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccessorySection;