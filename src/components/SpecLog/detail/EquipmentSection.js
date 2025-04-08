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
          
          // 엘릭서 변경 여부 확인 함수
          const elixirChanged = (oldItem && oldItem['엘릭서 레벨'] && item['엘릭서 레벨']) ?
            JSON.stringify(oldItem['엘릭서 레벨']) !== JSON.stringify(item['엘릭서 레벨']) : false;
          
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
                    {item['엘릭서 레벨'].map((elixir, idx) => {
                      // 이전 엘릭서 데이터 확인
                      const oldElixirExists = hasChanged && oldItem && oldItem['엘릭서 레벨'] && 
                        Array.isArray(oldItem['엘릭서 레벨']) && idx < oldItem['엘릭서 레벨'].length;
                      
                      // 이전 엘릭서 데이터가 있으면 비교
                      const oldElixir = oldElixirExists ? oldItem['엘릭서 레벨'][idx] : null;
                      const elixirChanged = oldElixir && (oldElixir[0] !== elixir[0] || oldElixir[1] !== elixir[1]);
                      
                      return (
                        <div key={idx} className={`elixir-level ${elixirChanged ? 'item-changed' : ''}`}>
                          <div className="elixir-name">{elixir[0]} Lv.{elixir[1]}</div>
                          {elixirChanged && (
                            <div className={`elixir-change ${elixir[1] > oldElixir[1] ? 'positive' : elixir[1] < oldElixir[1] ? 'negative' : 'neutral'}`}>
                              {oldElixir[0]} Lv.{oldElixir[1]} → {elixir[0]} Lv.{elixir[1]}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    {/* 새로 추가된 엘릭서 표시 */}
                    {hasChanged && oldItem && oldItem['엘릭서 레벨'] && 
                      item['엘릭서 레벨'].length > oldItem['엘릭서 레벨'].length && (
                      <div className="elixir-change-note positive">새로운 엘릭서 효과가 추가되었습니다.</div>
                    )}
                    
                    {/* 삭제된 엘릭서 표시 */}
                    {hasChanged && oldItem && oldItem['엘릭서 레벨'] && 
                      oldItem['엘릭서 레벨'].length > item['엘릭서 레벨'].length && (
                      <div className="elixir-levels-removed">
                        <div className="elixir-change-note negative">제거된 엘릭서:</div>
                        {oldItem['엘릭서 레벨'].slice(item['엘릭서 레벨'].length).map((oldElixir, idx) => (
                          <div key={idx} className="elixir-level negative">
                            {oldElixir[0]} Lv.{oldElixir[1]}
                          </div>
                        ))}
                      </div>
                    )}
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
                        <div className="tooltip-elixir">
                          <strong>엘릭서:</strong>
                          <div className="tooltip-elixir-list">
                            {oldItem['엘릭서 레벨'].map((elixir, idx) => {
                              // 현재 아이템에서 동일한 이름의 엘릭서 찾기
                              const currentElixir = item['엘릭서 레벨'] && Array.isArray(item['엘릭서 레벨']) ?
                                item['엘릭서 레벨'].find(e => e[0] === elixir[0]) : null;
                              const elixirChanged = currentElixir && currentElixir[1] !== elixir[1];
                              const elixirRemoved = !currentElixir;
                              
                              return (
                                <div key={idx} className={`tooltip-elixir-item ${elixirChanged ? 'changed' : ''} ${elixirRemoved ? 'removed' : ''}`}>
                                  {elixir[0]} Lv.{elixir[1]}
                                  {elixirChanged && (
                                    <span className={`elixir-tooltip-change ${currentElixir[1] > elixir[1] ? 'positive' : currentElixir[1] < elixir[1] ? 'negative' : 'neutral'}`}>
                                      → {currentElixir[0]} Lv.{currentElixir[1]}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
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