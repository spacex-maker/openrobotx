import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';

export const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const rotateRev = keyframes`
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
`;

export const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 212, 170, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(0, 212, 170, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 212, 170, 0); }
`;

export const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

export const scan = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 0% 100%; }
`;

export const waveMove = keyframes`
  0% { transform: translateX(0) translateY(0); }
  100% { transform: translateX(-50%) translateY(10%); }
`;

export const glowPulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
`;

export const particleFloat = keyframes`
  0% { transform: translate(0, 0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)); opacity: 0; }
`;

export const PageWrap = styled.div`
  min-height: 100vh;
  background: #05080f;
  color: #e8eaed;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  padding-top: 72px;
  overflow: hidden;
  position: relative;
`;

export const NetworkStage = styled.div`
  position: relative;
  width: 100%;
  height: calc(100vh - 72px);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  perspective: 1000px;
  background: radial-gradient(circle at center, #111620 0%, #05080f 80%);
  user-select: none;
`;

export const GridFloor = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 212, 170, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 170, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: ${scan} 20s linear infinite;
  pointer-events: none;
`;

export const GridFloor2 = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(164, 139, 250, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(164, 139, 250, 0.02) 1px, transparent 1px);
  background-size: 80px 80px;
  animation: ${scan} 40s linear infinite reverse;
  pointer-events: none;
`;

export const WaveLayer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 212, 170, 0.03) 100%);
  animation: ${waveMove} 15s ease-in-out infinite;
  pointer-events: none;
`;

export const ParticleCanvas = styled.canvas`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

export const OrbitRing = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: ${(props) => (props.$size != null ? props.$size * 2 : 260)}px;
  height: ${(props) => (props.$size != null ? props.$size * 2 : 260)}px;
  margin-left: ${(props) => (props.$size != null ? -props.$size : -130)}px;
  margin-top: ${(props) => (props.$size != null ? -props.$size : -130)}px;
  border: 1px solid ${(props) => props.$color || 'rgba(255,255,255,0.3)'};
  border-radius: 50%;
  animation: ${(props) => css`${rotate} ${props.$speed || 60}s linear infinite`};
  pointer-events: none;
`;

export const GlowOrb = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  left: 50%;
  top: 50%;
  margin-left: -150px;
  margin-top: -150px;
  border-radius: 50%;
  background: radial-gradient(circle, ${props => props.$color}30 0%, transparent 70%);
  animation: ${float} ${props => props.$duration || 5}s ease-in-out infinite;
  pointer-events: none;
`;

export const SvgLayer = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

export const DataParticle = styled(motion.circle)`
  fill: ${props => props.$color};
`;

export const FlowPath = styled(motion.path)`
  fill: none;
  stroke: ${props => props.$color};
  stroke-width: 1.5;
  opacity: 0.6;
`;

export const StaticPath = styled.path`
  fill: none;
  stroke: ${props => props.$color};
  stroke-width: 1;
  opacity: 0.3;
`;

export const NodeContainer = styled(motion.div)`
  position: absolute;
  z-index: 10;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const TechNodeCircle = styled(motion.div)`
  width: ${props => props.$size || 60}px;
  height: ${props => props.$size || 60}px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color};
  font-size: ${props => props.$iconSize || 24}px;
  background: rgba(10, 14, 23, 0.6);
  backdrop-filter: blur(4px);
  border-radius: 50%;
  box-shadow: 0 0 15px ${props => props.$color}20;
  transition: all 0.3s ease;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(circle, ${props => props.$color}10 0%, transparent 70%);
  }
  &::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 1px solid transparent;
    border-top-color: ${props => props.$color};
    border-bottom-color: ${props => props.$color};
    animation: ${rotate} 10s linear infinite;
    opacity: 0.5;
  }
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 30px ${props => props.$color}60;
    background: rgba(10, 14, 23, 0.9);
    z-index: 20;
    &::after {
      border-color: ${props => props.$color};
      animation-duration: 2s;
      opacity: 1;
    }
  }
`;

export const CoreNodeCircle = styled(TechNodeCircle)`
  background: radial-gradient(circle, #fff 0%, #e0e0e0 100%);
  color: #0a0e17;
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.4), 0 0 80px rgba(0, 212, 170, 0.2);
  &::after {
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-left-color: transparent;
    border-right-color: transparent;
    animation: ${rotateRev} 15s linear infinite;
  }
  &::before {
    animation: ${pulse} 2s ease-out infinite;
  }
  &:hover {
    box-shadow: 0 0 60px rgba(255, 255, 255, 0.6), 0 0 100px rgba(0, 212, 170, 0.4);
  }
`;

export const SubNodeCircle = styled(TechNodeCircle)`
  background: rgba(10, 14, 23, 0.4);
  border: 1px solid ${props => props.$color}40;
  &::after { display: none; }
  &::before {
    background: radial-gradient(circle, ${props => props.$color}05 0%, transparent 70%);
  }
  &:hover {
    background: rgba(10, 14, 23, 0.7);
    border-color: ${props => props.$color}80;
  }
`;

export const NodeLabel = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: ${props => props.$active ? '#fff' : 'rgba(255, 255, 255, 0.7)'};
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0,0,0,0.8);
  background: rgba(0,0,0,0.7);
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid ${props => props.$active ? props.$color : 'transparent'};
  transition: all 0.3s;
  pointer-events: none;
  white-space: nowrap;
