import React from 'react';
import { formatDate } from '../../utils/dateUtils';
import { getIconUrl } from '../../utils/imageUtils';

/**
 * 캐릭터 데이터 세부 정보 표시 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.data - 표시할 캐릭터 데이터
 * @param {Object} props.comparison - 비교 데이터 (선택적)
 * @returns {JSX.Element} - 데이터 세부 정보 컴포넌트
 */
const DataDetail = ({ data, comparison = null }) => {
  if (!data) return <div className="no-data">표시할 데이터가 없습니다.</div>;

  // 비교 데이터 존재 여부 확인
  const hasComparison = comparison !== null;
  
  // 데이터 비교 정보 가공 - 좌측은 과거, 우측은 최신 데이터
  let oldData = null;
  let newData = null;
  
  if (hasComparison) {
    // 날짜 기준으로 더 오래된 데이터와 최신 데이터 구분
    const date1 = new Date(data.observed_at);
    const date2 = new Date(comparison.observed_at);
    
    if (date1 < date2) {
      oldData = data;
      newData = comparison;
    } else {
      oldData = comparison;
      newData = data;
    }
  } else {
    // 비교 데이터가 없으면 현재 데이터만 사용
    newData = data;
  }

  return (
    <div className="data-detail-container">
      <div className="data-header">
        <h3>{newData.charname} ({newData.class})</h3>
        <p>
          서버: {newData.server} 
          {hasComparison && (
            <span className="date-range">
              | 기간: {formatDate(oldData.observed_at)} ~ {formatDate(newData.observed_at)}
            </span>
          )}
          {!hasComparison && (
            <span>| 관측 시간: {formatDate(newData.observed_at)}</span>
          )}
          {newData.build && ` | 빌드: ${newData.build}`}
        </p>
      </div>

      <div className="data-summary">
        <div className="summary-item">
          <div className="item-label">아이템 레벨</div>
          <div className="item-value">
            {hasComparison ? (
              <>
                {oldData.temlv} → {newData.temlv}
                {(newData.temlv !== oldData.temlv) && (
                  <span className={`change-value ${newData.temlv > oldData.temlv ? 'positive' : 'negative'}`}>
                    ({newData.temlv > oldData.temlv ? '+' : ''}{(newData.temlv - oldData.temlv).toFixed(1)})
                  </span>
                )}
              </>
            ) : (
              newData.temlv
            )}
          </div>
        </div>
        
        <div className="summary-item">
          <div className="item-label">환산 점수</div>
          <div className="item-value">
            {hasComparison ? (
              <>
                {oldData.converted_zp.toFixed(2)} → {newData.converted_zp.toFixed(2)}
                {(newData.converted_zp !== oldData.converted_zp) && (
                  <span className={`change-value ${newData.converted_zp > oldData.converted_zp ? 'positive' : 'negative'}`}>
                    ({newData.converted_zp > oldData.converted_zp ? '+' : ''}{(newData.converted_zp - oldData.converted_zp).toFixed(2)})
                  </span>
                )}
              </>
            ) : (
              newData.converted_zp.toFixed(2)
            )}
          </div>
        </div>
        
        {newData.rank_total && (
          <div className="summary-item">
            <div className="item-label">전체 랭킹</div>
            <div className="item-value">{newData.rank_total}</div>
          </div>
        )}
        
        {newData.rank_class && (
          <div className="summary-item">
            <div className="item-label">클래스 랭킹</div>
            <div className="item-value">{newData.rank_class}</div>
          </div>
        )}
      </div>

      <div className="data-details">
        <h4>환산 점수 상세</h4>
        <div className="details-grid">
          {newData.receipt && Object.entries(newData.receipt).map(([key, value]) => (
            <div key={key} className="detail-item">
              <div className="item-label">{key}</div>
              <div className="item-value">
                {hasComparison && oldData.receipt && oldData.receipt[key] !== undefined ? (
                  <>
                    {typeof oldData.receipt[key] === 'number' ? oldData.receipt[key].toFixed(2) : oldData.receipt[key]}%
                    {' → '}
                    {typeof value === 'number' ? value.toFixed(2) : value}%
                    {(value !== oldData.receipt[key]) && (
                      <span className={`change-value ${value > oldData.receipt[key] ? 'positive' : 'negative'}`}>
                        ({value > oldData.receipt[key] ? '+' : ''}{(value - oldData.receipt[key]).toFixed(2)}%)
                      </span>
                    )}
                  </>
                ) : (
                  <>{typeof value === 'number' ? value.toFixed(2) : value}%</>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {newData.display && newData.display.arkp && (
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
      )}

      <div className="data-equipment">
        <h4>장비 정보</h4>
        {newData.display && newData.display.equipment && (
          <div className="equipment-grid">
            {Object.entries(newData.display.equipment).map(([slot, item]) => (
              <div key={slot} className="equipment-item">
                <div className="equipment-header">
                  <div className="slot-name">{slot}</div>
                  <div className="item-name">{item.Name}</div>
                </div>
                <div className="equipment-details">
                  {item.Icon && (
                    <div className="item-icon">
                      <img src={item.IconUrl || getIconUrl(item.Icon)} alt={item.Name} />
                    </div>
                  )}
                  {item.Grade && <div>등급: {item.Grade}</div>}
                  {item.품질 && <div>품질: {item.품질}</div>}
                  {item.재련 && <div>재련: +{item.재련}</div>}
                  {item.상급재련 && <div>상급 재련: +{item.상급재련}</div>}
                  {item.초월 && Array.isArray(item.초월) && (
                    <div>초월: {item.초월[0]}단계 {item.초월[1]}등급</div>
                  )}
                  {/* 악세사리 연마 효과 */}
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
                  {/* 팔찌 기본 옵션 */}
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
                  {/* 팔찌 특수 옵션 */}
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
                  {/* 엘릭서 레벨 */}
                  {item['엘릭서 레벨'] && Array.isArray(item['엘릭서 레벨']) && (
                    <div className="elixir-levels">
                      <div className="effect-title">엘릭서:</div>
                      {item['엘릭서 레벨'].map((elixir, idx) => (
                        <div key={idx} className="elixir-level">
                          {elixir[0]} Lv.{elixir[1]}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="data-gems">
        <h4>보석 정보</h4>
        {newData.display && newData.display.gem && (
          <div className="gems-grid">
            {newData.display.gem.map((gem, index) => (
              <div key={index} className="gem-item">
                <div className="gem-level">{gem[1]}레벨</div>
                {gem[5] && (
                  <div className="gem-icon">
                    <img src={gem[7] || getIconUrl(gem[5])} alt={gem[4]} />
                  </div>
                )}
                <div className="gem-info">
                  <div>{gem[2]} {gem[4]}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="data-engravings">
        <h4>각인 정보</h4>
        {newData.display && newData.display.engr && (
          <div className="engravings-list">
            {newData.display.engr.map((engr, index) => (
              <div key={index} className="engraving-item">
                <div className="engraving-name">{engr[0]}</div>
                <div className="engraving-level">
                  {engr[1][0] > 0 && `장착 ${engr[1][0]}`}
                  {engr[1][1] > 0 && ` 악세 ${engr[1][1]}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="data-cards">
        <h4>카드 정보</h4>
        {newData.display && newData.display.card && (
          <div className="cards-list">
            {Object.entries(newData.display.card).map(([cardName, level], index) => (
              <div key={index} className="card-item">
                <div className="card-name">{cardName}</div>
                <div className="card-level">{level}각</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataDetail;
