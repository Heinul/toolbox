import React from 'react';
import { getIconUrl } from '../../../utils/imageUtils';

const EquipmentSection = ({ newData, oldData, hasComparison, options }) => {
  // 유효성 검사
  if (!newData || !newData.display || !newData.display.equipment || !options || !options.equipment) {
    return null;
  }
  return (
    <div className="equipment-section">
      <h5>장비</h5>
      <div className="equipment-grid">
        {[
          '투구', '어깨', '상의', '하의', '장갑', '무기'
        ].map(slotName => {
          if (!newData.display.equipment[slotName]) return null;
          const item = newData.display.equipment[slotName];
          
          // 까리하지 말라고 newData의 아이템만 사용
          const oldItem = hasComparison && oldData.display && oldData.display.equipment && oldData.display.equipment[slotName];
          const hasChanged = oldItem && (
            oldItem.Name !== item.Name ||
            oldItem.Grade !== item.Grade ||
            oldItem.품질 !== item.품질 ||
            oldItem.재련 !== item.재련 ||
            oldItem['상급 재련'] !== item['상급 재련'] ||
            JSON.stringify(oldItem.초월) !== JSON.stringify(item.초월) ||
            JSON.stringify(oldItem['엘릭서 레벨']) !== JSON.stringify(item['엘릭서 레벨'])
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
                {options.equipment.showImages && item.Icon && (
                  <div className="item-icon">
                    <img src={item.IconUrl || getIconUrl(item.Icon)} alt={item.Name} />
                  </div>
                )}
                {options.equipment.showGrade && item.Grade && <div>등급: {item.Grade}</div>}
                {options.equipment.showQuality && item.품질 && (
                  <div>
                    품질: {item.품질}
                    {hasChanged && oldItem.품질 && oldItem.품질 !== item.품질 && (
                      <span className={`change-value ${item.품질 > oldItem.품질 ? 'positive' : 'negative'}`}>
                        ({oldItem.품질} → {item.품질})
                      </span>
                    )}
                  </div>
                )}
                {options.equipment.showRefine && item.재련 && (
                  <div>
                    재련: +{item.재련}
                    {hasChanged && oldItem.재련 && oldItem.재련 !== item.재련 && (
                      <span className={`change-value ${item.재련 > oldItem.재련 ? 'positive' : 'negative'}`}>
                        (+{oldItem.재련} → +{item.재련})
                      </span>
                    )}
                  </div>
                )}
                {options.equipment.showHigherRefine && item['상급 재련'] && (
                  <div>
                    상급 재련: +{item['상급 재련']}
                    {hasChanged && oldItem['상급 재련'] && oldItem['상급 재련'] !== item['상급 재련'] && (
                      <span className={`change-value ${item['상급 재련'] > oldItem['상급 재련'] ? 'positive' : 'negative'}`}>
                        (+{oldItem['상급 재련']} → +{item['상급 재련']})
                      </span>
                    )}
                  </div>
                )}
                {options.equipment.showTranscendence && item.초월 && Array.isArray(item.초월) && (
                  <div>
                    초월: {item.초월[0]}단계 {item.초월[1]}등급
                    {hasChanged && oldItem.초월 && Array.isArray(oldItem.초월) && (
                      JSON.stringify(item.초월) !== JSON.stringify(oldItem.초월) && (
                        <span className="change-value">
                          ({oldItem.초월[0]}단계 {oldItem.초월[1]}등급 → {item.초월[0]}단계 {item.초월[1]}등급)
                        </span>
                      )
                    )}
                  </div>
                )}
                {/* 엘릭서 레벨 */}
                {options.equipment.showElixir && item['엘릭서 레벨'] && Array.isArray(item['엘릭서 레벨']) && (
                  <div className="elixir-levels">
                    <div className="effect-title">엘릭서:</div>
                    {item['엘릭서 레벨'].map((elixir, idx) => (
                      <div key={idx} className="elixir-level">
                        {elixir[0]} Lv.{elixir[1]}
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
                      {oldItem.재련 && <div><strong>재련:</strong> +{oldItem.재련}</div>}
                      {oldItem['상급 재련'] && <div><strong>상급 재련:</strong> +{oldItem['상급 재련']}</div>}
                      {oldItem.초월 && Array.isArray(oldItem.초월) && (
                        <div><strong>초월:</strong> {oldItem.초월[0]}단계 {oldItem.초월[1]}등급</div>
                      )}
                      {oldItem['엘릭서 레벨'] && Array.isArray(oldItem['엘릭서 레벨']) && (
                        <div>
                          <strong>엘릭서:</strong>
                          {oldItem['엘릭서 레벨'].map((elixir, idx) => (
                            <div key={idx}>{elixir[0]} Lv.{elixir[1]}</div>
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

export default EquipmentSection;