import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { Spin } from 'antd';
import { motion } from 'framer-motion';
import { useLocale } from '../../contexts/LocaleContext';
import AppHeader from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { PageContainer } from '../styles';
import { getHistoryEventList } from '../../api/openrobotx';
import { addImageCompressSuffix } from '../../utils/imageUtils';

const PageWrap = styled(PageContainer)`
  padding-top: 72px;
`;

const Hero = styled.section`
  padding: 56px 24px 40px;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  @media (max-width: 768px) {
    padding: 40px 16px 32px;
  }
`;

const HeroTitle = styled.h1`
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #fff;
  margin: 0 0 12px;
  line-height: 1.2;
`;

const HeroSubtitle = styled.p`
  font-size: 16px;
  color: #9aa0a6;
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.6;
`;

const TimelineSection = styled.section`
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px 80px;
  position: relative;
  @media (max-width: 768px) {
    padding: 16px 12px 64px;
  }
`;

// 生成大量随机粒子的函数
const generateParticles = (count, widthPercent = 100) => {
  const particles = [];
  const colors = [
    'rgba(0, 212, 170', // cyan
    'rgba(94, 231, 223', // light cyan
    'rgba(255, 255, 255', // white
  ];
  
  for (let i = 0; i < count; i++) {
    const x = Math.random() * widthPercent;
    const y = Math.random() * 100;
    const size = 0.5 + Math.random() * 1.5; // 0.5-2px
    const opacity = 0.3 + Math.random() * 0.6; // 0.3-0.9
    const color = colors[Math.floor(Math.random() * colors.length)];
    particles.push(
      `radial-gradient(circle at ${x}% ${y}%, ${color}, ${opacity}) ${size}px, transparent ${size}px)`
    );
  }
  return particles.join(',\n    ');
};

const TimelineParticles = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 150px;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 0;
  
  /* 密集粒子层1 - 400个粒子 */
  background-image: 
    ${generateParticles(400, 100)};
  background-size: 100% 100%;
  background-repeat: no-repeat;
  animation: particlesTwinkle1 8s ease-in-out infinite;
  
  @keyframes particlesTwinkle1 {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }
  
  @media (max-width: 768px) {
    left: 20px;
    transform: none;
  }
`;

const TimelineParticles2 = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 130px;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 0;
  
  /* 密集粒子层2 - 350个粒子，独立闪烁 */
  background-image: 
    ${generateParticles(350, 100)};
  background-size: 100% 100%;
  background-repeat: no-repeat;
  animation: particlesTwinkle2 6s ease-in-out infinite 1s;
  
  @keyframes particlesTwinkle2 {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.9; }
  }
  
  @media (max-width: 768px) {
    left: 20px;
    transform: none;
  }
`;

const TimelineParticles3 = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 110px;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 0;
  
  /* 核心密集层 - 300个更亮的粒子 */
  background-image: 
    ${generateParticles(300, 100)};
  background-size: 100% 100%;
  background-repeat: no-repeat;
  animation: particlesTwinkle3 5s ease-in-out infinite 2s;
  
  @keyframes particlesTwinkle3 {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  
  @media (max-width: 768px) {
    left: 20px;
    transform: none;
  }
`;

const TimelineParticles4 = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 140px;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 0;
  
  /* 额外粒子层4 - 300个粒子 */
  background-image: 
    ${generateParticles(300, 100)};
  background-size: 100% 100%;
  background-repeat: no-repeat;
  animation: particlesTwinkle4 7s ease-in-out infinite 0.5s;
  
  @keyframes particlesTwinkle4 {
    0%, 100% { opacity: 0.35; }
    50% { opacity: 0.85; }
  }
  
  @media (max-width: 768px) {
    left: 20px;
    transform: none;
  }
`;

const TimelineParticles5 = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 120px;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 0;
  
  /* 额外粒子层5 - 250个粒子 */
  background-image: 
    ${generateParticles(250, 100)};
  background-size: 100% 100%;
  background-repeat: no-repeat;
  animation: particlesTwinkle5 9s ease-in-out infinite 1.5s;
  
  @keyframes particlesTwinkle5 {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.75; }
  }
  
  @media (max-width: 768px) {
    left: 20px;
    transform: none;
  }
