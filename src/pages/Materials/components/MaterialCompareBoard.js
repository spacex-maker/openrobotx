import React, { useState, useMemo } from 'react';
import { Spin, Empty, ConfigProvider, theme } from 'antd';
import ReactECharts from 'echarts-for-react';
import { 
  LayoutGrid, 
  SlidersHorizontal, 
  Table2, 
  Radar, 
  BarChart2, 
  Grid3X3, 
  X, 
  Check, 
  FlaskConical,
  ChevronDown
} from 'lucide-react';
import { addImageCompressSuffix } from '../../../utils/imageUtils';

const ACCENT = '#00d4aa';
const BG_DARK = '#0a0e17'; // 与页面背景一致，用于 sticky 列遮挡
const MATERIAL_COLORS = [ACCENT, '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];

// --- Configs ---
const PROPERTY_CONFIGS = [
  { key: 'density', labelZh: '密度', labelEn: 'Density', unit: 'g/cm³', path: ['variants', 0, 'property', 'density'] },
  { key: 'youngsModulus', labelZh: '杨氏模量', labelEn: "Young's Modulus", unit: 'GPa', path: ['variants', 0, 'property', 'youngsModulus'] },
  { key: 'poissonsRatio', labelZh: '泊松比', labelEn: "Poisson's Ratio", unit: '', path: ['variants', 0, 'property', 'poissonsRatio'] },
  { key: 'yieldStrength', labelZh: '屈服强度', labelEn: 'Yield Strength', unit: 'MPa', path: ['variants', 0, 'property', 'yieldStrength'] },
  { key: 'ultimateStrength', labelZh: '抗拉强度', labelEn: 'Ultimate Strength', unit: 'MPa', path: ['variants', 0, 'property', 'ultimateStrength'] },
  { key: 'thermalConductivity', labelZh: '热导率', labelEn: 'Thermal Cond.', unit: 'W/(m·K)', path: ['variants', 0, 'property', 'thermalConductivity'] },
  { key: 'meltingPoint', labelZh: '熔点', labelEn: 'Melting Point', unit: '°C', path: ['variants', 0, 'property', 'meltingPoint'] },
  { key: 'maxServiceTemp', labelZh: '最高工作温度', labelEn: 'Max Service Temp', unit: '°C', path: ['variants', 0, 'property', 'maxServiceTemp'] },
  { key: 'frictionStatic', labelZh: '静摩擦系数', labelEn: 'Friction (Static)', unit: '', path: ['variants', 0, 'property', 'frictionStatic'] },
  { key: 'frictionDynamic', labelZh: '动摩擦系数', labelEn: 'Friction (Dynamic)', unit: '', path: ['variants', 0, 'property', 'frictionDynamic'] },
  { key: 'dampingRatio', labelZh: '阻尼比', labelEn: 'Damping Ratio', unit: '', path: ['variants', 0, 'property', 'dampingRatio'] },
  { key: 'costFactor', labelZh: '成本系数', labelEn: 'Cost Factor', unit: '×', path: ['variants', 0, 'variant', 'costFactor'] },
  { key: 'processState', labelZh: '工艺状态', labelEn: 'Process State', unit: '', path: ['variants', 0, 'variant', 'processState'] },
  { key: 'gradeStandard', labelZh: '标准代号', labelEn: 'Grade Standard', unit: '', path: ['variants', 0, 'variant', 'gradeStandard'] },
];

const NUMERIC_PROP_KEYS = ['density', 'youngsModulus', 'poissonsRatio', 'yieldStrength', 'ultimateStrength', 'thermalConductivity', 'meltingPoint', 'maxServiceTemp', 'frictionStatic', 'frictionDynamic', 'dampingRatio', 'costFactor'];
const NUMERIC_PROPS = PROPERTY_CONFIGS.filter(p => NUMERIC_PROP_KEYS.includes(p.key));

// --- Helpers ---

const getNestedValue = (obj, path) => {
  let cur = obj;
  for (const p of path) {
    if (cur == null) return null;
    cur = cur[p];
  }
  return cur;
};

// ECharts 通用深色配置生成器
const getCommonChartOptions = () => ({
  backgroundColor: 'transparent',
  textStyle: { fontFamily: 'Inter, sans-serif' },
  tooltip: {
    backgroundColor: 'rgba(20, 20, 22, 0.8)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    textStyle: { color: '#e8eaed' },
    padding: 12,
    borderRadius: 12,
    extraCssText: 'box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4); border: 1px solid rgba(255,255,255,0.1);',
  },
});

const MaterialCompareBoard = ({
  selectedIds,
  detailList,
  loading,
  isZh,
  onMaterialClick,
  onCompareIdsChange,
  emptySelectText,
  selectPropsText,
  selectAllText,
  deselectAllText,
  selectedMaterialsLabel,
  tableModeText,
  radarModeText,
  barModeText,
  heatmapModeText,
}) => {
  // State
  const [displayMode, setDisplayMode] = useState('table');
  const [selectedProps, setSelectedProps] = useState(() => PROPERTY_CONFIGS.map(p => p.key));
  const [propsPanelOpen, setPropsPanelOpen] = useState(false);

  // Memoized Data
  const selectedWithNames = useMemo(() => {
    if (!selectedIds?.length) return [];
    const detailMap = new Map((detailList || []).map(d => [d.base?.id, d.base?.name]));
    return selectedIds.map(id => ({ id, name: detailMap.get(id) || `ID: ${id}` }));
  }, [selectedIds, detailList]);

  const chartProps = useMemo(() => {
    const selected = NUMERIC_PROPS.filter(p => selectedProps.includes(p.key));
    return selected.length > 0 ? selected : NUMERIC_PROPS;
  }, [selectedProps]);

  // Matrix Calculation
  const { matrix, normalizedMatrix, labels } = useMemo(() => {
    if (!detailList?.length) return { matrix: [], normalizedMatrix: [], labels: [] };
    const mat = detailList.map(d =>
      chartProps.map(p => {
        const v = getNestedValue(d, p.path);
        return (v != null && v !== '') ? parseFloat(v) : null;
      })
    );
    // Normalize per column
    const maxPerCol = chartProps.map((_, j) => {
      let m = 0;
      mat.forEach(row => { const v = row[j]; if (v != null && !isNaN(v) && v > m) m = v; });
      return m || 1;
    });
    const norm = mat.map(row => row.map((v, j) => (v != null && !isNaN(v) && maxPerCol[j] > 0) ? (v / maxPerCol[j]) * 100 : 0));
    
    return {
      matrix: mat,
      normalizedMatrix: norm,
      labels: detailList.map(d => d.base?.name || ''),
    };
  }, [detailList, chartProps]);

  // --- Chart Options ---

  const radarOption = useMemo(() => {
    const indicators = chartProps.map(p => ({ name: isZh ? p.labelZh : p.labelEn, max: 100 }));
    const colors = [ACCENT, '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];
    
    return {
      ...getCommonChartOptions(),
      radar: {
        indicator: indicators,
        center: ['50%', '55%'],
        radius: '65%',
        splitNumber: 4,
        axisName: { color: '#94a3b8', fontSize: 11, fontWeight: 500 },
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        splitArea: { show: false },
      },
      legend: { top: 0, icon: 'circle', textStyle: { color: '#9aa0a6' }, data: labels },
      series: [{
        type: 'radar',
        data: detailList.map((d, i) => ({
          value: normalizedMatrix[i],
          name: d.base?.name,
          symbol: 'none',
          lineStyle: { width: 2, color: colors[i % colors.length] },
          areaStyle: { color: colors[i % colors.length], opacity: 0.15 },
        })),
      }],
    };
  }, [detailList, normalizedMatrix, labels, chartProps, isZh]);

  const barOption = useMemo(() => {
    const propLabels = chartProps.map(p => isZh ? p.labelZh : p.labelEn);
    const colors = [ACCENT, '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];
    
    // Sort logic (same as original)
    const withAvg = detailList.map((d, i) => {
      const row = matrix[i] || [];
      let sum = 0, count = 0;
      row.forEach(v => { if (v != null && !isNaN(v)) { sum += v; count++; } });
      return { index: i, avg: count > 0 ? sum / count : 0 };
    });
    withAvg.sort((a, b) => a.avg - b.avg);
    const order = withAvg.map(x => x.index);

    return {
      ...getCommonChartOptions(),
      grid: { left: 50, right: 30, top: 60, bottom: 60, containLabel: true },
      legend: { top: 0, icon: 'circle', textStyle: { color: '#9aa0a6' }, data: order.map(i => labels[i]) },
      xAxis: { 
        type: 'category', 
        data: propLabels, 
        axisLabel: { color: '#94a3b8', rotate: 30, fontSize: 11, margin: 14 },
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
      },
      yAxis: { 
        type: 'value', 
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        axisLabel: { color: '#6b7280' }
      },
      series: order.map((origIdx, k) => ({
        name: labels[origIdx],
        type: 'bar',
        data: matrix[origIdx],
        itemStyle: { color: colors[k % colors.length], borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 16,
        barGap: '20%' // space between bars in same category
      })),
    };
  }, [detailList, matrix, labels, chartProps, isZh]);

  const heatmapOption = useMemo(() => {
    const propLabels = chartProps.map(p => isZh ? p.labelZh : p.labelEn);
    const data = [];
    normalizedMatrix.forEach((row, i) => row.forEach((v, j) => data.push([j, i, Math.round(v)])));
    
    return {
      ...getCommonChartOptions(),
      grid: { left: 100, right: 40, top: 40, bottom: 80 },
      xAxis: { 
        type: 'category', 
        data: propLabels, 
        axisLabel: { color: '#94a3b8', rotate: 35, fontSize: 11 },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      yAxis: { 
        type: 'category', 
        data: labels, 
        axisLabel: { color: '#e8eaed', fontWeight: 500 },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      visualMap: {
        min: 0, max: 100,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        inRange: { color: ['#1e293b', '#0f766e', ACCENT] }, // Dark Slate -> Teal -> Accent
        textStyle: { color: '#94a3b8' }
      },
      series: [{
        type: 'heatmap',
        data,
        label: { show: true, fontSize: 11, color: '#fff' },
        itemStyle: { borderColor: '#0a0e17', borderWidth: 3, borderRadius: 4 },
      }],
    };
  }, [detailList, normalizedMatrix, labels, chartProps, isZh]);

  // --- Handlers ---
  const toggleProp = (key) => setSelectedProps(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  const selectAll = () => setSelectedProps(PROPERTY_CONFIGS.map(p => p.key));
  const deselectAll = () => setSelectedProps([]);

  // --- Render ---

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <Spin size="large" />
    </div>
  );

  if (!selectedIds?.length || !detailList?.length) return (
    <div className="h-80 flex flex-col items-center justify-center text-gray-500 bg-white/[0.02] rounded-3xl border border-white/5 border-dashed">
      <LayoutGrid size={40} className="mb-4 text-gray-600 opacity-50" />
      <p className="text-gray-400 font-medium">{emptySelectText}</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. Header：看板切换 + 已选材料（两行） */}
      <div className="flex flex-col gap-4">
        {/* 第一行：看板切换区 */}
        <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex flex-wrap gap-1">
          {[
            { key: 'table', label: tableModeText, icon: Table2 },
            { key: 'radar', label: radarModeText, icon: Radar },
            { key: 'bar', label: barModeText, icon: BarChart2 },
            { key: 'heatmap', label: heatmapModeText, icon: Grid3X3 },
          ].map(({ key, label, icon: Icon }) => {
            const isActive = displayMode === key;
            return (
              <button
                key={key}
                onClick={() => setDisplayMode(key)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200
                  ${isActive
                    ? 'bg-[#00d4aa]/15 border-[#00d4aa]/40 text-[#00d4aa]'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5 hover:border-white/10'}
                `}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
        </div>

        {/* 第二行：已选材料 */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {selectedMaterialsLabel}
            </span>
            <span className="text-xs text-gray-600 bg-white/10 px-2 py-0.5 rounded-full">
              {selectedWithNames.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedWithNames.map(({ id, name }, index) => {
              const color = MATERIAL_COLORS[index % MATERIAL_COLORS.length];
              return (
                <div
                  key={id}
                  className="group flex items-center gap-2.5 pl-3 pr-2 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/15 hover:bg-white/8 transition-all duration-200 shrink-0"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-white/10"
                    style={{ backgroundColor: color }}
                  />
                  <span
                    className="text-sm font-medium text-gray-200 max-w-[140px] sm:max-w-[180px] truncate"
                    title={name}
                  >
                    {name}
                  </span>
                  {onCompareIdsChange && (
                    <button
                      type="button"
                      onClick={() => onCompareIdsChange(selectedIds.filter(x => x !== id))}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors shrink-0"
                      title={isZh ? '移出对比' : 'Remove'}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Property Filter (Collapsible) */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300">
        <button 
          onClick={() => setPropsPanelOpen(!propsPanelOpen)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} />
            <span>{selectPropsText}</span>
            <span className="bg-white/10 px-2 py-0.5 rounded text-xs text-gray-500">
              {selectedProps.length} / {PROPERTY_CONFIGS.length}
            </span>
          </div>
          <ChevronDown size={16} className={`transition-transform duration-300 ${propsPanelOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {propsPanelOpen && (
          <div className="p-4 border-t border-white/5 bg-black/20">
             <div className="flex items-center gap-2 mb-4">
                <button onClick={selectAll} className="text-xs px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors">{selectAllText}</button>
                <button onClick={deselectAll} className="text-xs px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 transition-colors">{deselectAllText}</button>
             </div>
             <div className="flex flex-wrap gap-2">
               {PROPERTY_CONFIGS.map(p => {
                 const isSelected = selectedProps.includes(p.key);
                 return (
                   <button
                     key={p.key}
                     onClick={() => toggleProp(p.key)}
                     className={`
                       flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200
                       ${isSelected 
                          ? 'bg-[#00d4aa]/10 border-[#00d4aa]/30 text-[#00d4aa]' 
                          : 'bg-white/5 border-transparent text-gray-500 hover:border-white/10 hover:text-gray-300'
                       }
                     `}
                   >
                     {isSelected && <Check size={12} />}
                     {isZh ? p.labelZh : p.labelEn}
                   </button>
                 );
               })}
             </div>
          </div>
        )}
      </div>

      {/* 3. Visualization Area */}
      <div className="min-h-[400px]">
        
        {/* MODE: TABLE */}
        {displayMode === 'table' && (
          <div className="rounded-2xl border border-white/10 bg-[#0f0f10]/40 backdrop-blur-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th 
                      className="sticky left-0 z-20 py-4 px-5 text-left text-gray-500 font-medium whitespace-nowrap min-w-[160px] border-r border-white/5"
                      style={{ backgroundColor: BG_DARK }} // Solid bg to hide scroll
                    >
                      {isZh ? '属性参数' : 'Parameters'}
                    </th>
                    {detailList.map(d => (
                      <th key={d.base?.id} className="py-4 px-6 text-left min-w-[200px] whitespace-nowrap group hover:bg-white/5 transition-colors cursor-pointer" onClick={() => onMaterialClick?.(d.base?.id)}>
                        <div className="flex items-center gap-3">
                          {d.base?.thumbnailUrl ? (
                            <img src={addImageCompressSuffix(d.base.thumbnailUrl, 80)} className="w-10 h-10 object-contain rounded-lg bg-white/5 border border-white/10" alt="" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-600">
                              <FlaskConical size={18} />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-semibold text-white group-hover:text-[#00d4aa] transition-colors">{d.base?.name}</span>
                            {d.base?.chemicalFormula && <span className="text-xs text-gray-500 font-mono">{d.base.chemicalFormula}</span>}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PROPERTY_CONFIGS.filter(p => selectedProps.includes(p.key)).map((p, idx) => (
                    <tr key={p.key} className={`border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors ${idx % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                      <td 
                        className="sticky left-0 z-10 py-3 px-5 text-gray-400 font-medium border-r border-white/5 whitespace-nowrap"
                        style={{ backgroundColor: BG_DARK }}
                      >
                         <div className="flex items-baseline justify-between">
                            <span>{isZh ? p.labelZh : p.labelEn}</span>
                            {p.unit && <span className="text-[10px] text-gray-600 font-mono ml-2">{p.unit}</span>}
                         </div>
                      </td>
                      {detailList.map(d => {
                        const val = getNestedValue(d, p.path);
                        const display = val != null && val !== '' ? String(val) : '—';
                        return (
                          <td key={d.base?.id} className="py-3 px-6 text-gray-200 font-mono text-sm tabular-nums">
                            {display}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODE: RADAR */}
        {displayMode === 'radar' && (
          <div className="h-[500px] rounded-2xl border border-white/10 bg-[#0f0f10]/40 p-4">
            <ReactECharts option={radarOption} style={{ height: '100%', width: '100%' }} />
          </div>
        )}

        {/* MODE: BAR */}
        {displayMode === 'bar' && (
          <div className="h-[500px] rounded-2xl border border-white/10 bg-[#0f0f10]/40 p-4 pt-6">
            <ReactECharts option={barOption} style={{ height: '100%', width: '100%' }} />
          </div>
        )}

        {/* MODE: HEATMAP */}
        {displayMode === 'heatmap' && (
          <div className="h-[500px] rounded-2xl border border-white/10 bg-[#0f0f10]/40 p-4">
            <ReactECharts option={heatmapOption} style={{ height: '100%', width: '100%' }} />
          </div>
        )}

      </div>
    </div>
  );
};

export default MaterialCompareBoard;