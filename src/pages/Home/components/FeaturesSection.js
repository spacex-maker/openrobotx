import React from 'react';
import { motion } from 'framer-motion';
import {
  GitBranch,
  Box,
  Sparkles,
  ArrowRight,
  Layers,
  Zap,
  GitCommit,
  GitMerge
} from 'lucide-react';

// --- Assets & Sub-components ---

const GridPattern = () => (
  <div className="absolute inset-0 z-0 pointer-events-none">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17] via-transparent to-[#0a0e17]"></div>
  </div>
);

/**
 * 模拟 Git 提交历史的可视化组件
 */
const GitGraphVisual = () => (
  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-64 h-full opacity-40 group-hover:opacity-100 group-hover:translate-x-4 transition-all duration-500 pointer-events-none hidden md:block">
    <div className="relative h-full w-full flex flex-col justify-center gap-6">
      {/* Commit Nodes */}
      <div className="flex items-center gap-3 ml-8">
        <div className="w-3 h-3 rounded-full bg-[#00d4aa] ring-4 ring-[#00d4aa]/10" />
        <div className="h-px w-12 bg-[#00d4aa]/30" />
        <div className="px-2 py-1 rounded bg-[#00d4aa]/10 text-[10px] text-[#00d4aa] font-mono border border-[#00d4aa]/20">
          fix: joint_limit
        </div>
      </div>
      <div className="flex items-center gap-3 ml-0">
        <div className="w-3 h-3 rounded-full bg-white/50 ring-4 ring-white/5" />
        <div className="h-px w-20 bg-white/10" />
        <div className="px-2 py-1 rounded bg-white/5 text-[10px] text-white/40 font-mono border border-white/10">
          feat: arm_v2
        </div>
      </div>
       <div className="flex items-center gap-3 ml-8">
        <div className="w-3 h-3 rounded-full bg-white/50 ring-4 ring-white/5" />
        <div className="h-px w-12 bg-white/10" />
         <div className="px-2 py-1 rounded bg-white/5 text-[10px] text-white/40 font-mono border border-white/10">
          chore: update BOM
        </div>
      </div>
      
      {/* Connecting Lines (Vertical) */}
      <div className="absolute left-[1.65rem] top-[30%] bottom-[30%] w-px bg-gradient-to-b from-[#00d4aa]/30 via-white/10 to-transparent -z-10" />
      <div className="absolute left-[0.35rem] top-[45%] h-12 w-6 border-b border-l border-white/10 rounded-bl-xl -z-10" />
    </div>
  </div>
);

// --- Main Components ---

const BentoCard = ({ children, className = "", delay = 0, visual }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`group relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0f141e]/80 backdrop-blur-xl transition-all duration-500 hover:border-white/[0.15] hover:bg-[#161b26] ${className}`}
    >
      {/* Noise Texture (Optional enhancement) */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />
      
      {/* Dynamic Glow */}
      <div className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00d4aa]/5 via-purple-500/5 to-transparent blur-xl" />
      </div>

      <div className="relative z-10 h-full p-8 flex flex-col">
        {children}
      </div>

      {/* Background Visual Injection */}
      {visual}
    </motion.div>
  );
};

