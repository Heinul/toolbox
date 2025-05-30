import React from 'react';
import { Link } from 'react-router-dom';
import { logUserAction } from '../firebase/config';

function Home() {
  const tools = [
    // {
    //   id: 'calculator',
    //   name: '계산기',
    //   description: '수를 입력받고 계산값을 보여주는 도구',
    //   path: '/calculator'
    // },
    {
      id: 'quality-reader',
      name: '품질 판독기',
      description: '장신구 품질 판독기',
      path: '/quality-reader'
    },
    {
      id: 'spec-log',
      name: '스펙로그',
      description: '스펙 로그 검색 기능',
      path: '/spec-log'
    }
    // 추후 다른 도구들을 여기에 추가할 수 있습니다
  ];

  return (
    <div>
      <h2>사용 가능한 도구</h2>
      <p>아래 도구들 중 하나를 선택하여 사용해보세요</p>
      
      <div className="tools-grid">
        {tools.map(tool => (
          <div key={tool.id} className="tool-card">
            <h3>{tool.name}</h3>
            <p>{tool.description}</p>
            <Link 
              to={tool.path} 
              className="btn"
              onClick={() => logUserAction('tool_selected', { toolId: tool.id, toolName: tool.name })}
            >
              사용하기
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
