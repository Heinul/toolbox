import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { formatShortDate } from '../../utils/dateUtils';

/**
 * 환산 점수 변화를 보여주는 그래프 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Array} props.data - 그래프에 표시할 데이터 배열
 * @param {Function} props.onSelectDate - 날짜 선택 이벤트 핸들러
 * @param {Array} props.selectedDates - 선택된 날짜 배열
 * @param {boolean} props.minimized - 그래프의 최소화 상태
 * @returns {JSX.Element} - 환산 점수 그래프 컴포넌트
 */
const ScoreGraph = ({ data, onSelectDate, selectedDates = [], minimized = false }) => {
  // 그래프 데이터 포맷 변환
  const chartData = data.map(item => ({
    name: formatShortDate(item.date),
    점수: item.score,
    date: item.date,
    id: item.id
  }));

  // 선택된 날짜의 ID 배열 생성
  const selectedIds = selectedDates.map(date => date.id);

  // 커스텀 툴팁 컴포넌트
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="score-tooltip">
          <p className="date">{label}</p>
          <p className="score">점수: {payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  // 그래프의 높이 계산 (최소화 상태에 따라 다름)
  const graphHeight = minimized ? 150 : 300;

  // 선택된 날짜 강조를 위한 스타일 생성
  const getPointStyle = (entry) => {
    const isSelected = selectedIds.includes(entry.id);
    return {
      fill: isSelected ? '#ff5252' : '#8884d8',
      stroke: isSelected ? '#ff0000' : '#8884d8',
      strokeWidth: isSelected ? 3 : 1,
      r: isSelected ? 8 : 4
    };
  };

  return (
    <div className={`score-graph-container ${minimized ? 'minimized' : ''}`}>
      <ResponsiveContainer width="100%" height={graphHeight}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name"
            height={50}
            tick={{ fontSize: minimized ? 10 : 12 }}
          />
          <YAxis 
            domain={['auto', 'auto']}
            tick={{ fontSize: minimized ? 10 : 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="점수"
            stroke="#8884d8"
            activeDot={(props) => {
              const { cx, cy, stroke, key, index } = props;
              const entry = chartData[index];
              const style = getPointStyle(entry);
              return (
                <circle
                  key={key}
                  cx={cx}
                  cy={cy}
                  r={style.r}
                  stroke={style.stroke}
                  strokeWidth={style.strokeWidth}
                  fill={style.fill}
                  onClick={() => onSelectDate(entry.id)}
                  style={{ cursor: 'pointer' }}
                />
              );
            }}
            dot={(props) => {
              const { cx, cy, stroke, key, index } = props;
              const entry = chartData[index];
              const style = getPointStyle(entry);
              return (
                <circle
                  key={key}
                  cx={cx}
                  cy={cy}
                  r={style.r}
                  stroke={style.stroke}
                  strokeWidth={style.strokeWidth}
                  fill={style.fill}
                  onClick={() => onSelectDate(entry.id)}
                  style={{ cursor: 'pointer' }}
                />
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreGraph;
