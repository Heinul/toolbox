import React from 'react';
import { getIconUrl } from '../../../utils/imageUtils';

const ArkNodesSection = ({ newData, oldData, hasComparison }) => {
  if (!newData.display || !newData.display.arkp) {
    return null;
  }

  // 노드 타입 순서 지정 (깨달음, 도약, 진화 순)
  const nodeTypeOrder = ['깨달음', '도약', '진화'];
  
  // evo-karma(진화 레벨) 값 가져오기
  const evoKarma = newData.display['evo-karma'];
  const oldEvoKarma = hasComparison && oldData.display ? oldData.display['evo-karma'] : null;
  
  // 이전 데이터에 evo-karma가 없을 수 있으니 이를 고려
  const evoKarmaChanged = hasComparison && evoKarma !== undefined && oldEvoKarma !== undefined && evoKarma !== oldEvoKarma;

  return (
    <div className="data-arkp">
      <h4>아크 노드 정보</h4>
      
      <div className="arkp-nodes-container">
        {/* 깨달음 노드를 먼저 표시 */}
        {newData.display.arkp.nodes && newData.display.arkp.nodes['깨달음'] && (
          <div key="깨달음" className="arkp-nodes">
            <h5>
              깨달음 노드 ({newData.display.arkp.points && newData.display.arkp.points['깨달음']}P)
              {hasComparison && oldData.display && oldData.display.arkp && oldData.display.arkp.points && 
               oldData.display.arkp.points['깨달음'] !== undefined && 
               oldData.display.arkp.points['깨달음'] !== newData.display.arkp.points['깨달음'] && (
                <span className={`points-change ${newData.display.arkp.points['깨달음'] > oldData.display.arkp.points['깨달음'] ? 'positive' : 'negative'}`}>
                  ({oldData.display.arkp.points['깨달음']}P → {newData.display.arkp.points['깨달음']}P)
                </span>
              )}
            </h5>
            <div className="tiers-container">
              {Object.entries(newData.display.arkp.nodes['깨달음']).map(([tier, nodes]) => (
                <div key={tier} className="tier-group">
                  <div className="tier-header">
                    <div className="tier-name">{tier}</div>
                    
                    {/* 1티어일 때만 진화 레벨 표시 */}
                    {tier === '1티어' && evoKarma !== undefined && (
                      <div className="tier-evolution-level">
                        <div>
                          <span className="evolution-label">진화 레벨 추정치:</span>
                          <span className={`evolution-value ${evoKarmaChanged ? 'changed' : ''}`}>{evoKarma}</span>
                        </div>
                        {evoKarmaChanged && oldEvoKarma !== undefined && (
                          <div className="evolution-change-container">
                            <span className={`evolution-change ${Number(evoKarma) > Number(oldEvoKarma) ? 'positive' : Number(evoKarma) < Number(oldEvoKarma) ? 'negative' : 'neutral'}`}>
                              ({oldEvoKarma} → {evoKarma})
                            </span>
                          </div>
                        )}
                        {hasComparison && oldEvoKarma === undefined && evoKarma !== undefined && (
                          <div className="evolution-change-container">
                            <span className="evolution-change positive">
                              (새로운 데이터)
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="nodes-list">
                    {nodes.map((node, index) => (
                      <div key={index} className="node-item">
                        {node[2] && (
                          <div className="node-icon">
                            <img src={node[3] || getIconUrl(node[2])} alt={node[0]} />
                          </div>
                        )}
                        <div className="node-info">
                          <div className="node-name">{node[0]}</div>
                          <div className="node-level">Lv.{node[1]}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 나머지 노드 표시 */}
        {newData.display.arkp.nodes && nodeTypeOrder.filter(type => type !== '깨달음').map((nodeType) => {
          const tiers = newData.display.arkp.nodes[nodeType];
          if (!tiers) return null;

          return (
            <div key={nodeType} className="arkp-nodes">
              <h5>
                {nodeType} 노드 ({newData.display.arkp.points && newData.display.arkp.points[nodeType]}P)
                {hasComparison && oldData.display && oldData.display.arkp && oldData.display.arkp.points && 
                 oldData.display.arkp.points[nodeType] !== undefined && 
                 oldData.display.arkp.points[nodeType] !== newData.display.arkp.points[nodeType] && (
                  <span className={`points-change ${newData.display.arkp.points[nodeType] > oldData.display.arkp.points[nodeType] ? 'positive' : 'negative'}`}>
                    ({oldData.display.arkp.points[nodeType]}P → {newData.display.arkp.points[nodeType]}P)
                  </span>
                )}
              </h5>
              <div className="tiers-container">
                {Object.entries(tiers).map(([tier, nodes]) => (
                  <div key={tier} className="tier-group">
                    <div className="tier-header">
                      <div className="tier-name">{tier}</div>
                    </div>
                    <div className="nodes-list">
                      {nodes.map((node, index) => (
                        <div key={index} className="node-item">
                          {node[2] && (
                            <div className="node-icon">
                              <img src={node[3] || getIconUrl(node[2])} alt={node[0]} />
                            </div>
                          )}
                          <div className="node-info">
                            <div className="node-name">{node[0]}</div>
                            <div className="node-level">Lv.{node[1]}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArkNodesSection;