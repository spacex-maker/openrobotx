import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import { 
  BarChart2, 
  Cpu, 
  Battery, 
  Zap, 
  Activity, 
  ArrowRight,
  Scale,
  Settings2,
  ListFilter,
  Gauge,
  Hand,
  X,
  Info
} from 'lucide-react';
import { getHumanoidRobotList } from '../../../api/openrobotx';
import { addImageCompressSuffix } from '../../../utils/imageUtils';

// --- 配置常量 ---

const ACCENT = '#00d4aa';

// 核心指标配置（雷达图/看板柱状图用）
const METRICS_CONFIG = [
  { key: 'heightCm', label: '身高', unit: 'cm', max: 200, icon: <Activity size={14} /> },
  { key: 'weightKg', label: '体重', unit: 'kg', max: 100, icon: <Scale size={14} /> },
  { key: 'totalDof', label: '自由度', unit: 'DOF', max: 60, icon: <Cpu size={14} /> },
  { key: 'walkingSpeedKmh', label: '行走速度', unit: 'km/h', max: 10, icon: <Zap size={14} /> },
  { key: 'runningSpeedKmh', label: '奔跑速度', unit: 'km/h', max: 15, icon: <Gauge size={14} /> },
  { key: 'totalPayloadKg', label: '全身负载', unit: 'kg', max: 40, icon: <BarChart2 size={14} /> },
  { key: 'armPayloadKg', label: '手臂负载', unit: 'kg', max: 20, icon: <Hand size={14} /> },
  { key: 'handDofPerHand', label: '手部DOF', unit: 'DOF', max: 12, icon: <Hand size={14} /> },
  { key: 'batteryLifeHours', label: '电池续航', unit: 'h', max: 12, icon: <Battery size={14} /> },
  { key: 'batteryCapacityKwh', label: '电池容量', unit: 'kWh', max: 3, icon: <Battery size={14} /> },
];

// --- 基础组件 ---

const TabButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
      active 
        ? 'text-[#0a0e17] bg-[#00d4aa] shadow-[0_0_15px_rgba(0,212,170,0.4)]' 
        : 'text-zinc-400 hover:text-white hover:bg-white/5'
    }`}
  >
    {children}
  </button>
);

const ToggleButton = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
      active
        ? 'bg-[#00d4aa]/10 border-[#00d4aa] text-[#00d4aa]'
        : 'bg-transparent border-white/10 text-zinc-500 hover:border-white/20'
    }`}
  >
    <div className={`w-3 h-3 rounded-full border ${active ? 'bg-[#00d4aa] border-[#00d4aa]' : 'border-zinc-500'}`} />
    {label}
  </button>
);

// --- 雷达图弹窗（多边形 + 背景虚化）---

