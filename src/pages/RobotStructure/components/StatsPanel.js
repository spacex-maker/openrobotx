import React from 'react';
import {
  StatsPanel as StatsPanelStyled,
  StatsTitle,
  StatsGrid,
  StatBox,
} from './styles';

export default function StatsPanel({
  isZh = true,
  layers = [],
  systems = [],
  subNodes = [],
  microNodes = [],
  crossConnections = [],
  subConnections = [],
  microConnections = [],
  crossLayerConnections = [],
  getNodeConnectivity = {},
  keyNodes = [],
}) {
  const totalNodes = layers.length + systems.length + subNodes.length + microNodes.length + 1;
  const totalConns = crossConnections.length + subConnections.length + microConnections.length + (crossLayerConnections?.length || 0);
  const avgConnectivity =
    totalNodes > 0
      ? (totalConns / totalNodes).toFixed(1)
      : '0';

  const topNodes = Object.entries(getNodeConnectivity)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  const allNodes = [...systems, ...subNodes, ...microNodes];
  const nodeTitle = (n) => (isZh ? n.titleZh : n.titleEn) || n.titleZh || n.id;

  return (
    <StatsPanelStyled>
      <StatsTitle>{isZh ? '网络统计' : 'Network Stats'}</StatsTitle>
      <StatsGrid>
        <StatBox $color="#00d4aa">
          <div className="value">{layers.length}</div>
          <div className="label">{isZh ? '主层级' : 'Layers'}</div>
        </StatBox>
        <StatBox $color="#5ee7df">
          <div className="value">{systems.length}</div>
          <div className="label">{isZh ? '二级系统' : 'Systems'}</div>
        </StatBox>
        <StatBox $color="#fbbf24">
          <div className="value">{subNodes.length}</div>
          <div className="label">{isZh ? '三级组件' : 'Sub-nodes'}</div>
        </StatBox>
        <StatBox $color="#fb923c">
          <div className="value">{microNodes.length}</div>
          <div className="label">{isZh ? '四级微节点' : 'Micro-nodes'}</div>
        </StatBox>
        <StatBox $color="#f472b6">
          <div className="value">{totalNodes}</div>
          <div className="label">{isZh ? '总节点数' : 'Total Nodes'}</div>
        </StatBox>
        <StatBox $color="#a78bfa">
          <div className="value">{totalConns}</div>
          <div className="label">{isZh ? '总连接数' : 'Total Conns'}</div>
        </StatBox>
      </StatsGrid>
      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px' }}>{isZh ? '网络复杂度：' : 'Complexity:'}</div>
        <div style={{ fontSize: '11px', color: '#b0b3b8', marginBottom: '3px', display: 'flex', justifyContent: 'space-between' }}>
          <span>{isZh ? '跨层连接' : 'Cross'}</span>
          <span style={{ color: '#00d4aa', fontWeight: '600' }}>{crossConnections.length}</span>
        </div>
        <div style={{ fontSize: '11px', color: '#b0b3b8', marginBottom: '3px', display: 'flex', justifyContent: 'space-between' }}>
          <span>{isZh ? '组件间连接' : 'Sub'}</span>
          <span style={{ color: '#00d4aa', fontWeight: '600' }}>{subConnections.length}</span>
        </div>
        <div style={{ fontSize: '11px', color: '#b0b3b8', marginBottom: '3px', display: 'flex', justifyContent: 'space-between' }}>
          <span>{isZh ? '微节点连接' : 'Micro'}</span>
          <span style={{ color: '#00d4aa', fontWeight: '600' }}>{microConnections.length}</span>
        </div>
        <div style={{ fontSize: '11px', color: '#b0b3b8', marginBottom: '3px', display: 'flex', justifyContent: 'space-between' }}>
          <span>{isZh ? '跨层连接' : 'Cross-layer'}</span>
          <span style={{ color: '#a78bfa', fontWeight: '600' }}>{crossLayerConnections?.length ?? 0}</span>
        </div>
        <div style={{ fontSize: '11px', color: '#b0b3b8', marginBottom: '3px', display: 'flex', justifyContent: 'space-between' }}>
          <span>{isZh ? '平均连接度' : 'Avg degree'}</span>
          <span style={{ color: '#00d4aa', fontWeight: '600' }}>{avgConnectivity}</span>
        </div>
        <div style={{ fontSize: '11px', color: '#b0b3b8', marginBottom: '3px', display: 'flex', justifyContent: 'space-between' }}>
          <span>{isZh ? '关键节点 ★' : 'Key nodes ★'}</span>
          <span style={{ color: '#fbbf24', fontWeight: '600' }}>{keyNodes.length}</span>
        </div>
        <div style={{ fontSize: '11px', color: '#b0b3b8', marginBottom: '3px', display: 'flex', justifyContent: 'space-between' }}>
          <span>{isZh ? '网络深度' : 'Depth'}</span>
          <span style={{ color: '#00d4aa', fontWeight: '600' }}>5</span>
        </div>
      </div>
      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px' }}>{isZh ? 'Top 关键节点：' : 'Top key nodes:'}</div>
        {topNodes.map(([nodeId, count]) => {
          const node = allNodes.find((n) => n.id === nodeId);
          if (!node) return null;
          return (
            <div
              key={nodeId}
              style={{
                fontSize: '11px',
                color: '#b0b3b8',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ color: node.color }}>●</span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {nodeTitle(node)}
              </span>
              <span
                style={{
                  color: count > 8 ? '#ef4444' : count > 5 ? '#f59e0b' : '#00d4aa',
                  fontWeight: '600',
                  fontSize: '10px',
                  background: count > 8 ? '#ef444420' : count > 5 ? '#f59e0b20' : '#00d4aa20',
                  padding: '2px 6px',
                  borderRadius: '3px',
                }}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </StatsPanelStyled>
  );
}
