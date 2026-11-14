import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, Cell, LabelList, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { FEE, breakEven, savingRate, directCost } from '../utils/gemMath';
import { logUserAction } from '../firebase/config';
import '../styles/GemCash.css';

const API_URL = 'https://developer-lostark.game.onstove.com/auctions/items';
const GEMS = [8, 9, 10].flatMap(level =>
  ['겁화', '작열'].map(type => ({ id: `${level}${type}`, level, type, name: `${level}레벨 ${type}의 보석` }))
);
const STORE_KEY = 'gemCash';

const load = () => {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; }
};
const fmt = v => Math.round(v).toLocaleString();

async function fetchLowest(apiKey, gem) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', authorization: `bearer ${apiKey}` },
    body: JSON.stringify({
      CategoryCode: 210000, ItemTier: 4, ItemName: gem.name,
      Sort: 'BUY_PRICE', SortCondition: 'ASC', PageNo: 1,
    }),
  });
  if (!res.ok) throw new Error(`${gem.name}: HTTP ${res.status}`);
  const data = await res.json();
  // 입찰 전용 매물은 BuyPrice가 없어서 즉시구매가가 있는 첫 매물을 씀
  const item = (data?.Items || []).find(i => i.Name === gem.name && i.AuctionInfo?.BuyPrice);
  return item ? item.AuctionInfo.BuyPrice : null;
}

function GemCash() {
  const saved = useMemo(load, []);
  const [apiKey, setApiKey] = useState(saved.apiKey || '');
  const [n, setN] = useState(saved.n ?? 6);
  const [cash, setCash] = useState(saved.cash || {});
  const [gold, setGold] = useState(saved.gold || {});
  const [status, setStatus] = useState('');

  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ apiKey, n, cash, gold })); } catch {}
  }, [apiKey, n, cash, gold]);

  const refresh = async () => {
    if (!apiKey) { setStatus('API 키를 먼저 입력하세요.'); return; }
    setStatus('시세 불러오는 중...');
    logUserAction('gem_price_fetch');
    const results = await Promise.allSettled(GEMS.map(g => fetchLowest(apiKey, g)));
    const next = { ...gold };
    const errors = [];
    results.forEach((r, i) => {
      if (r.status === 'fulfilled' && r.value) next[GEMS[i].id] = r.value;
      else errors.push(r.reason?.message || `${GEMS[i].name}: 매물 없음`);
    });
    setGold(next);
    setStatus(errors.length ? `일부 실패 - ${errors.join(', ')}` : `불러옴 (${new Date().toLocaleTimeString()})`);
  };

  // 현금가와 골드 시세가 둘 다 있는 보석만 계산
  const rows = GEMS.map(g => {
    const c = Number(cash[g.id]), p = Number(gold[g.id]);
    const ok = c > 0 && p > 0;
    return { ...g, c, p, ok, be: ok ? breakEven(c, p) : null };
  });
  const active = rows.filter(r => r.ok);
  const nNum = Number(n);

  // 손익분기 비율이 낮은(=싼) 보석이 위로 오게 정렬
  const chartData = nNum > 0
    ? active
      .map(r => {
        const rate = savingRate(r.c, r.p, nNum);
        return {
          name: r.name.replace('의 보석', ''), be: Number(r.be.toFixed(2)), gain: rate > 0,
          label: `${r.be.toFixed(2)}  ${Math.abs(rate * 100).toFixed(1)}% ${rate > 0 ? '절약' : '손해'}`,
        };
      })
      .sort((x, y) => x.be - y.be)
    : [];
  const xMax = Math.ceil(Math.max(nNum, ...chartData.map(d => d.be)) * 1.35);

  const setMap = setter => (id, v) => setter(m => ({ ...m, [id]: v }));

  return (
    <div className="gem-cash">
      <h2>보석 현금 효율</h2>
      <p className="gem-note">
        보석을 현금으로 사서 경매장에 팔 때와 골드를 직접 살 때(100골드:N원)를 비교합니다.
        비율은 판매 수수료 {FEE * 100}% 떼기 전 기준이라, 직접 구매 시세와 그대로 비교하면 됩니다.
      </p>

      <div className="gem-controls">
        <label>
          로스트아크 API 키
          <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value.trim())}
            placeholder="developer-lostark.game.onstove.com 에서 발급" />
        </label>
        <button className="btn" onClick={refresh}>최저가 불러오기</button>
        <label>
          직접 구매 시세 (100골드당 원)
          <input type="number" step="0.1" min="0" value={n} onChange={e => setN(e.target.value)} />
        </label>
      </div>
      {status && <p className="gem-status">{status}</p>}
      <p className="gem-hint">API 키는 이 브라우저에만 저장됩니다. 키가 없으면 골드 시세를 직접 입력해도 됩니다.</p>

      <div className="gem-table-wrap">
        <table className="gem-table">
          <thead>
            <tr>
              <th>보석</th><th>최저가 (골드)</th><th>현금가 (원)</th>
              <th>보석 경로 100:N</th><th>직접 구매 시 비용</th><th>절약</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const rate = r.ok && nNum > 0 ? savingRate(r.c, r.p, nNum) : null;
              return (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td><input type="number" value={gold[r.id] ?? ''} onChange={e => setMap(setGold)(r.id, e.target.value)} /></td>
                  <td><input type="number" value={cash[r.id] ?? ''} onChange={e => setMap(setCash)(r.id, e.target.value)} /></td>
                  <td>{r.ok ? `100:${r.be.toFixed(2)}` : '-'}</td>
                  <td>{r.ok && nNum > 0 ? `${fmt(directCost(r.p, nNum))}원` : '-'}</td>
                  <td className={rate == null ? '' : rate > 0 ? 'gain' : 'loss'}>
                    {rate == null ? '-' : `${(rate * 100).toFixed(1)}% (${fmt(directCost(r.p, nNum) - r.c)}원)`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="gem-hint">
        보석 경로 100:N 값이 손익분기점입니다. 직접 구매 시세가 이 값보다 높으면 보석이 이득입니다.
        실수령 골드는 최저가의 {100 - FEE * 100}%이고, 최저가보다 싸게 팔면 이득이 줄어듭니다.
      </p>

      {chartData.length > 0 && (
        <div className="gem-chart">
          <h3>보석별 100골드당 가격</h3>
          <ResponsiveContainer width="100%" height={chartData.length * 48 + 60}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, xMax]} tickFormatter={v => v.toFixed(1)}
                label={{ value: '100골드당 원', position: 'insideBottom', offset: -10 }} />
              <YAxis type="category" dataKey="name" width={90} />
              <Tooltip formatter={v => [`100:${v}`, '보석 경로']} />
              <Bar dataKey="be" barSize={26} isAnimationActive={false}>
                {chartData.map(d => <Cell key={d.name} fill={d.gain ? '#43a047' : '#e53935'} />)}
                <LabelList dataKey="label" position="right" fontSize={13} />
              </Bar>
              <ReferenceLine x={nNum} stroke="#000" strokeWidth={2}
                label={{ value: `직접 구매 ${nNum}`, position: 'top', fontSize: 13 }} />
            </BarChart>
          </ResponsiveContainer>
          <p className="gem-hint">막대가 검은 세로선(직접 구매 시세)보다 짧으면 보석으로 사는 게 이득입니다.</p>
        </div>
      )}

      <div className="gem-back">
        <Link to="/" className="btn">홈으로 돌아가기</Link>
      </div>
    </div>
  );
}

export default GemCash;