const RadarModal = ({ robot, onClose }) => {
  const radarOption = useMemo(() => ({
    radar: {
      indicator: METRICS_CONFIG.map(m => ({ name: m.label, max: m.max })),
      center: ['50%', '52%'],
      radius: '68%',
      splitNumber: 2,
      name: {
        show: true,
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: 600
      },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.15)' } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
      splitArea: { show: false }
    },
    series: [{
      type: 'radar',
      data: [{
        value: METRICS_CONFIG.map(m => Number(robot[m.key]) || 0),
        name: robot.model,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: { width: 2, color: ACCENT },
        areaStyle: { color: ACCENT, opacity: 0.35 }
      }]
    }]
  }), [robot]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* 背景虚化 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" aria-hidden />
      {/* 弹窗内容：多边形图案 */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-[420px] aspect-square rounded-2xl border border-white/10 bg-[#0f141e]/95 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          <div>
            <h3 className="text-lg font-bold text-white">{robot.company} · {robot.model}</h3>
            <p className="text-xs text-zinc-500 mt-0.5">参数雷达图</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="关闭"
          >
            <X size={20} />
          </button>
        </div>
        <div className="w-full h-full min-h-[320px] pt-14 pb-4">
          <ReactECharts option={radarOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- 列表视图组件 ---

const RobotCard = ({ robot, index, onRadarClick }) => {
  // 迷你雷达图配置
  const radarOption = useMemo(() => ({
    radar: {
      indicator: METRICS_CONFIG.map(m => ({ name: '', max: m.max })),
      center: ['50%', '50%'],
      radius: '65%',
      splitNumber: 1,
      name: { show: false },
      axisLine: { show: false },
      splitLine: { show: false },
      splitArea: { show: false }
    },
    series: [{
      type: 'radar',
      data: [{
        value: METRICS_CONFIG.map(m => Number(robot[m.key]) || 0),
        symbol: 'none',
        lineStyle: { width: 1, color: ACCENT },
        areaStyle: { color: ACCENT, opacity: 0.2 }
      }]
    }]
  }), [robot]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group relative flex flex-col md:flex-row bg-[#0f141e]/60 border border-white/5 rounded-2xl overflow-hidden hover:border-[#00d4aa]/30 hover:bg-[#161b26]/80 transition-all duration-300"
    >
      {/* 图片区域：移动端固定 200px 高，桌面端随卡片拉满；图片绝对定位铺满 */}
      <div
        className="w-full md:w-[300px] h-[200px] md:h-auto md:min-h-[200px] relative overflow-hidden bg-black/20 shrink-0 flex-none"
      >
        {robot.imageUrl ? (
          <img
            src={addImageCompressSuffix(robot.imageUrl, 400)}
            alt={robot.model}
            draggable="false"
            className="block"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
            <Cpu size={48} />
          </div>
        )}
        <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-white/90 uppercase tracking-wider border border-white/10">
          {robot.countryOrigin || 'Global'}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 p-5 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{robot.company} <span className="text-zinc-500 font-normal">/ {robot.model}</span></h3>
            <p className="text-xs text-zinc-400 line-clamp-1 border border-white/5 inline-block px-2 py-0.5 rounded-full bg-white/5">
              {robot.targetApplication || "通用人形机器人"}
            </p>
          </div>
          {/* 右上角迷你雷达图：点击弹出多边形弹窗 */}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRadarClick?.(robot); }}
            className="w-14 h-14 -mt-2 -mr-2 opacity-40 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 cursor-pointer rounded-lg hover:ring-2 hover:ring-[#00d4aa]/40 focus:outline-none focus:ring-2 focus:ring-[#00d4aa]/50"
            aria-label="查看参数雷达图"
          >
            <ReactECharts option={radarOption} style={{ height: '100%', width: '100%' }} />
          </button>
        </div>

        {/* 核心参数网格 */}
        <div className="grid grid-cols-3 gap-y-3 gap-x-2 mb-4">
          {METRICS_CONFIG.slice(0, 6).map(metric => {
            const val = robot[metric.key];
            return (
              <div key={metric.key} className="flex flex-col">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-600 mb-0.5 font-bold">
                  {metric.icon} {metric.label}
                </div>
                <div className="text-sm font-mono font-medium text-zinc-300 group-hover:text-white transition-colors">
                  {val ? `${val}` : <span className="text-zinc-700">-</span>} 
                  {val && <span className="text-[10px] text-zinc-600 ml-0.5">{metric.unit}</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* 底部链接 */}
        <div className="mt-auto pt-3 border-t border-white/5 flex justify-between items-center">
          <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-wide">
            {robot.releaseDate ? `Release: ${robot.releaseDate}` : 'Concept Phase'}
          </div>
          <Link 
            to={`/robots/${robot.id}`} 
            className="flex items-center gap-2 text-xs font-bold text-[#00d4aa] hover:text-[#5ee7df] transition-colors uppercase tracking-wider"
          >
            查看详情 <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// --- 表格对比组件 ---

const ComparisonTable = ({ robots }) => {
  const params = [
    { key: 'countryOrigin', label: '产地' },
    { key: 'heightCm', label: '高度 (cm)' },
    { key: 'weightKg', label: '体重 (kg)' },
    { key: 'totalDof', label: '总自由度 (DOF)' },
    { key: 'handDofPerHand', label: '手部DOF/手' },
    { key: 'legDof', label: '腿部DOF' },
    { key: 'walkingSpeedKmh', label: '行走速度 (km/h)' },
    { key: 'runningSpeedKmh', label: '奔跑速度 (km/h)' },
    { key: 'totalPayloadKg', label: '全身负载 (kg)' },
    { key: 'armPayloadKg', label: '手臂负载 (kg)' },
    { key: 'batteryLifeHours', label: '续航时间 (h)' },
    { key: 'batteryCapacityKwh', label: '电池容量 (kWh)' },
    { key: 'chargeTimeHours', label: '充电时间 (h)' },
    { key: 'priceUsd', label: '预估价格 ($)' },
    { key: 'aiCoreModel', label: 'AI 核心模型' },
    { key: 'targetApplication', label: '目标应用' },
    { key: 'visionSystem', label: '视觉系统' },
    { key: 'actuatorType', label: '执行器类型' },
    { key: 'computingPlatform', label: '计算平台' },
    { key: 'mainSensors', label: '主要传感器' },
    { key: 'availabilityStatus', label: '可用状态' },
    { key: 'releaseDate', label: '发布/首发日期' },
    { key: 'rosCompatibility', label: 'ROS 兼容', render: v => v === 1 ? '是' : (v === 0 ? '否' : '-') },
    { key: 'endToEndAi', label: '端到端AI', render: v => v === 1 ? '是' : (v === 0 ? '否' : '-') },
    { key: 'multimodalAi', label: '多模态AI', render: v => v === 1 ? '是' : (v === 0 ? '否' : '-') },
    { key: 'noiseLevelDb', label: '运行噪音 (dB)' },
    { key: 'powerConsumptionW', label: '功耗 (W)' },
  ];

  return (
    <div className="overflow-x-auto pb-2 custom-scrollbar">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr>
            <th className="sticky left-0 z-20 p-4 bg-[#0a0e17] border-b border-white/10 text-xs font-bold text-[#00d4aa] uppercase tracking-wider min-w-[140px] shadow-[4px_0_12px_rgba(0,0,0,0.5)]">
              核心参数
            </th>
            {robots.map(r => (
              <th key={r.id} className="p-4 border-b border-white/10 min-w-[180px] bg-[#0a0e17]/50 backdrop-blur">
                <div className="font-bold text-white text-sm">{r.model}</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{r.company}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {params.map(param => (
            <tr key={param.key} className="group hover:bg-white/[0.02] transition-colors">
              <td className="sticky left-0 z-10 p-4 bg-[#0f141e] border-b border-white/5 text-xs font-bold text-zinc-400 uppercase tracking-wide shadow-[4px_0_12px_rgba(0,0,0,0.5)] group-hover:bg-[#161b26] transition-colors">
                {param.label}
              </td>
              {robots.map(r => (
                <td key={r.id} className="p-4 border-b border-white/5 text-sm text-zinc-300 font-mono border-l border-white/5">
                  {param.render ? param.render(r[param.key]) : (r[param.key] ?? <span className="text-zinc-700">—</span>)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- 增强版仪表盘组件 ---

const DashboardView = ({ robots }) => {
  // 状态：选中的指标 key
  const [metricKey, setMetricKey] = useState('totalDof');
  // 状态：是否归一化
  const [isNormalized, setIsNormalized] = useState(false);

  // 1. KPI 计算
  const topSpeed = useMemo(() => [...robots].sort((a,b) => (Number(b.walkingSpeedKmh)||0) - (Number(a.walkingSpeedKmh)||0))[0], [robots]);
  const topPayload = useMemo(() => [...robots].sort((a,b) => (Number(b.totalPayloadKg)||0) - (Number(a.totalPayloadKg)||0))[0], [robots]);
  const topEndurance = useMemo(() => [...robots].sort((a,b) => (Number(b.batteryLifeHours)||0) - (Number(a.batteryLifeHours)||0))[0], [robots]);

  // 2. 交互式柱状图数据
  const barOption = useMemo(() => {
    const metric = METRICS_CONFIG.find(m => m.key === metricKey) || METRICS_CONFIG[0];
    
    // 排序并过滤无效数据
    const sortedData = [...robots]
      .map(r => ({ name: r.model, val: Number(r[metricKey]) || 0, company: r.company }))
      .filter(d => d.val > 0)
      .sort((a, b) => b.val - a.val)
      .slice(0, 15); // 只显示前15名

    const xData = sortedData.map(d => d.name);
    const yData = sortedData.map(d => isNormalized ? (d.val / metric.max) * 100 : d.val);

    return {
      grid: { left: 40, right: 20, top: 30, bottom: 60, containLabel: true },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(10, 14, 23, 0.9)',
        borderColor: '#333',
        textStyle: { color: '#eee' },
        formatter: (params) => {
          const item = sortedData[params[0].dataIndex];
          return `<div class="font-bold text-white mb-1">${item.company} ${item.name}</div>
                  <div class="text-xs text-zinc-400">${metric.label}: <span class="text-[#00d4aa] font-mono text-sm">${item.val} ${metric.unit}</span></div>`;
        }
      },
      xAxis: { 
        type: 'category', 
        data: xData, 
        axisLabel: { color: '#666', rotate: 45, fontSize: 10 },
        axisLine: { lineStyle: { color: '#333' } }
      },
      yAxis: { 
        type: 'value', 
        name: isNormalized ? 'Score (0-100)' : metric.unit,
        nameTextStyle: { color: '#666', padding: [0, 0, 0, 20] },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        axisLabel: { color: '#666' }
      },
      series: [{
        type: 'bar',
        data: yData,
        itemStyle: { 
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: '#00d4aa' }, { offset: 1, color: 'rgba(0, 212, 170, 0.1)' }]
          },
          borderRadius: [4, 4, 0, 0]
        },
        barMaxWidth: 30
      }]
    };
  }, [robots, metricKey, isNormalized]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: '极速行者', icon: <Zap className="text-yellow-400" />, val: `${topSpeed?.walkingSpeedKmh || '-'} km/h`, sub: topSpeed?.model },
          { label: '大力神', icon: <BarChart2 className="text-blue-400" />, val: `${topPayload?.totalPayloadKg || '-'} kg`, sub: topPayload?.model },
          { label: '耐力王', icon: <Battery className="text-green-400" />, val: `${topEndurance?.batteryLifeHours || '-'} h`, sub: topEndurance?.model },
        ].map((item, i) => (
          <div key={i} className="bg-[#0f141e]/40 border border-white/5 rounded-2xl p-5 flex items-center gap-4 hover:bg-[#0f141e]/60 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/5 flex items-center justify-center text-xl shadow-inner">
              {item.icon}
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-1">{item.label}</div>
              <div className="text-2xl font-bold text-white mb-0.5 font-mono">{item.val}</div>
              <div className="text-xs text-[#00d4aa]">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Chart Container */}
      <div className="bg-[#0f141e]/40 border border-white/5 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-zinc-300 font-bold">
            <BarChart2 size={18} className="text-[#00d4aa]" />
            参数排行榜
          </div>
          
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-black/20 p-1 rounded-lg border border-white/5 overflow-x-auto max-w-[300px] md:max-w-none scrollbar-hide">
              {METRICS_CONFIG.map(m => (
                <button
                  key={m.key}
                  onClick={() => setMetricKey(m.key)}
                  className={`px-3 py-1.5 text-xs rounded-md whitespace-nowrap transition-all ${
                    metricKey === m.key 
                      ? 'bg-[#00d4aa] text-[#0a0e17] font-bold shadow-lg' 
                      : 'text-zinc-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div className="w-px h-6 bg-white/10 hidden md:block" />
            <ToggleButton 
              active={isNormalized} 
              label="归一化对比" 
              onClick={() => setIsNormalized(!isNormalized)} 
            />
          </div>
        </div>
        
        <div className="h-[350px] w-full">
          <ReactECharts option={barOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>
    </div>
  );
};

// --- 主页面组件 ---

const ORDER_OPTIONS = [
  { value: 'valuation', label: '市值' },
  { value: 'latest', label: '最新' },
  { value: 'hot', label: '最热' },
  { value: 'update', label: '最近更新' },
];

const RobotCompareSection = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');
  const [orderBy, setOrderBy] = useState('valuation');
  const [radarModalRobot, setRadarModalRobot] = useState(null);
  const [showDataInfo, setShowDataInfo] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getHumanoidRobotList({ currentPage: 1, pageSize: 50, orderBy })
      .then((res) => {
        if (!cancelled && res.success && res.data?.data) {
          setList(res.data.data);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [orderBy]);

  return (
    <section className="relative w-full py-24 bg-[#0a0e17] overflow-hidden min-h-screen">
      {/* 科技感背景装饰 */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00d4aa]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-[1600px]">
        
        {/* 顶部标题区 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-[#00d4aa]" />
              <span className="text-[#00d4aa] font-medium tracking-widest uppercase text-xs">Technical Database</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Humanoid <span className="text-zinc-600">Specs</span>
            </h2>
            <p className="text-zinc-400 max-w-xl leading-relaxed text-sm md:text-base">
              深度对比 {list.length > 0 ? list.length : '...'} 款人形机器人的核心参数。
              从电机扭矩到电池能量密度，一切数据尽在掌握。
            </p>
            {/* 排序选择器 */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-xs text-zinc-500 uppercase tracking-wider">排序：</span>
              {ORDER_OPTIONS.map((opt) => (
                <ToggleButton
                  key={opt.value}
                  active={orderBy === opt.value}
                  label={opt.label}
                  onClick={() => setOrderBy(opt.value)}
                />
              ))}
            </div>
          </div>

          {/* 右上角：数据说明提示 + Tab 切换器 */}
          <div className="flex flex-col items-end gap-3">
            {/* 数据更新与来源提示 */}
            <div
              className="relative"
              onMouseEnter={() => setShowDataInfo(true)}
              onMouseLeave={() => setTimeout(() => setShowDataInfo(false), 180)}
            >
              <button
                type="button"
                onClick={() => setShowDataInfo((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-[#0f141e]/80 text-zinc-400 hover:text-white hover:border-[#00d4aa]/30 hover:bg-[#0f141e] transition-all text-xs"
                aria-expanded={showDataInfo}
                aria-haspopup="true"
              >
                <Info size={14} className="text-[#00d4aa]/80" />
                <span>数据说明</span>
              </button>
              {showDataInfo && (
                <div className="absolute top-full right-0 mt-2 w-[280px] p-4 rounded-xl border border-white/10 bg-[#0f141e] shadow-xl z-20 text-left">
                  <div className="text-[10px] uppercase tracking-wider text-[#00d4aa] font-bold mb-2">更新与来源</div>
                  <ul className="text-xs text-zinc-400 space-y-1.5">
                    <li><strong className="text-zinc-300">每周智能校验</strong>：每周以每个机器人为查询进行检索，用检索到的公开资料更新参数，确保库内数据持续保鲜、可信可用。</li>
                    <li><strong className="text-zinc-300">数据来源</strong>：网络搜索与 AI 解析公开资料，非厂商直供。</li>
                    <li><strong className="text-zinc-300">仅供参考</strong>：部分参数可能缺失或存在偏差，以厂商官网与最新发布为准。</li>
                  </ul>
                </div>
              )}
            </div>
            {/* Tab 切换器 */}
            <div className="flex p-1.5 bg-[#0f141e] border border-white/5 rounded-full backdrop-blur-xl shadow-2xl">
              <TabButton active={activeTab === 'list'} onClick={() => setActiveTab('list')}>
                <span className="flex items-center gap-2"><ListFilter size={14} /> 列表</span>
              </TabButton>
              <TabButton active={activeTab === 'compare'} onClick={() => setActiveTab('compare')}>
                <span className="flex items-center gap-2"><Settings2 size={14} /> 对比表</span>
              </TabButton>
              <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>
                <span className="flex items-center gap-2"><Activity size={14} /> 分析看板</span>
              </TabButton>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        {loading ? (
          <div className="flex justify-center py-32">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-[#00d4aa] border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-[#00d4aa] rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'list' && (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {list.map((robot, i) => (
                  <RobotCard
                    key={robot.id}
                    robot={robot}
                    index={i}
                    onRadarClick={setRadarModalRobot}
                  />
                ))}
              </motion.div>
            )}

            {activeTab === 'compare' && (
              <motion.div
                key="compare"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0f141e]/80 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl"
              >
                <ComparisonTable robots={list} />
              </motion.div>
            )}

            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DashboardView robots={list} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* 雷达图弹窗：背景虚化 + 多边形 */}
      <AnimatePresence>
        {radarModalRobot && (
          <RadarModal
            robot={radarModalRobot}
            onClose={() => setRadarModalRobot(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default RobotCompareSection;