`;

export const PanelContainer = styled(motion.div)`
  position: absolute;
  top: 76px; /* 72px 留出 header 高度，+4px 与内容区对齐，避免遮挡 header */
  right: 20px;
  bottom: 20px;
  width: 380px;
  background: rgba(13, 17, 26, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  z-index: 90;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.6);
  @media (max-width: 768px) {
    width: 100%;
    top: auto;
    right: 0;
    left: 0;
    bottom: 0;
    height: 65vh;
    border-radius: 20px 20px 0 0;
    border-bottom: none;
  }
`;

export const PanelHeader = styled.div`
  padding: 20px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;
`;

export const PanelIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 12px;
  box-shadow: 0 0 20px ${props => props.$color}10;
`;

export const PanelTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  line-height: 1.2;
`;

export const PanelSubtitle = styled.div`
  font-size: 10px;
  color: ${props => props.$color};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 6px;
  opacity: 0.8;
`;

export const CloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  transition: all 0.2s;
  font-size: 18px;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
`;

export const PanelContent = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 2px; }
`;

export const Description = styled.p`
  font-size: 13px;
  line-height: 1.6;
  color: #b0b3b8;
  margin-bottom: 20px;
`;

export const FeatureGrid = styled.div`
  display: grid;
  gap: 8px;
`;

export const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: ${props => props.$color}40;
    transform: translateX(4px);
  }
  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${props => props.$color};
    box-shadow: 0 0 8px ${props => props.$color};
  }
  .text { font-size: 12px; color: #e8eaed; }
`;

export const StatsRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

export const StatItem = styled.div`
  flex: 1;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  .val { font-size: 16px; font-weight: 700; color: ${props => props.$color}; margin-bottom: 4px; }
  .label { font-size: 10px; color: #6b7280; text-transform: uppercase; }
`;