`;

// 生成超微小星尘粒子
const generateStardust = (count) => {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = 0.3 + Math.random() * 0.5; // 0.3-0.8px 超小粒子
    const opacity = 0.2 + Math.random() * 0.4; // 0.2-0.6 更透明
    const color = Math.random() > 0.5 ? 'rgba(0, 212, 170' : 'rgba(94, 231, 223';
    particles.push(
      `radial-gradient(circle at ${x}% ${y}%, ${color}, ${opacity}) ${size}px, transparent ${size}px)`
    );
  }
  return particles.join(',\n    ');
};

const TimelineStardust = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 160px;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 0;
  
  /* 星尘层1 - 500个超微小粒子，形成密集的星云感 */
  background-image: 
    ${generateStardust(500)};
  background-size: 100% 100%;
  background-repeat: no-repeat;
  animation: stardustFlow 10s ease-in-out infinite;
  
  @keyframes stardustFlow {
    0%, 100% { 
      opacity: 0.25;
      transform: translateX(-50%) translateY(0);
    }
    25% { 
      opacity: 0.4;
      transform: translateX(-50%) translateY(-5px);
    }
    50% { 
      opacity: 0.3;
      transform: translateX(-50%) translateY(0);
    }
    75% { 
      opacity: 0.45;
      transform: translateX(-50%) translateY(5px);
    }
  }
  
  @media (max-width: 768px) {
    left: 20px;
    transform: none;
  }
`;

const TimelineStardust2 = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 170px;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 0;
  
  /* 星尘层2 - 400个超微小粒子 */
  background-image: 
    ${generateStardust(400)};
  background-size: 100% 100%;
  background-repeat: no-repeat;
  animation: stardustFlow2 12s ease-in-out infinite 2s;
  
  @keyframes stardustFlow2 {
    0%, 100% { 
      opacity: 0.2;
      transform: translateX(-50%) translateY(0);
    }
    50% { 
      opacity: 0.35;
      transform: translateX(-50%) translateY(3px);
    }
  }
  
  @media (max-width: 768px) {
    left: 20px;
    transform: none;
  }
