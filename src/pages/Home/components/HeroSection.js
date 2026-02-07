import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github } from 'lucide-react';
import { useTranslation } from '../../../contexts/LocaleContext';

// --- Background Components ---

const AuroraBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    {/* 主光斑：蓝绿色 (Teal) - 呼应品牌色 */}
    <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#00d4aa] rounded-full mix-blend-screen filter blur-[120px] opacity-[0.15] animate-pulse" />
    
    {/* 次光斑：深紫色 (Violet) - 增加深邃感 */}
    <div className="absolute top-[10%] right-[-5%] w-[40vw] h-[40vw] bg-[#7c3aed] rounded-full mix-blend-screen filter blur-[100px] opacity-[0.12]" />
    
    {/* 底部光晕 */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-t from-[#0a0e17] to-transparent z-10" />
  </div>
);

// --- Main Component ---

const HeroSection = () => {
  // 假设 useTranslation 返回的是翻译函数 t
  // 如果你的 context 返回的是对象 { t }, 请改为 const { t } = useTranslation();
  const t = useTranslation(); 

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center bg-[#0a0e17] overflow-hidden pt-20">
      <AuroraBackground />

      <div className="container mx-auto px-6 relative z-10 text-center">
        
        {/* Badge / Announcement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d4aa] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00d4aa]"></span>
          </span>
          <span className="text-xs font-medium text-white/80 tracking-wide">
            {t('hero.badge')}
          </span>
          <ArrowRight size={12} className="text-white/50" />
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
        >
          {t('hero.heading1')} <br />
          <span className="bg-gradient-to-r from-[#00d4aa] via-blue-400 to-purple-500 bg-clip-text text-transparent">
            {t('hero.heading2')}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-[#9aa0a6] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t('hero.description')}
        </motion.p>

        {/* Buttons Group */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16"
        >
          {/* Primary Button */}
          <button className="group relative px-8 py-4 bg-white text-black rounded-full font-semibold text-sm tracking-wide overflow-hidden transition-all hover:scale-105 active:scale-95">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity" />
            <span className="flex items-center gap-2">
              {t('hero.exploreRobots')} <ArrowRight size={18} />
            </span>
          </button>

          {/* Secondary Button */}
          <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-semibold text-sm tracking-wide backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95 flex items-center gap-2">
            <Github size={18} />
            {t('hero.starGitHub')}
          </button>
        </motion.div>

      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase">{t('hero.scroll')}</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
      </motion.div>

    </section>
  );
};

export default HeroSection;