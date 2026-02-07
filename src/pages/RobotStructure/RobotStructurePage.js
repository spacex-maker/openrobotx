import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '../../contexts/LocaleContext';
import AppHeader from '../../components/Header/Header';
import { getRobotStructure } from '../../api/openrobotx';
import {
  PageWrap,
  NetworkStage,
  GridFloor,
  GridFloor2,
  WaveLayer,
  GlowOrb,
  OrbitRing,
  SvgLayer,
  DataParticle,
  FlowPath,
  StaticPath,
  NodeContainer,
  TechNodeCircle,
  CoreNodeCircle,
  SubNodeCircle,
  NodeLabel,
  ZoomHint,
  ZoomLevel,
  KeyNodeBadge,
  HeatIndicator,
} from './components/styles';
import { renderIcon, ICON_MAP } from './components/constants';
import {
  ControlPanel,
  LegendPanel,
  StatsPanel,
  NodeDetailPanel,
  AnalysisPanelContent,
  ParticleSystem,
} from './components';

// (styled components and ParticleSystem moved to ./components)
const RobotStructurePage = () => {
  const { locale } = useLocale();
  const isZh = !locale || locale === 'zh-CN' || String(locale).toLowerCase().startsWith('zh');
  const nodeTitle = (n) => (n && (isZh ? n.titleZh : n.titleEn)) || (n && n.titleZh) || (n && n.id) || '';
  const nodeDesc = (n) => (n && (isZh ? n.descZh : n.descEn)) || (n && n.descZh) || (n && n.descEn) || '';

  const [structure, setStructure] = useState({
    coreNode: null,
    layers: [],
    systems: [],
    subNodes: [],
    microNodes: [],
    crossConnections: [],
    subConnections: [],
    microConnections: [],
    crossLayerConnections: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRobotStructure()
      .then((res) => {
        if (res.success && res.data) {
          const d = res.data;
          const mapIcon = (node) => (node ? { ...node, icon: ICON_MAP[node.icon] || ICON_MAP.ApiOutlined } : null);
          const withAngle = (node) => {
            const n = mapIcon(node);
            if (n && (n.angle == null) && (n.angleOffset != null)) n.angle = Number(n.angleOffset);
            return n;
          };
          setStructure({
            coreNode: mapIcon(d.coreNode),
            layers: (d.layers || []).map(mapIcon),
            systems: (d.systems || []).map(withAngle),
            subNodes: (d.subNodes || []).map(withAngle),
            microNodes: (d.microNodes || []).map(mapIcon),
            crossConnections: d.crossConnections || [],
            subConnections: d.subConnections || [],
            microConnections: d.microConnections || [],
            crossLayerConnections: d.crossLayerConnections || [],
          });
        } else {
          setError(res.message || '加载失败');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.message || '加载失败');
        setLoading(false);
      });
  }, []);

  const CORE_NODE = structure.coreNode;
  const LAYERS = structure.layers || [];
  const SYSTEMS = structure.systems || [];
  const SUB_NODES = structure.subNodes || [];
  const MICRO_NODES = structure.microNodes || [];
  const CROSS_CONNECTIONS = structure.crossConnections || [];
  const SUB_CONNECTIONS = structure.subConnections || [];
  const MICRO_CONNECTIONS = structure.microConnections || [];
  const CROSS_LAYER_CONNECTIONS = structure.crossLayerConnections || [];
  const SUB_AND_CROSS_LAYER = [...SUB_CONNECTIONS, ...CROSS_LAYER_CONNECTIONS];

  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  // 网络拓扑控制状态
  const [showCrossConnections, setShowCrossConnections] = useState(true);
  const [showDataFlow, setShowDataFlow] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [viewMode, setViewMode] = useState('full'); // 'full', 'simple', 'layer', 'detailed'
  const [showSubNodes, setShowSubNodes] = useState(true);
  const [showMicroNodes, setShowMicroNodes] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [layerFilters, setLayerFilters] = useState({});
  const [zoomLevel, setZoomLevel] = useState(1); // 缩放级别 0.5-2.0
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [coreExpanded, setCoreExpanded] = useState(false); // 核心节点展开状态
  
  // 平移状态 - 用于拖动整个画布
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const stageRef = useRef(null);

  // 当接口返回 layers 后初始化层级筛选
  useEffect(() => {
    const layers = structure.layers || [];
    if (layers.length > 0 && Object.keys(layerFilters).length === 0) {
      setLayerFilters(layers.reduce((acc, layer) => ({ ...acc, [layer.id]: true }), {}));
    }
  }, [structure.layers]);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 鼠标滚轮缩放
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoomLevel(prev => Math.max(0.5, Math.min(2.5, prev + delta)));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // 监听空格键按下/释放
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !isSpacePressed) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(false);
        setIsDragging(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isSpacePressed]);

  // 拖动整个图 - 事件处理函数
  const handleMouseDown = (e) => {
    // 支持三种拖动方式：
    // 1. 右键拖动 (button === 2)
    // 2. 中键拖动 (button === 1)
    // 3. 空格键 + 左键拖动 (button === 0 && isSpacePressed)
    const isRightClick = e.button === 2;
    const isMiddleClick = e.button === 1;
    const isSpaceDrag = e.button === 0 && isSpacePressed;

    if (isRightClick || isMiddleClick || isSpaceDrag) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      e.preventDefault();
      requestAnimationFrame(() => {
        setPanOffset({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      });
    }
  };

  const handleMouseUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleContextMenu = (e) => {
    // 禁用右键菜单
    e.preventDefault();
  };

  // 监听全局鼠标移动和释放（只在拖动时）
  useEffect(() => {
    if (isDragging) {
      const moveHandler = (e) => handleMouseMove(e);
      const upHandler = (e) => handleMouseUp(e);

      window.addEventListener('mousemove', moveHandler);
      window.addEventListener('mouseup', upHandler);
      
      return () => {
        window.removeEventListener('mousemove', moveHandler);
        window.removeEventListener('mouseup', upHandler);
      };
    }
  }, [isDragging, dragStart.x, dragStart.y]);

  // 核心节点收起后取消选中
  useEffect(() => {
    if (selectedNode?.id === 'core' && !coreExpanded) {
      // 等待收起动画完成后取消选中（约2秒）
      const timer = setTimeout(() => {
        setSelectedNode(null);
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [coreExpanded, selectedNode]);

  const centerX = dimensions.width / 2 + panOffset.x;
  const centerY = (dimensions.height - 72) / 2 + panOffset.y;
  const scale = Math.min(dimensions.width / 1000, (dimensions.height - 72) / 800) * zoomLevel; 

  const getNodePos = (radius, angle) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: centerX + radius * scale * Math.cos(rad),
      y: centerY + radius * scale * Math.sin(rad),
    };
  };
  
  // 第二层(systems)典型半径，用于保证第四、五层在更外圈
  const LAYER2_RADIUS = 280;
  const SUB_OFFSET = 85;   // 第四层相对父系统外扩
  const MICRO_OFFSET = 65; // 第五层相对父子节点外扩
  
  const getSubNodePos = (parentRadius, parentAngle, subRadius, angleOffset) => {
    const parentR = Number(parentRadius) || LAYER2_RADIUS;
    const subR = Math.max(Number(subRadius) || 0, parentR + SUB_OFFSET);
    const rad = ((parentAngle ?? 0) + (angleOffset ?? 0) - 90) * (Math.PI / 180);
    return {
      x: centerX + subR * scale * Math.cos(rad),
      y: centerY + subR * scale * Math.sin(rad),
    };
  };
  
  const getMicroNodePos = (subNode, microRadius, angleOffset) => {
    const parent = SYSTEMS.find(s => s.id === subNode.parentId);
    if (!parent) return { x: centerX, y: centerY };
    const parentR = Number(parent.radius) || LAYER2_RADIUS;
    const subR = Math.max(Number(subNode.radius) || 0, parentR + SUB_OFFSET);
    const microR = Math.max(Number(microRadius) || 0, subR + MICRO_OFFSET);
    const rad = ((parent.angle ?? 0) + (subNode.angleOffset ?? 0) + (angleOffset ?? 0) - 90) * (Math.PI / 180);
    return {
      x: centerX + microR * scale * Math.cos(rad),
      y: centerY + microR * scale * Math.sin(rad),
    };
  };
  
  // 过滤节点函数
  const isNodeVisible = (node) => {
    // 搜索过滤
    if (searchTerm && !node.titleZh.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !node.titleEn.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    // 层级过滤
    if (node.parentId && !layerFilters[node.parentId]) {
      return false;
    }
    return true;
  };
  
  // 计算节点连接度（关键性指标）
  const getNodeConnectivity = useMemo(() => {
    const connectivity = {};
    
    // 统计跨层级连接
    CROSS_CONNECTIONS.forEach(conn => {
      connectivity[conn.from] = (connectivity[conn.from] || 0) + 1;
      connectivity[conn.to] = (connectivity[conn.to] || 0) + 1;
    });
    
    // 统计子节点连接与跨层连接
    SUB_CONNECTIONS.forEach(conn => {
      connectivity[conn.from] = (connectivity[conn.from] || 0) + 1;
      connectivity[conn.to] = (connectivity[conn.to] || 0) + 1;
    });
    CROSS_LAYER_CONNECTIONS.forEach(conn => {
      connectivity[conn.from] = (connectivity[conn.from] || 0) + 1;
      connectivity[conn.to] = (connectivity[conn.to] || 0) + 1;
    });
    
    // 统计微节点连接
    MICRO_CONNECTIONS.forEach(conn => {
      connectivity[conn.from] = (connectivity[conn.from] || 0) + 1;
      connectivity[conn.to] = (connectivity[conn.to] || 0) + 1;
    });
    
    // 统计父子连接
    SYSTEMS.forEach(sys => {
      connectivity[sys.id] = (connectivity[sys.id] || 0) + 1;
      connectivity[sys.parentId] = (connectivity[sys.parentId] || 0) + 1;
    });
    
    SUB_NODES.forEach(sub => {
      connectivity[sub.id] = (connectivity[sub.id] || 0) + 1;
      connectivity[sub.parentId] = (connectivity[sub.parentId] || 0) + 1;
    });
    
    MICRO_NODES.forEach(micro => {
      connectivity[micro.id] = (connectivity[micro.id] || 0) + 1;
      connectivity[micro.parentId] = (connectivity[micro.parentId] || 0) + 1;
    });
    
    return connectivity;
  }, []);
  
  // 识别关键节点（连接度 > 8）
  const keyNodes = useMemo(() => {
    return Object.entries(getNodeConnectivity)
      .filter(([id, count]) => count >= 6)
      .map(([id]) => id);
  }, [getNodeConnectivity]);

  // 计算所有节点位置供粒子系统使用
  const nodePositions = useMemo(() => {
    const positions = [{ x: centerX, y: centerY, color: '#ffffff' }];
    LAYERS.forEach(layer => {
      const pos = getNodePos(layer.radius, layer.angle);
      positions.push({ ...pos, color: layer.color });
    });
    SYSTEMS.forEach(sys => {
      const pos = getNodePos(sys.radius, sys.angle);
      positions.push({ ...pos, color: sys.color });
    });
    if (showSubNodes || showMicroNodes) {
      SUB_NODES.forEach(sub => {
        const parent = SYSTEMS.find(s => s.id === sub.parentId);
        if (parent) {
          const pos = getSubNodePos(parent.radius, parent.angle, sub.radius, sub.angleOffset);
          positions.push({ ...pos, color: sub.color });
        }
      });
    }
    if (showMicroNodes) {
      MICRO_NODES.forEach(micro => {
        const subNode = SUB_NODES.find(s => s.id === micro.parentId);
        if (subNode) {
          const pos = getMicroNodePos(subNode, micro.radius, micro.angleOffset);
          positions.push({ ...pos, color: micro.color });
        }
      });
    }
    return positions;
  }, [centerX, centerY, scale, showSubNodes, showMicroNodes]);

  const drawConnection = (start, end, color, isActive) => {
    const straightPath = `M${start.x},${start.y} L${end.x},${end.y}`;

    // 计算路径上的数据流粒子
    const particles = isActive ? Array.from({ length: 3 }, (_, i) => {
      const offset = (i / 3);
      return (
        <DataParticle
          key={`particle-${start.id}-${end.id}-${i}`}
          cx={start.x + (end.x - start.x) * offset}
          cy={start.y + (end.y - start.y) * offset}
          r={2}
          $color={color}
          initial={{ opacity: 0 }}
          animate={{
            cx: [start.x, end.x, start.x],
            cy: [start.y, end.y, start.y],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "linear"
          }}
        />
      );
    }) : null;

    return (
      <g key={`${start.id}-${end.id}`}>
        <StaticPath d={straightPath} />
        {isActive && (
          <>
            <FlowPath
              d={straightPath}
              $color={color}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            {particles}
          </>
        )}
      </g>
    );
  };

  if (loading) {
    return (
      <PageWrap style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <AppHeader />
        <div style={{ color: '#00d4aa', fontSize: '18px' }}>加载中...</div>
      </PageWrap>
    );
  }
  if (error) {
    return (
      <PageWrap style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: '16px' }}>
        <AppHeader />
        <div style={{ color: '#f472b6', fontSize: '16px' }}>{error}</div>
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <Helmet>
        <title>机器人系统架构 | Open Robot X</title>
      </Helmet>
      <AppHeader />

      <NetworkStage 
        ref={stageRef} 
        style={{ cursor: isDragging ? 'grabbing' : (isSpacePressed ? 'grab' : 'default') }}
        onMouseDown={handleMouseDown}
        onContextMenu={handleContextMenu}
      >
        {/* 多层背景 */}
        <GridFloor />
        <GridFloor2 />
        <WaveLayer />
        
        {/* 发光球体 */}
        <GlowOrb $color="#00d4aa" $duration={4} />
        <GlowOrb $color="#a78bfa" $duration={5} />
        <GlowOrb $color="#f472b6" $duration={6} />
        
        {/* 粒子系统 */}
        {showParticles && (
          <ParticleSystem 
            width={dimensions.width} 
            height={dimensions.height - 72}
            nodePositions={nodePositions}
            centerX={centerX}
            centerY={centerY}
          />
        )}
        
        {/* 控制面板 */}
        <ControlPanel
          isZh={isZh}
          layers={LAYERS}
          layerFilters={layerFilters}
          setLayerFilters={setLayerFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          showCrossConnections={showCrossConnections}
          setShowCrossConnections={setShowCrossConnections}
          showDataFlow={showDataFlow}
          setShowDataFlow={setShowDataFlow}
          showParticles={showParticles}
          setShowParticles={setShowParticles}
          showSubNodes={showSubNodes}
          setShowSubNodes={setShowSubNodes}
          showMicroNodes={showMicroNodes}
          setShowMicroNodes={setShowMicroNodes}
          showAnalysis={showAnalysis}
          setShowAnalysis={setShowAnalysis}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          subCount={SUB_NODES.length}
          microCount={MICRO_NODES.length}
        />
        
        {/* 多个旋转轨道环 */}
        <OrbitRing $size={130 * scale} $speed={60} $color="rgba(255,255,255,0.3)" style={{ borderStyle: 'solid', opacity: 0.1 }} />
        <OrbitRing $size={220 * scale} $speed={80} $color="rgba(0,212,170,0.3)" style={{ opacity: 0.15 }} />
        <OrbitRing $size={300 * scale} $speed={90} $color="rgba(164,139,250,0.3)" style={{ opacity: 0.1 }} />
        <OrbitRing $size={370 * scale} $speed={100} $color="rgba(244,114,182,0.3)" style={{ opacity: 0.08 }} />

        <SvgLayer>
          {/* Core to Layers */}
          {viewMode !== 'layer' && LAYERS.map((layer, idx) => {
            const pos = getNodePos(layer.radius, layer.angle);
            const isActive = hoveredNodeId === 'core' || hoveredNodeId === layer.id || selectedNode?.id === layer.id || selectedNode?.id === 'core';
            const isCoreSelected = selectedNode?.id === 'core';
            
            return (
              <motion.g 
                key={`core-${layer.id}-${isCoreSelected ? coreExpanded ? 'expand' : 'collapse' : 'static'}`}
                initial={{ opacity: isCoreSelected ? (coreExpanded ? 0 : 1) : 1 }}
                animate={{ opacity: isCoreSelected ? (coreExpanded ? 1 : 0) : 1 }}
                transition={{ 
                  delay: isCoreSelected ? (coreExpanded ? idx * 0.3 : (5 - idx) * 0.2) : 0, 
                  duration: coreExpanded ? 0.6 : 0.4 
                }}
              >
                {drawConnection({ x: centerX, y: centerY, id: 'core' }, { ...pos, id: layer.id }, layer.color, isActive && showDataFlow)}
              </motion.g>
            );
          })}
          
          {/* Layers to Systems */}
          {(viewMode === 'full' || viewMode === 'layer' || viewMode === 'detailed') && SYSTEMS.map((sys, idx) => {
            const parent = LAYERS.find(l => l.id === sys.parentId);
            if (!parent) return null;
            const parentPos = getNodePos(parent.radius, parent.angle);
            const sysPos = getNodePos(sys.radius, sys.angle);
            const isActive = hoveredNodeId === parent.id || hoveredNodeId === sys.id || selectedNode?.id === sys.id || selectedNode?.id === parent.id || selectedNode?.id === 'core';
            const isCoreSelected = selectedNode?.id === 'core';
            
            return (
              <motion.g 
                key={`layer-sys-${sys.id}-${isCoreSelected ? coreExpanded ? 'expand' : 'collapse' : 'static'}`}
                initial={{ opacity: isCoreSelected ? (coreExpanded ? 0 : 1) : 1 }}
                animate={{ opacity: isCoreSelected ? (coreExpanded ? 1 : 0) : 1 }}
                transition={{ 
                  delay: isCoreSelected ? (coreExpanded ? 2.4 + idx * 0.15 : (18 - idx) * 0.08) : 0, 
                  duration: coreExpanded ? 0.5 : 0.3 
                }}
              >
                {drawConnection({ ...parentPos, id: parent.id }, { ...sysPos, id: sys.id }, sys.color, isActive && showDataFlow)}
              </motion.g>
            );
          })}
          
          {/* 子节点到父节点的连接 */}
          {(showSubNodes || viewMode === 'detailed') && SUB_NODES.map((sub, idx) => {
            const parent = SYSTEMS.find(s => s.id === sub.parentId);
            if (!parent) return null;
            
            const parentPos = getNodePos(parent.radius, parent.angle);
            const subPos = getSubNodePos(parent.radius, parent.angle, sub.radius, sub.angleOffset);
            const isActive = hoveredNodeId === sub.id || hoveredNodeId === parent.id || 
                           selectedNode?.id === sub.id || selectedNode?.id === parent.id || selectedNode?.id === 'core';
            const isCoreSelected = selectedNode?.id === 'core';
            
            return (
              <motion.g 
                key={`sub-parent-${idx}-${isCoreSelected ? coreExpanded ? 'expand' : 'collapse' : 'static'}`}
                initial={{ opacity: isCoreSelected ? (coreExpanded ? 0 : 1) : 1 }}
                animate={{ opacity: isCoreSelected ? (coreExpanded ? 1 : 0) : 1 }}
                transition={{ 
                  delay: isCoreSelected ? (coreExpanded ? 9.2 + idx * 0.06 : (44 - idx) * 0.035) : 0, 
                  duration: coreExpanded ? 0.4 : 0.25 
                }}
              >
                <StaticPath 
                  d={`M${parentPos.x},${parentPos.y} L${subPos.x},${subPos.y}`}
                  $active={isActive}
                  $glowColor={sub.color}
                  style={{ 
                    strokeWidth: isActive ? 1.5 : 1,
                    opacity: isActive ? 0.6 : 0.08,
                    stroke: sub.color
                  }}
                />
              </motion.g>
            );
          })}
          
          {/* 微节点到父节点的连接 */}
          {(showMicroNodes || viewMode === 'detailed') && MICRO_NODES.map((micro, idx) => {
            const subNode = SUB_NODES.find(s => s.id === micro.parentId);
            if (!subNode) return null;
            
            const parent = SYSTEMS.find(s => s.id === subNode.parentId);
            if (!parent) return null;
            
            const subPos = getSubNodePos(parent.radius, parent.angle, subNode.radius, subNode.angleOffset);
            const microPos = getMicroNodePos(subNode, micro.radius, micro.angleOffset);
            const isActive = hoveredNodeId === micro.id || hoveredNodeId === subNode.id ||
                           selectedNode?.id === micro.id || selectedNode?.id === subNode.id || selectedNode?.id === 'core';
            const isCoreSelected = selectedNode?.id === 'core';
            
            return (
              <motion.g 
                key={`micro-parent-${idx}-${isCoreSelected ? coreExpanded ? 'expand' : 'collapse' : 'static'}`}
                initial={{ opacity: isCoreSelected ? (coreExpanded ? 0 : 1) : 1 }}
                animate={{ opacity: isCoreSelected ? (coreExpanded ? 1 : 0) : 1 }}
                transition={{ 
                  delay: isCoreSelected ? (coreExpanded ? 15.0 + idx * 0.025 : (59 - idx) * 0.015) : 0, 
                  duration: coreExpanded ? 0.25 : 0.15 
                }}
              >
                <StaticPath 
                  d={`M${subPos.x},${subPos.y} L${microPos.x},${microPos.y}`}
                  $active={isActive}
                  $glowColor={micro.color}
                  style={{ 
                    strokeWidth: isActive ? 1 : 0.5,
                    opacity: isActive ? 0.5 : 0.05,
                    stroke: micro.color
                  }}
                />
              </motion.g>
            );
          })}
          
          {/* 微节点间的连接 */}
          {(showMicroNodes || viewMode === 'detailed') && MICRO_CONNECTIONS.map((conn, idx) => {
            // 查找节点，支持跨层级连接
            const findNodePos = (nodeId) => {
              // 尝试查找微节点
              const microNode = MICRO_NODES.find(m => m.id === nodeId);
              if (microNode) {
                const subParent = SUB_NODES.find(s => s.id === microNode.parentId);
                if (subParent) {
                  return getMicroNodePos(subParent, microNode.radius, microNode.angleOffset);
                }
              }
              
              // 尝试查找子节点
              const subNode = SUB_NODES.find(s => s.id === nodeId);
              if (subNode) {
                const parent = SYSTEMS.find(s => s.id === subNode.parentId);
                if (parent) {
                  return getSubNodePos(parent.radius, parent.angle, subNode.radius, subNode.angleOffset);
                }
              }
              
              // 尝试查找系统节点
              const sysNode = SYSTEMS.find(s => s.id === nodeId);
              if (sysNode) {
                return getNodePos(sysNode.radius, sysNode.angle);
              }
              
              // 尝试查找层级节点
              const layerNode = LAYERS.find(l => l.id === nodeId);
              if (layerNode) {
                return getNodePos(layerNode.radius, layerNode.angle);
              }
              
              return null;
            };
            
            const fromPos = findNodePos(conn.from);
            const toPos = findNodePos(conn.to);
            if (!fromPos || !toPos) return null;
            
            const isActive = hoveredNodeId === conn.from || hoveredNodeId === conn.to ||
                           selectedNode?.id === conn.from || selectedNode?.id === conn.to || selectedNode?.id === 'core';
            const isCoreSelected = selectedNode?.id === 'core';
            
            return (
              <motion.g 
                key={`micro-conn-${idx}-${isCoreSelected ? coreExpanded ? 'expand' : 'collapse' : 'static'}`}
                initial={{ opacity: isCoreSelected ? (coreExpanded ? 0 : 1) : 1 }}
                animate={{ opacity: isCoreSelected ? (coreExpanded ? 1 : 0) : 1 }}
                transition={{ 
                  delay: isCoreSelected ? (coreExpanded ? 16.8 + idx * 0.015 : (144 - idx) * 0.005) : 0, 
                  duration: coreExpanded ? 0.2 : 0.15 
                }}
              >
                <StaticPath 
                  d={`M${fromPos.x},${fromPos.y} L${toPos.x},${toPos.y}`}
                  $active={isActive}
                  $glowColor={conn.color}
                  style={{ 
                    strokeDasharray: '1,3',
                    strokeWidth: isActive ? 1 : 0.5,
                    opacity: isActive ? 0.6 : 0.04,
                    stroke: conn.color
                  }}
                />
                {isActive && showDataFlow && (
                  <FlowPath
                    d={`M${fromPos.x},${fromPos.y} L${toPos.x},${toPos.y}`}
                    $color={conn.color}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.7 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    style={{ strokeDasharray: '1,2', strokeWidth: 1 }}
                  />
                )}
              </motion.g>
            );
          })}
          
          {/* 子节点间连接 + 跨层连接（system↔sub、sub↔micro 等，共用 findNodePos）；开启「显示跨层连接」时也会绘制 */}
          {(showSubNodes || viewMode === 'detailed' || showCrossConnections) && SUB_AND_CROSS_LAYER.map((conn, idx) => {
            // 查找节点，支持跨层级连接（system / subNode / microNode / layer）
            const findNodePos = (nodeId) => {
              const subNode = SUB_NODES.find(s => s.id === nodeId);
              if (subNode) {
                const parent = SYSTEMS.find(s => s.id === subNode.parentId);
                if (parent) {
                  return getSubNodePos(parent.radius, parent.angle, subNode.radius, subNode.angleOffset);
                }
              }
              const microNode = MICRO_NODES.find(m => m.id === nodeId);
              if (microNode) {
                const subParent = SUB_NODES.find(s => s.id === microNode.parentId);
                if (subParent) return getMicroNodePos(subParent, microNode.radius, microNode.angleOffset);
                }
              const sysNode = SYSTEMS.find(s => s.id === nodeId);
              if (sysNode) return getNodePos(sysNode.radius, sysNode.angle);
              const layerNode = LAYERS.find(l => l.id === nodeId);
              if (layerNode) return getNodePos(layerNode.radius, layerNode.angle);
              return null;
            };
            
            const fromPos = findNodePos(conn.from);
            const toPos = findNodePos(conn.to);
            if (!fromPos || !toPos) return null;
            
            const isCrossLayer = idx >= (SUB_CONNECTIONS?.length ?? 0);
            const isActive = hoveredNodeId === conn.from || hoveredNodeId === conn.to || 
                           selectedNode?.id === conn.from || selectedNode?.id === conn.to || selectedNode?.id === 'core';
            const isCoreSelected = selectedNode?.id === 'core';
            const baseOpacity = isCrossLayer ? 0.28 : 0.08;
            
            return (
              <motion.g 
                key={`sub-conn-${idx}-${isCoreSelected ? coreExpanded ? 'expand' : 'collapse' : 'static'}`}
                initial={{ opacity: isCoreSelected ? (coreExpanded ? 0 : 1) : 1 }}
                animate={{ opacity: isCoreSelected ? (coreExpanded ? 1 : 0) : 1 }}
                transition={{ 
                  delay: isCoreSelected ? (coreExpanded ? 12.3 + idx * 0.03 : (87 - idx) * 0.02) : 0, 
                  duration: coreExpanded ? 0.3 : 0.2 
                }}
              >
                <StaticPath 
                  d={`M${fromPos.x},${fromPos.y} L${toPos.x},${toPos.y}`}
                  $active={isActive}
                  $glowColor={conn.color}
                  style={{ 
                    strokeDasharray: isCrossLayer ? '4,4' : '2,4',
                    strokeWidth: isActive ? (conn.weight || 1) * 1.3 : (conn.weight || 1),
                    opacity: isActive ? 0.65 : baseOpacity,
                    stroke: conn.color
                  }}
                />
                {isActive && showDataFlow && (
                  <FlowPath
                    d={`M${fromPos.x},${fromPos.y} L${toPos.x},${toPos.y}`}
                    $color={conn.color}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.7 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    style={{ strokeDasharray: '2,2', strokeWidth: (conn.weight || 1) * 1.2 }}
                  />
                )}
              </motion.g>
            );
          })}
          
          {/* 跨层级协作连接 */}
          {showCrossConnections && (viewMode === 'full' || viewMode === 'detailed') && CROSS_CONNECTIONS.map((conn, idx) => {
            const fromNode = SYSTEMS.find(s => s.id === conn.from);
            const toNode = SYSTEMS.find(s => s.id === conn.to);
            if (!fromNode || !toNode) return null;
            
            const fromPos = getNodePos(fromNode.radius, fromNode.angle);
            const toPos = getNodePos(toNode.radius, toNode.angle);
            const isActive = hoveredNodeId === conn.from || hoveredNodeId === conn.to || 
                           selectedNode?.id === conn.from || selectedNode?.id === conn.to || selectedNode?.id === 'core';
            const isCoreSelected = selectedNode?.id === 'core';
            
            return (
              <motion.g 
                key={`cross-${idx}-${isCoreSelected ? coreExpanded ? 'expand' : 'collapse' : 'static'}`}
                initial={{ opacity: isCoreSelected ? (coreExpanded ? 0 : 1) : 1 }}
                animate={{ opacity: isCoreSelected ? (coreExpanded ? 1 : 0) : 1 }}
                transition={{ 
                  delay: isCoreSelected ? (coreExpanded ? 5.75 + idx * 0.035 : (85 - idx) * 0.025) : 0, 
                  duration: coreExpanded ? 0.4 : 0.25 
                }}
              >
                <StaticPath 
                  d={`M${fromPos.x},${fromPos.y} L${toPos.x},${toPos.y}`}
                  $active={isActive}
                  $glowColor={conn.color}
                  style={{ 
                    strokeDasharray: '5,5',
                    strokeWidth: conn.weight || 1,
                    opacity: isActive ? 0.4 : 0.1,
                    stroke: conn.color
                  }} 
                />
                {isActive && showDataFlow && (
                  <FlowPath
                    d={`M${fromPos.x},${fromPos.y} L${toPos.x},${toPos.y}`}
                    $color={conn.color}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{ strokeDasharray: '3,3', strokeWidth: conn.weight || 1 }}
                  />
                )}
              </motion.g>
            );
          })}
        </SvgLayer>

        {/* Core Node */}
        <NodeContainer
          style={{ left: centerX - 40, top: centerY - 40 }}
          onClick={() => {
            if (selectedNode?.id === 'core') {
              // 已选中核心，切换展开/收起
              setCoreExpanded(!coreExpanded);
            } else {
              // 首次选中核心
              setSelectedNode(CORE_NODE);
              setCoreExpanded(true);
            }
          }}
          onMouseEnter={() => setHoveredNodeId('core')}
          onMouseLeave={() => setHoveredNodeId(null)}
        >
          <CoreNodeCircle $size={80} $iconSize={36} $color="#fff">
            {renderIcon(CORE_NODE?.icon)}
          </CoreNodeCircle>
          <NodeLabel $active={true} $color="#fff">
            {nodeTitle(CORE_NODE)}
          </NodeLabel>
        </NodeContainer>

        {/* Layer Nodes */}
        {LAYERS.map((layer, i) => {
          const pos = getNodePos(layer.radius, layer.angle);
          const isActive = hoveredNodeId === layer.id || selectedNode?.id === layer.id;
          return (
            <NodeContainer
              key={layer.id}
              style={{ left: pos.x - 30, top: pos.y - 30 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedNode(layer)}
              onMouseEnter={() => setHoveredNodeId(layer.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              <TechNodeCircle $size={60} $color={layer.color} $iconSize={24}>
                {renderIcon(layer.icon)}
              </TechNodeCircle>
              <NodeLabel $active={isActive} $color={layer.color}>
                {nodeTitle(layer)}
              </NodeLabel>
            </NodeContainer>
          );
        })}

        {/* System Nodes */}
        {(viewMode === 'full' || viewMode === 'layer' || viewMode === 'detailed') && SYSTEMS.filter(isNodeVisible).map((sys, i) => {
          const pos = getNodePos(sys.radius, sys.angle);
          const isActive = hoveredNodeId === sys.id || selectedNode?.id === sys.id;
          const isHighlighted = searchTerm && (sys.titleZh.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                                sys.titleEn.toLowerCase().includes(searchTerm.toLowerCase()));
          return (
            <NodeContainer
              key={sys.id}
              style={{ left: pos.x - 25, top: pos.y - 25 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              onClick={() => setSelectedNode(sys)}
              onMouseEnter={() => setHoveredNodeId(sys.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              <TechNodeCircle 
                $size={50} 
                $color={sys.color} 
                $iconSize={20}
                style={isHighlighted ? { 
                  transform: 'scale(1.15)', 
                  boxShadow: `0 0 40px ${sys.color}80`,
                  animation: 'none'
                } : {}}
              >
                {renderIcon(sys.icon)}
                {keyNodes.includes(sys.id) && <KeyNodeBadge>★</KeyNodeBadge>}
                <HeatIndicator $heat={getNodeConnectivity[sys.id] || 0} />
              </TechNodeCircle>
              <NodeLabel 
                $active={isActive || isHighlighted} 
                $color={sys.color}
                style={isHighlighted ? { fontWeight: '700', fontSize: '14px' } : {}}
              >
                {nodeTitle(sys)}
              </NodeLabel>
            </NodeContainer>
          );
        })}
        
        {/* Sub Nodes (三级子节点) */}
        {(showSubNodes || viewMode === 'detailed') && SUB_NODES.map((sub, i) => {
          const parent = SYSTEMS.find(s => s.id === sub.parentId);
          if (!parent) return null;
          
          const pos = getSubNodePos(parent.radius, parent.angle, sub.radius, sub.angleOffset);
          const isActive = hoveredNodeId === sub.id || selectedNode?.id === sub.id;
          return (
            <NodeContainer
              key={sub.id}
              style={{ left: pos.x - 18, top: pos.y - 18 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 + i * 0.05 }}
              onClick={() => setSelectedNode({
                ...sub,
                descZh: `${parent.titleZh}的核心组件，负责具体功能实现。`,
                descEn: `Core component of ${parent.titleEn || parent.titleZh}, for specific functionality.`,
                features: isZh ? [`属于 ${parent.titleZh}`, '独立处理单元', '高效数据处理'] : [`Part of ${parent.titleEn || parent.titleZh}`, 'Independent unit', 'Data processing'],
                stats: isZh ? { '类型': '子系统', '状态': '运行中' } : { 'Type': 'Subsystem', 'Status': 'Running' }
              })}
              onMouseEnter={() => setHoveredNodeId(sub.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              <SubNodeCircle $size={36} $color={sub.color} $iconSize={14}>
                {renderIcon(sub.icon)}
              </SubNodeCircle>
              <NodeLabel 
                $active={isActive} 
                $color={sub.color}
                style={{ fontSize: '10px', padding: '2px 6px' }}
              >
                {nodeTitle(sub)}
              </NodeLabel>
            </NodeContainer>
          );
        })}
        
        {/* Micro Nodes (四级微节点) */}
        {(showMicroNodes || viewMode === 'detailed') && MICRO_NODES.map((micro, i) => {
          const subNode = SUB_NODES.find(s => s.id === micro.parentId);
          if (!subNode) return null;
          
          const pos = getMicroNodePos(subNode, micro.radius, micro.angleOffset);
          const isActive = hoveredNodeId === micro.id || selectedNode?.id === micro.id;
          return (
            <NodeContainer
              key={micro.id}
              style={{ left: pos.x - 12, top: pos.y - 12 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 + i * 0.02 }}
              onClick={() => setSelectedNode({
                ...micro,
                descZh: `${subNode.titleZh}的微小处理单元，负责最底层的功能实现。`,
                descEn: `Micro unit of ${subNode.titleEn || subNode.titleZh}, for bottom-layer functionality.`,
                features: isZh ? [`属于 ${subNode.titleZh}`, '原子级处理', '极速响应'] : [`Part of ${subNode.titleEn || subNode.titleZh}`, 'Atomic processing', 'Fast response'],
                stats: isZh ? { '类型': '微组件', '状态': 'Active' } : { 'Type': 'Micro', 'Status': 'Active' }
              })}
              onMouseEnter={() => setHoveredNodeId(micro.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              <SubNodeCircle $size={24} $color={micro.color} $iconSize={10}>
                {renderIcon(micro.icon)}
              </SubNodeCircle>
              <NodeLabel 
                $active={isActive} 
                $color={micro.color}
                style={{ fontSize: '9px', padding: '1px 4px' }}
              >
                {nodeTitle(micro)}
              </NodeLabel>
            </NodeContainer>
          );
        })}
        
        {/* 缩放提示 */}
        <ZoomHint>
          <span>🖱️ {isZh ? '滚轮缩放' : 'Scroll to zoom'}</span>
          <ZoomLevel>
            <span className="label">{isZh ? '缩放:' : 'Zoom:'}</span>
            <span className="value">{(zoomLevel * 100).toFixed(0)}%</span>
          </ZoomLevel>
        </ZoomHint>

        <AnalysisPanelContent
          show={showAnalysis}
          isZh={isZh}
          coreNode={CORE_NODE}
          layers={LAYERS}
          systems={SYSTEMS}
          subNodes={SUB_NODES}
          microNodes={MICRO_NODES}
          crossConnections={CROSS_CONNECTIONS}
          subConnections={SUB_CONNECTIONS}
          microConnections={MICRO_CONNECTIONS}
          crossLayerConnections={CROSS_LAYER_CONNECTIONS}
        />
        
        {/* 图例面板 */}
        <LegendPanel layers={LAYERS} panelOpen={!!selectedNode} isZh={isZh} />
        
        {/* 网络统计面板 */}
        <StatsPanel
          isZh={isZh}
          layers={LAYERS}
          systems={SYSTEMS}
          subNodes={SUB_NODES}
          microNodes={MICRO_NODES}
          crossConnections={CROSS_CONNECTIONS}
          subConnections={SUB_CONNECTIONS}
          microConnections={MICRO_CONNECTIONS}
          crossLayerConnections={CROSS_LAYER_CONNECTIONS}
          getNodeConnectivity={getNodeConnectivity}
          keyNodes={keyNodes}
        />

      </NetworkStage>

      <NodeDetailPanel
        selectedNode={selectedNode}
        onClose={() => setSelectedNode(null)}
        isZh={isZh}
        getNodeConnectivity={getNodeConnectivity}
        keyNodes={keyNodes}
        crossConnections={CROSS_CONNECTIONS}
        subConnections={SUB_CONNECTIONS}
        microConnections={MICRO_CONNECTIONS}
        crossLayerConnections={CROSS_LAYER_CONNECTIONS}
        layers={LAYERS}
        systems={SYSTEMS}
        subNodes={SUB_NODES}
        microNodes={MICRO_NODES}
      />
    </PageWrap>
  );
};

export default RobotStructurePage;
