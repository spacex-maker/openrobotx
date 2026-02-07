import React from 'react';
import styled from 'styled-components';
import { renderIcon } from './constants';
import { LegendPanel as LegendPanelStyled, LegendItem } from './styles';

const ControlTitle = styled.h3`
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export default function LegendPanel({ layers = [], panelOpen, isZh = true }) {
  return (
    <LegendPanelStyled $panelOpen={panelOpen}>
      <ControlTitle>{isZh ? '层级说明' : 'Layers'}</ControlTitle>
      {(layers || []).map((layer) => (
        <LegendItem key={layer.id} $color={layer.color}>
          <div className="icon">{renderIcon(layer.icon)}</div>
          <div className="info">
            <div className="name">{isZh ? layer.titleZh : (layer.titleEn || layer.titleZh)}</div>
            <div className="desc">{isZh ? layer.titleEn : layer.titleZh}</div>
          </div>
        </LegendItem>
      ))}
    </LegendPanelStyled>
  );
}