export const ControlPanel = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(13, 17, 26, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 12px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 220px;
  @media (max-width: 768px) {
    top: 80px;
    left: 10px;
    right: 10px;
    width: auto;
  }
`;

export const ControlTitle = styled.h3`
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const ToggleOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 5px 6px;
  border-radius: 5px;
  transition: background 0.2s;
  &:hover { background: rgba(255, 255, 255, 0.05); }
  input[type="checkbox"] {
    width: 14px;
    height: 14px;
    cursor: pointer;
    accent-color: #00d4aa;
    flex-shrink: 0;
  }
  span { font-size: 11px; color: rgba(255, 255, 255, 0.8); flex: 1; }
`;

export const ViewModeButton = styled.button`
  background: ${props => props.$active ? '#00d4aa' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.$active ? '#000' : 'rgba(255, 255, 255, 0.7)'};
  border: 1px solid ${props => props.$active ? '#00d4aa' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 5px;
  padding: 6px 8px;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
  &:hover {
    background: ${props => props.$active ? '#00d4aa' : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-1px);
  }
`;

export const ViewModeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
`;

export const ConnectionType = styled.div`
  font-size: 11px;
  color: ${props => props.$color};
  background: ${props => props.$color}15;
  padding: 2px 6px;
  border-radius: 3px;
  text-transform: uppercase;
  display: inline-block;
  margin-top: 8px;
`;

export const StatsPanel = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(13, 17, 26, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 12px;
  z-index: 100;
  width: 220px;
  @media (max-width: 768px) { display: none; }
`;

export const StatsTitle = styled.h3`
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

export const StatBox = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  padding: 8px;
  border-left: 2px solid ${props => props.$color};
  .value { font-size: 16px; font-weight: 700; color: ${props => props.$color}; margin-bottom: 3px; }
  .label { font-size: 9px; color: #6b7280; text-transform: uppercase; }
`;

export const ConnectionStrength = styled.div`
  width: ${props => props.$width}px;
  height: 3px;
  background: ${props => props.$color};
  border-radius: 2px;
  margin-left: 8px;
  display: inline-block;
  box-shadow: 0 0 6px ${props => props.$color};
`;

export const LegendPanel = styled.div`
  position: absolute;
  top: 20px;
  right: ${props => props.$panelOpen ? '420px' : '20px'};
  background: rgba(13, 17, 26, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 12px;
  z-index: 99;
  width: 180px;
  transition: right 0.3s ease;
  @media (max-width: 768px) { display: none; }
`;

export const SearchInput = styled.input`
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  padding: 6px 10px;
  color: #fff;
  font-size: 11px;
  outline: none;
  transition: all 0.2s;
  &:focus {
    border-color: #00d4aa;
    background: rgba(0, 0, 0, 0.4);
  }
  &::placeholder { color: rgba(255, 255, 255, 0.4); }
`;

export const FilterButton = styled.button`
  background: ${props => props.$active ? props.$color + '30' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.$active ? props.$color : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$active ? props.$color : 'rgba(255, 255, 255, 0.5)'};
  border-radius: 5px;
  padding: 4px 8px;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
  &:hover {
    border-color: ${props => props.$color};
    color: ${props => props.$color};
    background: ${props => props.$color}20;
  }
  .icon { font-size: 12px; }
`;

export const KeyNodeBadge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: #000;
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.6);
  animation: ${pulse} 2s ease-in-out infinite;
  z-index: 10;
`;

export const HeatIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
    if (props.$heat > 8) return '#ef4444';
    if (props.$heat > 5) return '#f59e0b';
    if (props.$heat > 3) return '#fbbf24';
    return '#00d4aa';
  }};
  box-shadow: 0 0 8px ${props => {
    if (props.$heat > 8) return '#ef4444';
    if (props.$heat > 5) return '#f59e0b';
    if (props.$heat > 3) return '#fbbf24';
    return '#00d4aa';
  }};
  position: absolute;
  top: -2px;
  left: -2px;
`;

export const ZoomHint = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(13, 17, 26, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 8px 12px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  @media (max-width: 768px) { display: none; }
`;

export const ZoomLevel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding-left: 10px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  .label { color: rgba(255, 255, 255, 0.5); font-size: 9px; }
  .value { font-weight: 700; color: #00d4aa; font-size: 10px; min-width: 40px; }
`;

export const AnalyzeButton = styled.button`
  width: 100%;
  background: rgba(13, 17, 26, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 8px 12px;
  color: #00d4aa;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
  &:hover {
    background: rgba(0, 212, 170, 0.1);
    border-color: #00d4aa;
    transform: translateY(-1px);
  }
`;

export const AnalysisPanel = styled(motion.div)`
  position: absolute;
  top: 20px;
  left: 252px;
  background: rgba(13, 17, 26, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px;
  z-index: 100;
  width: 220px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  @media (max-width: 768px) {
    top: 225px;
    left: 10px;
    right: 10px;
    max-height: 50vh;
  }
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 2px; }
`;

export const AnalysisSection = styled.div`
  margin-bottom: 10px;
  .section-title {
    font-size: 9px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

export const NodeConnectionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px;
  margin-bottom: 2px;
  background: ${props => {
    if (props.$count === 0) return 'rgba(239, 68, 68, 0.1)';
    if (props.$count < 3) return 'rgba(245, 158, 11, 0.1)';
    if (props.$count < 5) return 'rgba(251, 191, 36, 0.1)';
    return 'rgba(0, 212, 170, 0.1)';
  }};
  border-left: 2px solid ${props => {
    if (props.$count === 0) return '#ef4444';
    if (props.$count < 3) return '#f59e0b';
    if (props.$count < 5) return '#fbbf24';
    return '#00d4aa';
  }};
  border-radius: 3px;
  .name {
    font-size: 9px;
    color: #e8eaed;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .count {
    font-size: 9px;
    font-weight: 700;
    color: ${props => {
      if (props.$count === 0) return '#ef4444';
      if (props.$count < 3) return '#f59e0b';
      if (props.$count < 5) return '#fbbf24';
      return '#00d4aa';
    }};
    background: rgba(0, 0, 0, 0.3);
    padding: 1px 5px;
    border-radius: 3px;
    margin-left: 4px;
  }
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  .icon {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: ${props => props.$color}20;
    color: ${props => props.$color};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    flex-shrink: 0;
  }
  .info {
    flex: 1;
    min-width: 0;
    .name {
      font-size: 10px;
      font-weight: 600;
      color: #fff;
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .desc {
      font-size: 9px;
      color: #6b7280;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;
