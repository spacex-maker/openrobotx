import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  MapPin,
  Users,
  Calendar,
  TrendingUp,
  DollarSign,
  Award,
  Cpu,
  ExternalLink,
  Globe,
  Quote
} from 'lucide-react';
import AppHeader from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { addImageCompressSuffix } from '../../utils/imageUtils';

// --- 子组件定义 ---

/**
 * 独立的 Bento 风格数据卡片
 */
const StatCard = ({ icon: Icon, label, value, color, delay = 0 }) => {
  if (!value) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="group relative overflow-hidden bg-[#0f141e]/60 border border-white/5 rounded-2xl p-5 hover:bg-[#161b26] hover:border-white/10 transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-white/5 text-zinc-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
          <Icon size={18} style={{ color }} />
        </div>
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-lg font-bold text-white font-mono break-words leading-tight">
        {value}
      </div>
      {/* 底部动态线条 */}
      <div 
        className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-current to-transparent group-hover:w-full transition-all duration-500 opacity-50" 
        style={{ color }} 
      />
    </motion.div>
  );
};

/**
 * 章节标题组件
 */
const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-white">
      <Icon size={20} />
    </div>
    <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
  </div>
);

// --- 主布局组件 ---

const CompanyPageLayout = ({ data, theme }) => {
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  
  // 视差滚动效果配置
  const bgY = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const primary = theme?.primary || '#00d4aa';
  // 图片处理：宽屏大图
  const heroImageUrl = data.heroImage ? addImageCompressSuffix(data.heroImage, 1920) : '';

  return (
    <div className="min-h-screen bg-[#0a0e17] text-[#e8eaed] font-sans selection:bg-[#00d4aa]/30">
      <Helmet>
        <title>{`${data.name} - Open Robot X`}</title>
        <meta name="theme-color" content="#0a0e17" />
      </Helmet>
      
      <AppHeader />

      {/* --- Hero 区域 (Parallax) --- */}
      <div ref={heroRef} className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* 背景图层 */}
        <motion.div 
          style={{ y: bgY }}
          className="absolute inset-0 z-0"
        >
          {heroImageUrl && (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImageUrl})` }} 
            />
          )}
          {/* 渐变遮罩：确保文字可读性 */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17]/60 via-[#0a0e17]/80 to-[#0a0e17]" />
        </motion.div>

        {/* 核心内容 */}
        <motion.div 
          style={{ opacity }}
          className="relative z-10 container mx-auto px-6 text-center"
        >
          {data.region && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6 mx-auto">
              <Globe size={12} className="text-zinc-400" />
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">{data.region}</span>
            </div>
          )}
          
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-4"
            style={{ textShadow: `0 0 80px ${primary}40` }}
          >
            {data.name}
          </h1>
          
          {data.nameCn && (
            <div className="text-xl md:text-2xl text-zinc-500 font-light mb-8">
              {data.nameCn}
            </div>
          )}

          {data.tagline && (
             <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-300 font-medium leading-relaxed italic">
               “{data.tagline}”
             </p>
          )}
        </motion.div>

        {/* 滚动指示器 */}
        <motion.div 
          style={{ opacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        </motion.div>
      </div>

      {/* --- 主要内容区域 --- */}
      <div className="container mx-auto px-6 lg:px-12 pb-24 -mt-20 relative z-20">
        
        {/* 1. Bento Grid 数据概览 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          <StatCard icon={Calendar} label="Founded" value={data.foundedYear} color={primary} delay={0.1} />
          <StatCard icon={MapPin} label="HQ" value={data.headquarters} color={primary} delay={0.15} />
          <StatCard icon={Users} label="Team" value={data.employeeCount} color={primary} delay={0.2} />
          <StatCard icon={TrendingUp} label="Valuation" value={data.companyValuationUsd ? `$${data.companyValuationUsd}` : null} color={primary} delay={0.25} />
          <StatCard icon={DollarSign} label="Funding" value={data.totalFinancingUsd} color={primary} delay={0.3} />
          <StatCard icon={Award} label="Series" value={data.latestRound} color={primary} delay={0.35} />
          <StatCard icon={Cpu} label="Core Tech" value={data.coreTechnology} color={primary} delay={0.4} />
          <StatCard icon={Users} label="CEO" value={data.ceo} color={primary} delay={0.45} />
        </div>

        {/* 2. 双栏布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* 左侧：详细介绍 */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* 公司简介 */}
            {data.aboutParagraphs?.length > 0 && (
              <section>
                <SectionHeader title="Company Profile" icon={Quote} />
                <div className="prose prose-invert prose-lg max-w-none text-zinc-400">
                  {data.aboutParagraphs.map((p, i) => (
                    <p key={i} className="leading-relaxed mb-6">{p}</p>
                  ))}
                </div>
              </section>
            )}

            {/* 核心亮点列表 */}
            {data.highlights?.length > 0 && (
              <section>
                <SectionHeader title="Key Highlights" icon={Award} />
                <div className="grid gap-4">
                  {data.highlights.map((h, i) => (
                    <div 
                      key={i}
                      className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-colors"
                    >
                      <div className="mt-1 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: primary }} />
                      <span className="text-zinc-200">{h}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* 右侧：Sticky 侧边栏 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              
              {/* 官方链接卡片 */}
              {data.officialUrl && (
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1a1f2e] to-[#0f141e] border border-white/10 shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-2">Connect</h3>
                  <p className="text-sm text-zinc-500 mb-6">Visit their official channels for the latest updates.</p>
                  
                  <a 
                    href={data.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full p-4 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors group"
                  >
                    <span>Visit Website</span>
                    <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              )}

              {/* 预留：该公司旗下的机器人列表 */}
              <div className="p-6 rounded-3xl border border-white/10 bg-[#0f141e]/40">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">Robots</h3>
                  <span className="text-xs font-mono text-zinc-500">COMING SOON</span>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 rounded-lg bg-white/5 animate-pulse" />
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export { CompanyPageLayout };
export default CompanyPageLayout;