`;

const TimelineLine = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, transparent, rgba(0, 212, 170, 0.4) 10%, rgba(0, 212, 170, 0.6) 50%, rgba(0, 212, 170, 0.4) 90%, transparent);
  transform: translateX(-50%);
  
  /* 银河光晕层 */
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 20px;
    transform: translateX(-50%);
    background: radial-gradient(ellipse at center, 
      rgba(0, 212, 170, 0.15) 0%,
      rgba(0, 212, 170, 0.05) 40%,
      transparent 70%
    );
    filter: blur(8px);
    animation: galaxyPulse 4s ease-in-out infinite;
  }
  
  /* 核心轴线粒子层 - 400个高密度粒子 */
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 120px;
    transform: translateX(-50%);
    background-image: 
      ${generateParticles(400, 100)};
    background-size: 100% 100%;
    background-repeat: no-repeat;
    animation: galaxySparkle 8s ease-in-out infinite;
    pointer-events: none;
  }
  
  @keyframes galaxyPulse {
    0%, 100% {
      opacity: 0.6;
      filter: blur(8px);
    }
    50% {
      opacity: 1;
      filter: blur(12px);
    }
  }
  
  @keyframes galaxySparkle {
    0%, 100% {
      opacity: 0.4;
      transform: translateX(-50%) translateY(0);
    }
    25% {
      opacity: 0.8;
    }
    50% {
      opacity: 0.6;
      transform: translateX(-50%) translateY(-10px);
    }
    75% {
      opacity: 0.9;
    }
  }
  
  @media (max-width: 768px) {
    left: 20px;
    transform: none;
    
    &::before {
      left: 50%;
      transform: translateX(-50%);
    }
    
    &::after {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const TimelineMarquee = styled.div`
  position: absolute;
  left: 50%;
  top: -80px;
  width: 10px;
  height: 80px;
  margin-left: -5px;
  border-radius: 5px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 212, 170, 0.3) 10%,
    rgba(94, 231, 223, 0.8) 30%,
    rgba(0, 212, 170, 1) 50%,
    rgba(94, 231, 223, 0.8) 70%,
    rgba(0, 212, 170, 0.3) 90%,
    transparent 100%
  );
  box-shadow:
    0 0 30px rgba(0, 212, 170, 0.9),
    0 0 60px rgba(0, 212, 170, 0.5),
    0 0 90px rgba(94, 231, 223, 0.3),
    inset 0 0 20px rgba(255, 255, 255, 0.3);
  animation: timelineMarqueeRun 3s linear infinite;
  pointer-events: none;
  z-index: 0;
  
  /* 银河流动粒子 */
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 20%;
    width: 3px;
    height: 3px;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    box-shadow: 
      0 0 8px rgba(255, 255, 255, 0.8),
      0 0 16px rgba(0, 212, 170, 0.6);
    animation: sparkleFloat 1s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 60%;
    width: 2px;
    height: 2px;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    box-shadow: 
      0 0 6px rgba(255, 255, 255, 0.7),
      0 0 12px rgba(94, 231, 223, 0.5);
    animation: sparkleFloat 1s ease-in-out infinite 0.5s;
  }
  
  @keyframes timelineMarqueeRun {
    0% { top: -80px; opacity: 0; }
    5% { opacity: 1; }
    95% { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }
  
  @keyframes sparkleFloat {
    0%, 100% {
      opacity: 0.5;
      transform: translateX(-50%) scale(1);
    }
    50% {
      opacity: 1;
      transform: translateX(-50%) scale(1.5);
    }
  }
  
  @media (max-width: 768px) {
    left: 20px;
    margin-left: -5px;
  }
`;

const TimelineList = styled.div`
  position: relative;
  z-index: 1;
`;

const TimelineItem = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  margin-bottom: 40px;
  min-height: 80px;
  &:nth-child(even) {
    flex-direction: row-reverse;
  }
  @media (max-width: 768px) {
    flex-direction: row !important;
    justify-content: flex-start;
    margin-bottom: 32px;
    padding-left: 44px;
  }
`;

const ItemContentEmpty = styled.div`
  width: calc(50% - 40px);
  max-width: 520px;
  flex-shrink: 0;
  @media (max-width: 768px) {
    display: none;
  }
`;

const YearTick = styled(motion.div)`
  font-size: 20px;
  font-weight: 700;
  color: rgba(0, 212, 170, 0.7);
  white-space: nowrap;
  letter-spacing: -0.02em;
  padding: 4px 0;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const TimelineCenterTick = styled(motion.div)`
  flex-shrink: 0;
  width: 120px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  @media (max-width: 768px) {
    position: absolute;
    left: 0;
    width: auto;
    min-width: 44px;
    justify-content: flex-start;
  }
`;

const TickMark = styled(motion.div)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(0, 212, 170, 0.5);
  flex-shrink: 0;
  margin-right: 10px;
  @media (max-width: 768px) {
    width: 6px;
    height: 6px;
    margin-right: 8px;
  }
`;

const ItemContent = styled.div`
  width: calc(50% - 40px);
  max-width: 520px;
  flex-shrink: 0;
  @media (max-width: 768px) {
    width: 100%;
    max-width: none;
  }
`;

const CardGlassLayer = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  opacity: 0;
  transition: opacity 0.25s ease;
  z-index: 1.5;
  pointer-events: none;
`;

const ItemCard = styled(motion.article)`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 260px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: transparent;
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.2s;
  &:hover {
    border-color: rgba(0, 212, 170, 0.4);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 212, 170, 0.15);
    transform: translateY(-2px);
  }
  &:hover ${CardGlassLayer} {
    opacity: 1;
  }
  ${(p) => p.$milestone && `
    border-color: rgba(0, 212, 170, 0.25);
    box-shadow: 0 0 24px rgba(0, 212, 170, 0.1);
  `}
`;

const CardBgLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const CardBgOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.45) 45%,
    rgba(0, 0, 0, 0.85) 100%
  );
  z-index: 1;
`;

const CardBody = styled.div`
  position: relative;
  z-index: 2;
  padding: 20px 22px;
  ${(p) => p.$hasCover && 'margin-top: auto;'}
  background: transparent;
`;

const CardTitle = styled.h3`
  font-size: 17px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px;
  line-height: 1.35;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const CardSummary = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.55;
  margin: 0 0 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardMeta = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

const MilestoneBadge = styled.span`
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  color: #00d4aa;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 3px 10px;
  border-radius: 8px;
  background: rgba(0, 212, 170, 0.2);
  border: 1px solid rgba(0, 212, 170, 0.35);
  margin-bottom: 8px;
`;

const TimelineCenter = styled.div`
  flex-shrink: 0;
  width: 120px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding-top: 4px;
  ${(p) => p.$labelLeft && 'flex-direction: row-reverse;'}
  @media (max-width: 768px) {
    position: absolute;
    left: 0;
    width: auto;
    min-width: 44px;
    padding-top: 0;
    justify-content: flex-start;
    gap: 8px;
    ${(p) => p.$labelLeft && 'flex-direction: row;'}
  }
