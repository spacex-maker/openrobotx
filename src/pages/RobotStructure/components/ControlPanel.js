import React from 'react';
import styled from 'styled-components';
import { renderIcon } from './constants';
import {
  ControlPanel as ControlPanelStyled,
  SearchInput,
  FilterButton,
  ViewModeGrid,
  ViewModeButton,
  ToggleOption,
  AnalyzeButton,
} from './styles';

const ControlTitle = styled.h3`
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export default function ControlPanel({
  isZh = true,
  layers,
  layerFilters,
  setLayerFilters,
  viewMode,
  setViewMode,
  showCrossConnections,
  setShowCrossConnections,
  showDataFlow,
  setShowDataFlow,
  showParticles,
  setShowParticles,
  showSubNodes,
  setShowSubNodes,
  showMicroNodes,
  setShowMicroNodes,
  showAnalysis,
  setShowAnalysis,
  searchTerm,
  setSearchTerm,
  subCount = 0,
  microCount = 0,
}) {
  return (
    <ControlPanelStyled>
      <ControlTitle>{isZh ? '网络拓扑控制' : 'Topology Control'}</ControlTitle>
      <SearchInput
        type="text"
        placeholder={isZh ? '搜索节点...' : 'Search nodes...'}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {(layers || []).map((layer) => (
          <FilterButton
            key={layer.id}
            $active={layerFilters[layer.id]}
            $color={layer.color}
            onClick={() => setLayerFilters((prev) => ({ ...prev, [layer.id]: !prev[layer.id] }))}
          >
            <span className="icon">{renderIcon(layer.icon)}</span>
            <span>{isZh ? layer.titleZh : (layer.titleEn || layer.titleZh)}</span>
          </FilterButton>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', marginTop: '8px' }} />
      <ViewModeGrid>
        <ViewModeButton $active={viewMode === 'simple'} onClick={() => setViewMode('simple')}>
          {isZh ? '简化' : 'Simple'}
        </ViewModeButton>
        <ViewModeButton $active={viewMode === 'full'} onClick={() => setViewMode('full')}>
          {isZh ? '完整' : 'Full'}
        </ViewModeButton>
        <ViewModeButton $active={viewMode === 'layer'} onClick={() => setViewMode('layer')}>
          {isZh ? '层级' : 'Layer'}
        </ViewModeButton>
        <ViewModeButton $active={viewMode === 'detailed'} onClick={() => setViewMode('detailed')}>
          {isZh ? '详细' : 'Detailed'}
        </ViewModeButton>
      </ViewModeGrid>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', marginTop: '2px' }}>
        <ToggleOption>
          <input
            type="checkbox"
            checked={showCrossConnections}
            onChange={(e) => setShowCrossConnections(e.target.checked)}
          />
          <span>{isZh ? '跨层级连接' : 'Cross-layer'}</span>
        </ToggleOption>
        <ToggleOption>
          <input
            type="checkbox"
            checked={showDataFlow}
            onChange={(e) => setShowDataFlow(e.target.checked)}
          />
          <span>{isZh ? '数据流动画' : 'Data flow'}</span>
        </ToggleOption>
        <ToggleOption>
          <input
            type="checkbox"
            checked={showParticles}
            onChange={(e) => setShowParticles(e.target.checked)}
          />
          <span>{isZh ? '粒子效果' : 'Particles'}</span>
        </ToggleOption>
        <ToggleOption>
          <input
            type="checkbox"
            checked={showSubNodes}
            onChange={(e) => setShowSubNodes(e.target.checked)}
          />
          <span>{isZh ? `显示子节点 (${subCount}个)` : `Sub-nodes (${subCount})`}</span>
        </ToggleOption>
        <ToggleOption>
          <input
            type="checkbox"
            checked={showMicroNodes}
            onChange={(e) => setShowMicroNodes(e.target.checked)}
          />
          <span>{isZh ? `显示微节点 (${microCount}个)` : `Micro (${microCount})`}</span>
        </ToggleOption>
      </div>
      <AnalyzeButton onClick={() => setShowAnalysis(!showAnalysis)}>
        {showAnalysis ? (isZh ? '✕ 关闭分析' : '✕ Close') : (isZh ? '📊 连接分析' : '📊 Analysis')}
      </AnalyzeButton>
      <div
        style={{
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.5)',
          lineHeight: '1.6',
        }}
      >
        <div>💡 {isZh ? '操作提示：' : 'Tips:'}</div>
        <div>• {isZh ? '滚轮：缩放视图' : 'Scroll: zoom'}</div>
        <div>• {isZh ? '右键拖动：移动画布' : 'Right-drag: pan'}</div>
        <div>• {isZh ? '中键拖动：移动画布' : 'Middle-drag: pan'}</div>
        <div>• {isZh ? '空格+左键：移动画布' : 'Space+left: pan'}</div>
      </div>
    </ControlPanelStyled>
  );
}
