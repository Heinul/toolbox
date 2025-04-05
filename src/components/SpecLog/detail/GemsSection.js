import React from 'react';
import { getIconUrl } from '../../../utils/imageUtils';

const GemsSection = ({ newData }) => {
  if (!newData.display || !newData.display.gem) {
    return null;
  }

  // 보석을 스킬별로 그룹화
  const groupedGems = newData.display.gem.reduce((acc, gem) => {
    // 스킬명(gem[4])으로 그룹화
    if (!acc[gem[4]]) acc[gem[4]] = [];
    acc[gem[4]].push(gem);
    return acc;
  }, {});

  return (
    <div className="data-gems">
      <h4>보석 정보</h4>
      <div className="gems-skills-container">
        {Object.entries(groupedGems).map(([skillName, gems]) => (
          <div key={skillName} className="gems-skill-group">
            <div className="skill-name">{skillName}</div>
            <div className="skill-gems">
              {gems.map((gem, index) => (
                <div key={index} className="gem-item">
                  {gem[5] && (
                    <div className="gem-icon">
                      <img src={gem[7] || getIconUrl(gem[5])} alt={gem[2]} />
                    </div>
                  )}
                  <div className="gem-details">
                    <span className="gem-level">{gem[1]}레벨</span>
                    <span className="gem-type">{gem[2]}</span>
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

export default GemsSection;