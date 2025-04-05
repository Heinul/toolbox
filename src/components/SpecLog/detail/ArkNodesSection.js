import React from 'react';
import { getIconUrl } from '../../../utils/imageUtils';

const ArkNodesSection = ({ newData, oldData, hasComparison }) => {
  if (!newData.display || !newData.display.arkp) {
    return null;
  }

  return (
    <div className="data-arkp">
      <h4>아크 노드 정보</h4>
      <div className="arkp-section">
        {newData.display.arkp.points && Object.entries(newData.display.arkp.points).map(([nodeType, points]) => (
          <div key={nodeType} className="arkp-points">
            <div className="node-type">{nodeType}</div>
            <div className="node-points">{points} 포인트</div>
          </div>
        ))}
      </div>
      
      <div className="arkp-nodes-container">
        {newData.display.arkp.nodes && Object.entries(newData.display.arkp.nodes).map(([nodeType, tiers]) => (
          <div key={nodeType} className="arkp-nodes">
            <h5>{nodeType} 노드</h5>
            <div className="tiers-container">
              {Object.entries(tiers).map(([tier, nodes]) => (
                <div key={tier} className="tier-group">
                  <div className="tier-name">{tier}</div>
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
        ))}
      </div>
    </div>
  );
};

export default ArkNodesSection;