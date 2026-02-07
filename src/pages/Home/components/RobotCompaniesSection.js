import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  ArrowRight, 
  ExternalLink, 
  TrendingUp, 
  Globe 
} from 'lucide-react';
import { getCompanyList } from '../../../api/openrobotx';
import { apiCompanyToCard } from '../../Companies/companyAdapter';

// --- Sub Components ---

/**
 * 加载占位骨架屏
 */
const LoadingSkeleton = () => (
  <div className="flex gap-6 overflow-hidden px-6 pb-12">
    {[1, 2, 3, 4].map((i) => (
      <div 
        key={i} 
        className="shrink-0 min-w-[320px] md:min-w-[400px] h-[500px] rounded-[2rem] bg-[#161b26]/50 border border-white/5 animate-pulse" 
      />
    ))}
  </div>
);

/**
 * 单个公司卡片组件
 */
const CompanyCard = ({ company }) => {
  const primaryColor = company.theme?.primary || '#00d4aa';
  
  return (
    <motion.div 
      className="group relative w-full h-full rounded-[2rem] overflow-hidden bg-[#0f141e]/60 border border-white/10 backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:shadow-2xl flex flex-col"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Brand Glow Effect (Dynamic based on company color) */}
      <div 
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: primaryColor }}
      />

      {/* Hero Image Section */}
      <div className="relative h-1/2 w-full overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f141e] to-transparent z-10" />
        
        {company.heroImage ? (
          <img 
            src={company.heroImage} 
            alt={company.name} 
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-white/10">
            <Globe size={64} />
          </div>
        )}
        
        {/* Floating Region Badge */}
        <div className="absolute top-6 left-6 z-20 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md flex items-center gap-1.5">
          <Globe size={12} className="text-zinc-400" />
          <span className="text-xs font-medium text-white/90 uppercase tracking-wider">
            {company.region || 'Global'}
          </span>
        </div>

        {/* Official Link (Top Right) */}
        {company.officialUrl && (
          <a 
            href={company.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute top-6 right-6 z-20 p-2.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ExternalLink size={16} />
          </a>
        )}
      </div>

      {/* Content Section */}
      <div className="relative z-20 p-8 -mt-10 flex flex-col flex-1">
        <div className="mb-auto">
          <h3 className="text-3xl font-bold text-white mb-1 tracking-tight truncate">
            {company.name}
          </h3>
          {company.nameCn && (
            <p className="text-sm text-zinc-500 font-medium mb-3">
              {company.nameCn}
            </p>
          )}
          <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed">
            {company.description || company.tagline || "Leading the future of humanoid robotics."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 py-6 border-t border-white/5 mt-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 uppercase tracking-wider font-semibold">
              <TrendingUp size={12} /> Valuation
            </div>
            <div className="text-white font-mono font-medium truncate">
              {company.companyValuationUsd ? `$${company.companyValuationUsd}` : 'Undisclosed'}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 uppercase tracking-wider font-semibold">
              <Users size={12} /> Team
            </div>
            <div className="text-white font-mono font-medium truncate">
              {company.employeeCount || company.employeeRange || '—'}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Link 
          to={`/companies/${company.slug}`}
          className="group/btn mt-auto flex items-center justify-between w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
        >
          <span className="text-sm font-semibold text-zinc-300 group-hover/btn:text-white">
            View Profile
          </span>
          <ArrowRight 
            size={16} 
            className="text-zinc-500 group-hover/btn:text-[#00d4aa] group-hover/btn:translate-x-1 transition-all" 
          />
        </Link>
      </div>
    </motion.div>
  );
};

// --- Main Section ---

const RobotCompaniesSection = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const targetRef = useRef(null);
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Parallax Text Effect
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    // 获取前12家活跃公司
    getCompanyList({ currentPage: 1, pageSize: 12, companyStatus: 'active' })
      .then((res) => {
        if (cancelled) return;
        if (res.success && res.data?.data) {
          const cards = res.data.data.map(apiCompanyToCard).filter(Boolean);
          setList(cards);
        }
      })
      .catch((err) => console.error("Failed to load companies", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <section ref={targetRef} className="relative w-full py-24 md:py-32 bg-[#0a0e17] overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#00d4aa]/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* CSS: hide scrollbar + improve touch scroll */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          overflow-y: hidden;
          touch-action: pan-x;
        }
      `}</style>

      <div className="container mx-auto relative z-10">
        
        {/* Header with Parallax */}
        <motion.div 
          style={{ opacity, y }} 
          className="mb-12 px-6 lg:px-12 md:mb-16 max-w-4xl"
        >
           <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-12 bg-[#00d4aa]" />
            <span className="text-[#00d4aa] font-medium tracking-widest uppercase text-sm">
              Industry Leaders
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            Shaping the Age of <br />
            <span className="text-white/40">Humanoid Robotics.</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
            探索全球最具影响力的机器人公司。从波士顿动力的运动控制到特斯拉的 AI 大脑，这里是通往未来的名利场。
          </p>
        </motion.div>

        {/* Horizontal Scroll Container */}
        {loading ? (
          <LoadingSkeleton />
        ) : list.length > 0 ? (
          <div className="relative group/slider w-full">
            
            {/* Scrollable Area - drag to scroll on desktop, touch scroll on mobile */}
            <div 
              ref={scrollRef}
              className={`flex gap-6 overflow-x-auto overflow-y-hidden px-6 pb-12 hide-scrollbar select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
            >
              {list.map((company, i) => (
                <div 
                  key={company.slug || i} 
                  className="shrink-0 min-w-[320px] md:min-w-[400px] h-[500px]"
                >
                  <CompanyCard company={company} />
                </div>
              ))}
              
              {/* "See All" Card */}
              <div className="shrink-0 min-w-[200px] md:min-w-[300px] h-[500px] flex items-center justify-center pr-6">
                 <Link 
                   to="/companies" 
                   className="group flex flex-col items-center gap-4 text-zinc-500 hover:text-white transition-colors"
                 >
                    <div className="w-20 h-20 rounded-full border border-zinc-700 flex items-center justify-center group-hover:border-[#00d4aa] group-hover:bg-[#00d4aa]/10 transition-all duration-300">
                        <ArrowRight size={32} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                    <span className="font-medium tracking-wide text-lg">
                      View All Companies
                    </span>
                 </Link>
              </div>
            </div>

            {/* Gradient Fade Edges (Desktop Only) */}
            <div className="absolute top-0 right-0 bottom-12 w-32 bg-gradient-to-l from-[#0a0e17] to-transparent pointer-events-none hidden md:block" />
            <div className="absolute top-0 left-0 bottom-12 w-32 bg-gradient-to-r from-[#0a0e17] to-transparent pointer-events-none hidden md:block" />
            
          </div>
        ) : (
          <div className="mx-6 h-64 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/5">
             <div className="text-zinc-500 mb-2 font-medium">Temporarily Unavailable</div>
             <p className="text-xs text-zinc-600">No company data found.</p>
          </div>
        )}

      </div>
    </section>
  );
};

export default RobotCompaniesSection;