`;

const TimeDot = styled(motion.div)`
  width: ${(p) => (p.$milestone ? 16 : 12)}px;
  height: ${(p) => (p.$milestone ? 16 : 12)}px;
  border-radius: 50%;
  background: ${(p) => (p.$milestone ? '#00d4aa' : 'rgba(0, 212, 170, 0.6)')};
  border: 2px solid rgba(0, 212, 170, 0.9);
  box-shadow: 0 0 12px ${(p) => (p.$milestone ? 'rgba(0, 212, 170, 0.5)' : 'transparent')};
  flex-shrink: 0;
  @media (max-width: 768px) {
    width: ${(p) => (p.$milestone ? 14 : 10)}px;
    height: ${(p) => (p.$milestone ? 14 : 10)}px;
  }
`;

const TimeLabel = styled(motion.div)`
  font-size: 18px;
  font-weight: 700;
  color: #00d4aa;
  white-space: nowrap;
  letter-spacing: -0.02em;
  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const SpinWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 320px;
`;

const EmptyWrap = styled.div`
  padding: 64px 24px;
  text-align: center;
  color: #9aa0a6;
`;

const getEventTitle = (item, isZh) =>
  isZh ? (item.title || item.titleEn || '') : (item.titleEn || item.title || '');
const getEventSummary = (item, isZh) =>
  isZh ? (item.summary || item.summaryEn || '') : (item.summaryEn || item.summary || '');

const formatTimeLabel = (item) => {
  if (item.displayTimeText) return item.displayTimeText;
  if (item.eventYear == null) return '';
  if (item.eventMonth != null && item.eventMonth > 0) {
    return `${item.eventYear}/${item.eventMonth}`;
  }
  return String(item.eventYear);
};

const getTickYears = (minYear, maxYear) => {
  if (minYear == null || maxYear == null || maxYear < minYear) return [];
  const range = maxYear - minYear;
  const step =
    range > 80 ? 20 : range > 40 ? 10 : range > 15 ? 5 : range > 5 ? 2 : 1;
  const ticks = [];
  const start = Math.floor(maxYear / step) * step;
  for (let y = start; y >= minYear; y -= step) {
    ticks.push(y);
  }
  if (ticks.length === 0) ticks.push(maxYear);
  return ticks;
};

const buildTimelineEntries = (events) => {
  if (!events || events.length === 0) return [];
  const years = events.map((e) => e.eventYear).filter((y) => y != null);
  if (years.length === 0) return events.map((e) => ({ type: 'event', event: e }));
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const tickYears = getTickYears(minYear, maxYear);
  const combined = [];
  let tickIndex = 0;
  for (const event of events) {
    const y = event.eventYear != null ? event.eventYear : maxYear;
    while (tickIndex < tickYears.length && y <= tickYears[tickIndex]) {
      combined.push({ type: 'year', year: tickYears[tickIndex] });
      tickIndex += 1;
    }
    combined.push({ type: 'event', event });
  }
  while (tickIndex < tickYears.length) {
    combined.push({ type: 'year', year: tickYears[tickIndex] });
    tickIndex += 1;
  }
  return combined;
};

const AgiPathPage = () => {
  const { locale } = useLocale();
  const isZh = !locale || locale === 'zh-CN' || String(locale).toLowerCase().startsWith('zh');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getHistoryEventList({ currentPage: 1, pageSize: 100 })
      .then((res) => {
        if (cancelled) return;
        if (res.success && res.data?.data) {
          setList(res.data.data);
        } else {
          setList([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const pageTitle = isZh ? '通往 AGI 之路' : 'The Path to AGI';
  const pageSubtitle = isZh 
    ? '人形机器人、具身智能与通用人工智能路上的关键事件与里程碑'
    : 'Key events and milestones on the road to humanoid robots, embodied intelligence, and artificial general intelligence';
  const emptyText = isZh ? '暂无编年史事件，敬请期待。' : 'No timeline events yet. Stay tuned.';
  const milestoneText = isZh ? '里程碑' : 'Milestone';

  return (
    <PageWrap>
      <Helmet>
        <title>{pageTitle} | Open Robot X</title>
        <meta name="description" content={pageSubtitle} />
      </Helmet>
      <AppHeader />
      <Hero>
        <HeroTitle>{pageTitle}</HeroTitle>
        <HeroSubtitle>
          {pageSubtitle}
        </HeroSubtitle>
      </Hero>
      <TimelineSection>
        <TimelineLine />
        <TimelineStardust aria-hidden="true" />
        <TimelineStardust2 aria-hidden="true" />
        <TimelineParticles aria-hidden="true" />
        <TimelineParticles2 aria-hidden="true" />
        <TimelineParticles3 aria-hidden="true" />
        <TimelineParticles4 aria-hidden="true" />
        <TimelineParticles5 aria-hidden="true" />
        {!loading && list.length > 0 && <TimelineMarquee aria-hidden="true" />}
        {loading ? (
          <SpinWrap>
            <Spin size="large" />
          </SpinWrap>
        ) : list.length === 0 ? (
          <EmptyWrap>{emptyText}</EmptyWrap>
        ) : (
          <TimelineList>
            {buildTimelineEntries(list).map((entry, index) => {
              if (entry.type === 'year') {
                return (
                  <TimelineItem key={`year-${entry.year}`}>
                    <ItemContentEmpty aria-hidden="true" />
                    <TimelineCenterTick
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut"
                      }}
                    >
                      <TickMark
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                          type: "spring",
                          damping: 10,
                          stiffness: 200,
                          delay: 0.1
                        }}
                      />
                      <YearTick
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                          duration: 0.5,
                          delay: 0.2
                        }}
                      >
                        {entry.year}
                      </YearTick>
                    </TimelineCenterTick>
                    <ItemContentEmpty aria-hidden="true" />
                  </TimelineItem>
                );
              }
              const item = entry.event;
              const eventIndex = list.indexOf(item);
              const title = getEventTitle(item, isZh);
              const summary = getEventSummary(item, isZh);
              const timeLabel = formatTimeLabel(item);
              const milestone = (item.importanceLevel || 0) >= 4;
              const isLeft = eventIndex % 2 === 0;
              
              return (
                <TimelineItem key={item.id}>
                  <ItemContent>
                    <ItemCard 
                      $milestone={milestone} 
                      $hasCover={!!item.coverImageUrl}
                      initial={{ 
                        opacity: 0, 
                        x: isLeft ? -100 : 100,
                        rotateY: isLeft ? -15 : 15,
                        scale: 0.8
                      }}
                      whileInView={{ 
                        opacity: 1, 
                        x: 0,
                        rotateY: 0,
                        scale: 1
                      }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        duration: 0.8,
                        delay: 0.1,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        scale: {
                          type: "spring",
                          damping: 15,
                          stiffness: 100
                        }
                      }}
                      whileHover={{
                        scale: 1.02,
                        rotateY: isLeft ? 2 : -2,
                        transition: { duration: 0.3 }
                      }}
                    >
                      {item.coverImageUrl && (
                        <>
                          <CardBgLayer>
                            <img src={addImageCompressSuffix(item.coverImageUrl, 520)} alt="" loading="lazy" />
                          </CardBgLayer>
                          <CardBgOverlay />
                        </>
                      )}
                      <CardGlassLayer aria-hidden="true" />
                      <CardBody $hasCover={!!item.coverImageUrl}>
                        {milestone && <MilestoneBadge>{milestoneText}</MilestoneBadge>}
                        <CardTitle>{title}</CardTitle>
                        {summary && <CardSummary>{summary}</CardSummary>}
                        <CardMeta>
                          {item.relatedCompanyName && <span>{item.relatedCompanyName}</span>}
                          {item.country && <span>· {item.country}</span>}
                        </CardMeta>
                      </CardBody>
                    </ItemCard>
                  </ItemContent>
                  <TimelineCenter $labelLeft={eventIndex % 2 === 1}>
                    <TimeDot 
                      $milestone={milestone}
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        type: "spring",
                        damping: 12,
                        stiffness: 200,
                        delay: 0.3
                      }}
                      whileHover={{
                        scale: milestone ? 1.3 : 1.2,
                        boxShadow: milestone 
                          ? "0 0 20px rgba(0, 212, 170, 0.8)"
                          : "0 0 16px rgba(0, 212, 170, 0.6)",
                        transition: { duration: 0.2 }
                      }}
                    />
                    <TimeLabel
                      initial={{ opacity: 0, x: isLeft ? 20 : -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        duration: 0.5,
                        delay: 0.4,
                        ease: "easeOut"
                      }}
                    >
                      {timeLabel}
                    </TimeLabel>
                  </TimelineCenter>
                  <ItemContent style={{ visibility: 'hidden', pointerEvents: 'none' }} aria-hidden="true">
                    <div />
                  </ItemContent>
                </TimelineItem>
              );
            })}
          </TimelineList>
        )}
      </TimelineSection>
      <Footer />
    </PageWrap>
  );
};

export default AgiPathPage;
