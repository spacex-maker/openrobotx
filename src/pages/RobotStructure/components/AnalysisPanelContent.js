import React from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  AnalysisPanel as AnalysisPanelStyled,
  AnalysisSection,
  NodeConnectionItem,
} from './styles';

function calculateConnections({ coreNode, layers, systems, subNodes, microNodes, crossConnections, subConnections, microConnections, crossLayerConnections }, isZh) {
  const allNodes = [coreNode, ...(layers || []), ...(systems || []), ...(subNodes || []), ...(microNodes || [])].filter(Boolean);
  return allNodes
    .map((node) => {
      let count = 0;
      if (node.id === 'core') count += (layers || []).length;
      if ((layers || []).find((l) => l.id === node.id)) {
        count += 1;
        count += (systems || []).filter((s) => s.parentId === node.id).length;
      }
      if ((systems || []).find((s) => s.id === node.id)) {
        count += 1;
        count += (subNodes || []).filter((sub) => sub.parentId === node.id).length;
      }
      if ((subNodes || []).find((s) => s.id === node.id)) {
        count += 1;
        count += (microNodes || []).filter((micro) => micro.parentId === node.id).length;
      }
      if ((microNodes || []).find((m) => m.id === node.id)) count += 1;
      (crossConnections || []).forEach((conn) => {
        if (conn.from === node.id || conn.to === node.id) count++;
      });
      (subConnections || []).forEach((conn) => {
        if (conn.from === node.id || conn.to === node.id) count++;
      });
      (microConnections || []).forEach((conn) => {
        if (conn.from === node.id || conn.to === node.id) count++;
      });
      (crossLayerConnections || []).forEach((conn) => {
        if (conn.from === node.id || conn.to === node.id) count++;
      });
      const name = (isZh ? node.titleZh : node.titleEn) || node.titleZh || node.id;
      return { id: node.id, name, count };
    })
    .sort((a, b) => a.count - b.count);
}

export default function AnalysisPanelContent({
  show,
  isZh = true,
  coreNode,
  layers,
  systems,
  subNodes,
  microNodes,
  crossConnections,
  subConnections,
  microConnections,
  crossLayerConnections,
}) {
  if (!show) return null;
  const connections = calculateConnections({
    coreNode,
    layers,
    systems,
    subNodes,
    microNodes,
    crossConnections,
    subConnections,
    microConnections,
    crossLayerConnections,
  }, isZh);
  const lowConnections = connections.filter((c) => c.count > 0 && c.count <= 3);
  const zeroConnections = connections.filter((c) => c.count === 0);
  const totalStructural = (layers || []).length + (systems || []).length + (subNodes || []).length + (microNodes || []).length;
  const totalConns =
    totalStructural +
    (crossConnections || []).length +
    (subConnections || []).length +
    (microConnections || []).length +
    (crossLayerConnections || []).length;
  const avgCount = connections.length ? (connections.reduce((sum, c) => sum + c.count, 0) / connections.length).toFixed(1) : '0';

  return (
    <AnimatePresence>
      <AnalysisPanelStyled
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <AnalysisSection>
          <div className="section-title">⚠️ {isZh ? `无连接 (${zeroConnections.length})` : `No connection (${zeroConnections.length})`}</div>
          {zeroConnections.length === 0 ? (
            <div style={{ fontSize: '9px', color: '#00d4aa', padding: '6px' }}>✓ {isZh ? '所有节点都有连接！' : 'All nodes connected!'}</div>
          ) : (
            zeroConnections.slice(0, 5).map((node) => (
              <NodeConnectionItem key={node.id} $count={node.count}>
                <span className="name">{node.name}</span>
                <span className="count">{node.count}</span>
              </NodeConnectionItem>
            ))
          )}
        </AnalysisSection>
        <AnalysisSection>
          <div className="section-title">📌 {isZh ? `连接较少 (${lowConnections.length})` : `Low (${lowConnections.length})`}</div>
          {lowConnections.slice(0, 8).map((node) => (
            <NodeConnectionItem key={node.id} $count={node.count}>
              <span className="name">{node.name}</span>
              <span className="count">{node.count}</span>
            </NodeConnectionItem>
          ))}
        </AnalysisSection>
        <AnalysisSection>
          <div className="section-title">📊 {isZh ? '统计' : 'Stats'}</div>
          <div style={{ fontSize: '9px', color: '#b0b3b8', lineHeight: '1.5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span>{isZh ? '总节点数：' : 'Nodes:'}</span>
              <span style={{ fontWeight: '600', color: '#fff' }}>{connections.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span>{isZh ? '层级连接：' : 'Structural:'}</span>
              <span style={{ fontWeight: '600', color: '#fff' }}>{totalStructural}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span>{isZh ? '跨层连接：' : 'Cross:'}</span>
              <span style={{ fontWeight: '600', color: '#fff' }}>{(crossConnections || []).length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span>{isZh ? '子节点连接：' : 'Sub:'}</span>
              <span style={{ fontWeight: '600', color: '#fff' }}>{(subConnections || []).length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span>{isZh ? '微节点连接：' : 'Micro:'}</span>
              <span style={{ fontWeight: '600', color: '#fff' }}>{(microConnections || []).length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span>{isZh ? '层间连接：' : 'Cross-layer:'}</span>
              <span style={{ fontWeight: '600', color: '#a78bfa' }}>{(crossLayerConnections || []).length}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '2px',
                paddingTop: '2px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <span>{isZh ? '总连接数：' : 'Total conns:'}</span>
              <span style={{ fontWeight: '700', color: '#00d4aa' }}>{totalConns}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{isZh ? '平均连接度：' : 'Avg degree:'}</span>
              <span style={{ fontWeight: '600', color: '#00d4aa' }}>{avgCount}</span>
            </div>
          </div>
        </AnalysisSection>
      </AnalysisPanelStyled>
    </AnimatePresence>
  );
}