const IconBox = ({ icon: Icon, color = "teal" }) => {
  const colorMap = {
    teal: "text-[#00d4aa] bg-[#00d4aa]/10 border-[#00d4aa]/20 group-hover:bg-[#00d4aa] group-hover:text-black group-hover:border-[#00d4aa]",
    purple: "text-[#a855f7] bg-[#a855f7]/10 border-[#a855f7]/20 group-hover:bg-[#a855f7] group-hover:text-white group-hover:border-[#a855f7]",
    blue: "text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/20 group-hover:bg-[#3b82f6] group-hover:text-white group-hover:border-[#3b82f6]",
    orange: "text-[#f97316] bg-[#f97316]/10 border-[#f97316]/20 group-hover:bg-[#f97316] group-hover:text-white group-hover:border-[#f97316]",
  };

  return (
    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${colorMap[color]} transition-all duration-300`}>
      <Icon size={24} strokeWidth={1.5} />
    </div>
  );
};

// --- Section ---

const FeaturesSection = () => {
  return (
    <section className="relative w-full bg-[#0a0e17] py-32 overflow-hidden">
      <GridPattern />
      
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative z-10">
        
        {/* Header Section */}
        <div className="mb-20 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-8 bg-gradient-to-r from-[#00d4aa] to-transparent" />
            <span className="text-[#00d4aa] font-medium tracking-widest uppercase text-xs">Workspace & Tools</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]"
          >
            不仅是社区，<br />
            是具身智能的 <span className="bg-gradient-to-r from-[#00d4aa] to-[#0ea5e9] bg-clip-text text-transparent">军火库</span>。
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-lg text-zinc-400 leading-relaxed max-w-2xl"
          >
            OpenRobotX 提供全栈式机器人开发工具链，打通从灵感到量产的“最后一公里”。
            无缝集成仿真、版本控制与 AI 生成能力。
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
          
          {/* Card 1: Hardware Git (Wide) */}
          <BentoCard className="md:col-span-2" delay={0.1} visual={<GitGraphVisual />}>
            <div className="flex justify-between items-start mb-auto">
              <IconBox icon={GitBranch} color="teal" />
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00d4aa]/20 bg-[#00d4aa]/5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00d4aa] animate-pulse" />
                <span className="text-xs font-medium text-[#00d4aa]">Live Sync</span>
              </div>
            </div>
            <div className="mt-12 max-w-lg relative z-10">
              <h3 className="text-2xl font-bold text-white mb-4">Hardware Git</h3>
              <p className="text-zinc-400 leading-relaxed">
                像管理代码一样管理硬件。支持 URDF/CAD 文件的版本控制 (Fork/Merge) 与多人协作，回溯每一次机械结构的迭代，杜绝 "最终版_v3_改.stp"。
              </p>
            </div>
          </BentoCard>

          {/* Card 2: AI Co-Pilot (Tall) */}
          <BentoCard 
            className="md:col-span-1 md:row-span-2 bg-gradient-to-b from-[#1a1033]/40 to-[#0f141e]" 
            delay={0.2}
          >
            <div className="flex justify-between items-start mb-8">
              <IconBox icon={Sparkles} color="purple" />
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
            </div>
            
            {/* AI Visual Interface */}
            <div className="flex-1 mb-8 relative">
                <div className="absolute inset-0 rounded-xl border border-purple-500/10 bg-purple-500/5 overflow-hidden flex flex-col items-center justify-center p-4">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent absolute top-0 animate-scan" />
                    <Zap className="text-purple-500 mb-3 opacity-80" size={32} />
                    <div className="text-xs text-purple-300 font-mono text-center">
                        Generating structure...<br/>
                        <span className="opacity-50">optimize for: durability</span>
                    </div>
                </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-3">AI Co-Pilot</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                集成 ai2obj 核心生成能力。输入 "双足机器人腿部结构"，AI 即可生成基础机械模型。
              </p>
              
              <button className="w-full py-3 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 text-sm font-semibold hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-2 group/btn">
                Try AI Generation 
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </BentoCard>

          {/* Card 3: Cloud Simulation */}
          <BentoCard delay={0.3}>
             <div className="flex justify-between items-start mb-auto">
              <IconBox icon={Box} color="blue" />
              <span className="px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Beta
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-2">Cloud Simulation</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Web 端原生集成的物理仿真环境。一键将您的 URDF 模型加载至云端调试。
              </p>
            </div>
          </BentoCard>

          {/* Card 4: Smart BOM */}
          <BentoCard delay={0.4}>
             <div className="flex justify-between items-start mb-auto">
              <IconBox icon={Layers} color="orange" />
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-2">Smart BOM</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                AI 自动解析设计图纸，实时匹配供应链价格与库存，缩短采购周期。
              </p>
            </div>
          </BentoCard>

        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;