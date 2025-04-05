import React from 'react';
import { getIconUrl } from '../../../utils/imageUtils';

const GemsSection = ({ newData, oldData, hasComparison }) => {
  if (!newData.display || !newData.display.gem) {
    return null;
  }

  // 현재 및 이전 보석 그룹화
  const currentGroupedGems = newData.display.gem.reduce((acc, gem) => {
    if (!acc[gem[4]]) acc[gem[4]] = [];
    acc[gem[4]].push(gem);
    return acc;
  }, {});

  const oldGroupedGems = hasComparison && oldData.display && oldData.display.gem 
    ? oldData.display.gem.reduce((acc, gem) => {
        if (!acc[gem[4]]) acc[gem[4]] = [];
        acc[gem[4]].push(gem);
        return acc;
      }, {})
    : {};

  return (
    <div className="data-gems">
      <h4>보석 정보</h4>
      <div className="gems-skills-container">
        {/* 현재 보석 렌더링 */}
        {Object.entries(currentGroupedGems).map(([skillName, gems]) => (
          <div 
            key={skillName} 
            className={`gems-skill-group ${
              hasComparison && !oldGroupedGems[skillName] ? 'new-skill-group' : ''
            }`}
          >
            <div className="skill-name">
              {skillName}
              {hasComparison && !oldGroupedGems[skillName] && (
                <span className="new-tag">NEW</span>
              )}
            </div>
            <div className="skill-gems">
              {gems.map((gem, index) => {
                const oldGemInSkill = hasComparison && oldGroupedGems[skillName] 
                  ? oldGroupedGems[skillName].find(
                      oldGem => oldGem[2] === gem[2] && oldGem[1] === gem[1]
                    )
                  : null;

                return (
                  <div 
                    key={index} 
                    className={`gem-item ${!oldGemInSkill && hasComparison ? 'new-gem' : ''}`}
                  >
                    {gem[5] && (
                      <div className="gem-icon">
                        <img src={getIconUrl(gem[5])} alt={gem[2]} />
                      </div>
                    )}
                    <div className="gem-details">
                      <span className="gem-level">{gem[1]}레벨</span>
                      <span className="gem-type">{gem[2]}</span>
                      {!oldGemInSkill && hasComparison && <span className="new-tag">NEW</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* 삭제된 보석 스킬 렌더링 */}
        {hasComparison && Object.entries(oldGroupedGems)
          .filter(([skillName]) => !currentGroupedGems[skillName])
          .map(([skillName, gems]) => (
            <div key={skillName} className="gems-skill-group removed-skill-group">
              <div className="skill-name">{skillName}</div>
              <div className="skill-gems">
                {gems.map((gem, index) => (
                  <div key={index} className="gem-item removed-gem">
                    {gem[5] && (
                      <div className="gem-icon">
                        <img src={getIconUrl(gem[5])} alt={gem[2]} />
                      </div>
                    )}
                    <div className="gem-details">
                      <span className="gem-level">{gem[1]}레벨</span>
                      <span className="gem-type">{gem[2]}</span>
                      <span className="removed-tag">삭제됨</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default GemsSection;