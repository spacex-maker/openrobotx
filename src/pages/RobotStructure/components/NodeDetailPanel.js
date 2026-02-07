import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { CloseOutlined } from '@ant-design/icons';
import { renderIcon } from './constants';
import {
  PanelContainer,
  PanelHeader,
  PanelIcon,
  PanelTitle,
  PanelSubtitle,
  CloseBtn,
  PanelContent,
  Description,
  FeatureGrid,
  FeatureCard,
  StatsRow,
  StatItem,
  ConnectionType,
  ConnectionStrength,
} from './styles';

function findNodeById(id, systems, subNodes, microNodes, layers) {
  return (
    (systems || []).find((s) => s.id === id) ||
    (subNodes || []).find((s) => s.id === id) ||
    (microNodes || []).find((s) => s.id === id) ||
    (layers || []).find((s) => s.id === id)
  );
}

/** 用 layers/systems/subNodes/microNodes 构建 id -> node 映射，避免漏查导致协作关系少显示 */
function buildNodeMap(layers, systems, subNodes, microNodes) {
  const map = {};
  [...(layers || []), ...(systems || []), ...(subNodes || []), ...(microNodes || [])].forEach((n) => {
    if (n && n.id) map[n.id] = n;
  });
  return map;
}

export default function NodeDetailPanel({
  selectedNode,
  onClose,
  isZh = true,
  getNodeConnectivity = {},
  keyNodes = [],
  crossConnections = [],
  subConnections = [],
  microConnections = [],
  crossLayerConnections = [],
  layers = [],
  systems = [],
  subNodes = [],
  microNodes = [],
}) {
  if (!selectedNode) return null;
  const incomingConns = [
    ...(crossConnections || []).filter((c) => c.to === selectedNode.id),
    ...(subConnections || []).filter((c) => c.to === selectedNode.id),
    ...(microConnections || []).filter((c) => c.to === selectedNode.id),
    ...(crossLayerConnections || []).filter((c) => c.to === selectedNode.id),
  ];
  const outgoingConns = [
    ...(crossConnections || []).filter((c) => c.from === selectedNode.id),
    ...(subConnections || []).filter((c) => c.from === selectedNode.id),
    ...(microConnections || []).filter((c) => c.from === selectedNode.id),
    ...(crossLayerConnections || []).filter((c) => c.from === selectedNode.id),
  ];
  const nodeMap = buildNodeMap(layers, systems, subNodes, microNodes);
  const getDisplayName = (id) => (nodeMap[id] ? (isZh ? nodeMap[id].titleZh : nodeMap[id].titleEn) : null) || (nodeMap[id] && nodeMap[id].titleZh) || id;
  const title = (isZh ? selectedNode.titleZh : selectedNode.titleEn) || selectedNode.titleZh || selectedNode.id;
  const desc = (isZh ? selectedNode.descZh : selectedNode.descEn) || selectedNode.descZh || selectedNode.descEn || (isZh ? '暂无描述' : 'No description');

  return (
    <AnimatePresence>
      <PanelContainer
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        <PanelHeader>
          <CloseBtn onClick={onClose}>
            <CloseOutlined style={{ fontSize: 18 }} />
          </CloseBtn>
          <PanelIcon $color={selectedNode.color}>{renderIcon(selectedNode?.icon)}</PanelIcon>
          <PanelTitle>{title}</PanelTitle>
          <PanelSubtitle $color={selectedNode.color}>{isZh ? '系统详情' : 'System Details'}</PanelSubtitle>
        </PanelHeader>
        <PanelContent>
          <Description>{desc}</Description>
          {selectedNode.features && (
            <FeatureGrid>
              {selectedNode.features.map((feature, idx) => (
                <FeatureCard key={idx} $color={selectedNode.color}>
                  <div className="dot" />
                  <span className="text">{feature}</span>
                </FeatureCard>
              ))}
            </FeatureGrid>
          )}
          {selectedNode.stats && (
            <StatsRow>
              {Object.entries(selectedNode.stats).map(([key, val]) => (
                <StatItem key={key} $color={selectedNode.color}>
                  <div className="val">{val}</div>
                  <div className="label">{key}</div>
                </StatItem>
              ))}
            </StatsRow>
          )}
          {selectedNode.technologies && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '10px' }}>{isZh ? '关键技术' : 'Key Technologies'}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedNode.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '10px',
                      padding: '4px 8px',
                      background: `${selectedNode.color}15`,
                      border: `1px solid ${selectedNode.color}40`,
                      borderRadius: '4px',
                      color: '#e8eaed',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
          {selectedNode.applications && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '10px' }}>{isZh ? '应用场景' : 'Applications'}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedNode.applications.map((app, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '10px',
                      padding: '4px 8px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      color: '#b0b3b8',
                    }}
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          )}
          {selectedNode.specs && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '12px' }}>{isZh ? '技术规格' : 'Specs'}</div>
              <div style={{ display: 'grid', gap: '8px' }}>
                {Object.entries(selectedNode.specs).map(([key, val]) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '6px 10px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '4px',
                      fontSize: '11px',
                    }}
                  >
                    <span style={{ color: '#6b7280' }}>{key}</span>
                    <span style={{ color: '#e8eaed', fontWeight: '500' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {selectedNode.id !== 'core' && getNodeConnectivity[selectedNode.id] != null && (
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '12px' }}>{isZh ? '节点分析' : 'Node Analysis'}</div>
              <StatsRow>
                <StatItem $color={selectedNode.color}>
                  <div className="val">{getNodeConnectivity[selectedNode.id] || 0}</div>
                  <div className="label">{isZh ? '连接度' : 'Connectivity'}</div>
                </StatItem>
                <StatItem $color={selectedNode.color}>
                  <div className="val">{keyNodes.includes(selectedNode.id) ? (isZh ? '★ 关键' : '★ Key') : (isZh ? '普通' : 'Normal')}</div>
                  <div className="label">{isZh ? '类型' : 'Type'}</div>
                </StatItem>
              </StatsRow>
            </div>
          )}
          {selectedNode.id !== 'core' && (incomingConns.length > 0 || outgoingConns.length > 0) && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#fff', marginBottom: '10px' }}>
                {isZh ? '协作关系' : 'Collaboration'}{' '}
                <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 400 }}>
                  ({incomingConns.length + outgoingConns.length} {isZh ? '个连接' : 'connections'})
                </span>
              </div>
              {outgoingConns.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '5px' }}>
                    {isZh ? '输出到' : 'To'} ({outgoingConns.length})：
                  </div>
                  {outgoingConns.map((conn, idx) => (
                    <div
                      key={`out-${conn.from}-${conn.to}-${idx}`}
                      style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}
                    >
                      <span style={{ fontSize: '11px', color: '#b0b3b8' }}>→ {getDisplayName(conn.to)}</span>
                      {conn.type && <ConnectionType $color={conn.color}>{conn.type}</ConnectionType>}
                      <ConnectionStrength $width={(conn.weight || 1) * 15} $color={conn.color} />
                    </div>
                  ))}
                </div>
              )}
              {incomingConns.length > 0 && (
                <div>
                  <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '5px' }}>
                    {isZh ? '接收自' : 'From'} ({incomingConns.length})：
                  </div>
                  {incomingConns.map((conn, idx) => (
                    <div
                      key={`in-${conn.from}-${conn.to}-${idx}`}
                      style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}
                    >
                      <span style={{ fontSize: '11px', color: '#b0b3b8' }}>← {getDisplayName(conn.from)}</span>
                      {conn.type && <ConnectionType $color={conn.color}>{conn.type}</ConnectionType>}
                      <ConnectionStrength $width={(conn.weight || 1) * 15} $color={conn.color} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </PanelContent>
      </PanelContainer>
    </AnimatePresence>
  );
}
