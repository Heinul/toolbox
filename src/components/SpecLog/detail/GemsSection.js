import React from 'react';
import { getIconUrl } from '../../../utils/imageUtils';

const GemsSection = ({ newData }) => {
  if (!newData.display || !newData.display.gem) {
    return null;
  }

  return (
    <div className="data-gems">
      <h4>보석 정보</h4>
      <div className="gems-grid">
        {/* 스킬별로 보석 그룹화 */}
        {Object.entries(newData.display.gem.reduce((acc, gem) => {
          // 스킬명(gem[4])으로 그룹화
          if (!acc[gem[4]]) acc[gem[4]] = [];
          acc[gem[4]].push(gem);
          return acc;
        }, {})).map(([skillName, gems]) => (
          <div key={skillName} className="gem-skill-group">
            <div className="gem-skill-name">{skillName}</div>
            <div className="gem-list">
              {gems.map((gem, index) => (
                <div key={index} className="gem-item-small">
                  {gem[5] && (
                    <div className="gem-icon-small">
                      <img src={gem[7] || getIconUrl(gem[5])} alt={gem[2]} />
                    </div>
                  )}
                  <div className="gem-detail">
                    <span className="gem-level-small">{gem[1]}레벨</span>
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