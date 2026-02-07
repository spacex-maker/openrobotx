import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Globe, 
  Cpu, 
  Activity, 
  Zap, 
  Battery, 
  Scale, 
  Ruler, 
  Box, 
  Move,
  Layers,
  Wifi,
  BrainCircuit,
  Calendar,
  Newspaper
} from 'lucide-react';
import { Spin } from 'antd'; // 保留 Antd Spin 用于加载状态，或者替换为自定义
import AppHeader from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { getHumanoidRobotById, getRobotNewsList } from '../../api/openrobotx';
import { addImageCompressSuffix } from '../../utils/imageUtils';
import { Link } from 'react-router-dom';

// --- Sub Components ---

const SpecCard = ({ icon: Icon, label, value, unit, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.4 }}
    className="group relative overflow-hidden rounded-2xl bg-[#0f141e]/40 border border-white/5 p-5 hover:bg-[#0f141e]/60 hover:border-white/10 transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="p-2 rounded-lg bg-white/5 text-[#00d4aa] group-hover:bg-[#00d4aa] group-hover:text-[#0a0e17] transition-colors duration-300">
        <Icon size={20} />
      </div>
    </div>
    <div>
      <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-white font-mono tracking-tight">
          {value || '—'}
        </span>
        {value && unit && <span className="text-sm text-zinc-400 font-medium">{unit}</span>}
      </div>
    </div>
  </motion.div>
);

const DetailRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-white/5 hover:bg-white/[0.02] px-2 transition-colors">
      <span className="text-sm text-zinc-500 font-medium">{label}</span>
      <span className="text-sm text-zinc-200 font-mono mt-1 sm:mt-0 text-right">{value}</span>
    </div>
  );
};

const Tag = ({ children }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-zinc-300 border border-white/10">
    {children}
  </span>
);

// --- Main Page ---

const RobotPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [robot, setRobot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [robotNews, setRobotNews] = useState({ data: [], totalNum: 0 });
  const [newsLoading, setNewsLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    
    getHumanoidRobotById(id)
      .then((res) => {
        if (cancelled) return;
        if (res.success && res.data) {
          setRobot(res.data);
        } else {
          setNotFound(true);
        }
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
      
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    if (!robot?.id) return;
    let cancelled = false;
    setNewsLoading(true);
    getRobotNewsList(robot.id, { currentPage: 1, pageSize: 8 })
      .then((res) => {
        if (cancelled) return;
        if (res.success && res.data) {
          setRobotNews({ data: res.data.data || [], totalNum: res.data.totalNum || 0 });
        }
      })
      .finally(() => { if (!cancelled) setNewsLoading(false); });
    return () => { cancelled = true; };
  }, [robot?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#00d4aa] border-t-transparent rounded-full animate-spin" />
          <div className="text-[#00d4aa] text-sm font-mono animate-pulse">LOADING BLUEPRINT...</div>
        </div>
      </div>
    );
  }

  if (notFound || !robot) {
    return (
      <div className="min-h-screen bg-[#0a0e17] flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold mb-4">Robot Not Found</h2>
        <button 
          onClick={() => navigate('/')} 
          className="px-6 py-2 bg-[#00d4aa] text-black rounded-full font-medium"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e17] text-[#e8eaed] font-sans selection:bg-[#00d4aa]/30">
      <AppHeader />

      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#00d4aa]/5 rounded-full blur-[150px]" />
        <div className="absolute top-[40%] left-[-20%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </div>

      <main className="relative z-10 pt-28 pb-20 px-6 lg:px-12 max-w-7xl mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-zinc-500 hover:text-[#00d4aa] transition-colors mb-8"
        >
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#00d4aa] transition-colors">
            <ArrowLeft size={16} />
          </div>
          <span className="text-sm font-medium">Back to Database</span>
        </button>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* Left: Content Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 flex flex-col justify-center"
          >
            <div className="flex items-center gap-3 mb-6">
              {robot.countryOrigin && (
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-2">
                  <Globe size={12} className="text-[#00d4aa]" />
                  {robot.countryOrigin}
                </div>
              )}
              {robot.availabilityStatus && (
                <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wide ${
                  robot.availabilityStatus === 'Available' || robot.availabilityStatus === 'In Production' 
                  ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                  : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                }`}>
                  {robot.availabilityStatus}
                </div>
              )}
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-2">
              {robot.model}
            </h1>
            <div className="text-2xl md:text-3xl text-zinc-500 font-light mb-8 flex items-center gap-3">
              by <span className="text-[#00d4aa] font-medium border-b border-[#00d4aa]/20 pb-0.5">{robot.company}</span>
            </div>

            <p className="text-lg text-zinc-400 leading-relaxed mb-8 border-l-2 border-[#00d4aa] pl-6">
              {robot.highlightsNotes || robot.description || "Leading the next generation of embodied intelligence with advanced actuation and cognitive processing capabilities."}
            </p>

            <div className="flex flex-wrap gap-4">
              {robot.officialWebsite && (
                <a 
                  href={robot.officialWebsite} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-3 rounded-xl bg-[#00d4aa] text-[#0a0e17] font-bold text-sm hover:bg-[#00d4aa]/90 transition-transform active:scale-95 flex items-center gap-2"
                >
                  Visit Website <Globe size={16} />
                </a>
              )}
              <div className="px-8 py-3 rounded-xl border border-white/10 text-zinc-300 font-bold text-sm bg-white/5 backdrop-blur-sm flex items-center gap-2 cursor-default">
                 {robot.releaseDate ? `Released: ${robot.releaseDate}` : 'Concept Phase'}
              </div>
            </div>
          </motion.div>

          {/* Right: Immersive Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 relative h-[500px] lg:h-[600px] rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-[#1a1f2e] to-[#0a0e17] border border-white/5 group"
          >
            {robot.imageUrl ? (
              <img 
                src={addImageCompressSuffix(robot.imageUrl, 1200)} 
                alt={`${robot.company} ${robot.model}`} 
                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
                <Cpu size={96} strokeWidth={1} />
              </div>
            )}
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-transparent to-transparent opacity-80" />
            
            {/* Floating Tech Badge inside Image */}
            <div className="absolute bottom-8 left-8 right-8 flex flex-wrap gap-2">
              {robot.targetApplication && robot.targetApplication.split(',').map((tag, i) => (
                <div key={i} className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-zinc-300">
                  #{tag.trim()}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bento Grid Specs */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
             <div className="h-px flex-1 bg-white/10" />
             <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Activity size={18} className="text-[#00d4aa]" /> 
                System Parameters
             </h2>
             <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <SpecCard icon={Ruler} label="Height" value={robot.heightCm} unit="cm" delay={0.1} />
            <SpecCard icon={Scale} label="Weight" value={robot.weightKg} unit="kg" delay={0.15} />
            <SpecCard icon={Move} label="Total DOF" value={robot.totalDof} unit="deg" delay={0.2} />
            <SpecCard icon={Zap} label="Walking Speed" value={robot.walkingSpeedKmh} unit="km/h" delay={0.25} />
            <SpecCard icon={Box} label="Payload (Total)" value={robot.totalPayloadKg} unit="kg" delay={0.3} />
            <SpecCard icon={Battery} label="Battery Life" value={robot.batteryLifeHours} unit="h" delay={0.35} />
            <SpecCard icon={Layers} label="Arm Payload" value={robot.armPayloadKg} unit="kg" delay={0.4} />
            <SpecCard icon={BrainCircuit} label="AI Model" value={robot.aiCoreModel || 'Proprietary'} unit="" delay={0.45} />
          </div>
        </div>

        {/* Detailed Tech Specs List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Tech Spec Column */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-[#00d4aa] pl-4">Technical Specifications</h3>
            <div className="bg-[#0f141e]/40 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
              <DetailRow label="Actuator Type" value={robot.actuatorType} />
              <DetailRow label="Vision System" value={robot.visionSystem} />
              <DetailRow label="Computing Platform" value={robot.computingPlatform} />
              <DetailRow label="Connectivity" value={robot.connectivity} />
              <DetailRow label="Hand DOF (Per Hand)" value={robot.handDofPerHand ? `${robot.handDofPerHand} DOF` : null} />
              <DetailRow label="Running Speed" value={robot.runningSpeedKmh ? `${robot.runningSpeedKmh} km/h` : null} />
              <DetailRow label="Battery Capacity" value={robot.batteryCapacityKwh ? `${robot.batteryCapacityKwh} kWh` : null} />
              <DetailRow label="Charging Time" value={robot.chargeTimeHours ? `${robot.chargeTimeHours} h` : null} />
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-purple-500 pl-4">Market Data</h3>
            <div className="bg-[#0f141e]/40 border border-white/5 rounded-2xl p-6 backdrop-blur-sm flex flex-col gap-6">
              
              <div>
                <div className="text-sm text-zinc-500 mb-1">Estimated Price</div>
                <div className="text-3xl font-bold text-white font-mono">
                   {robot.priceUsd ? `$${robot.priceUsd}` : <span className="text-lg text-zinc-600">Not Disclosed</span>}
                </div>
              </div>

              <div>
                 <div className="text-sm text-zinc-500 mb-2">Target Applications</div>
                 <div className="flex flex-wrap gap-2">
                   {robot.targetApplication ? (
                     robot.targetApplication.split(',').map((tag, i) => (
                       <Tag key={i}>{tag.trim()}</Tag>
                     ))
                   ) : <span className="text-zinc-600 text-sm">General Purpose</span>}
                 </div>
              </div>

              <div>
                <div className="text-sm text-zinc-500 mb-2">Release Timeline</div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <Calendar size={18} className="text-purple-400" />
                  <span className="font-mono">{robot.releaseDate || 'TBA'}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 机器人相关资讯 */}
        <div className="mt-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-white/10" />
            <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Newspaper size={18} className="text-[#00d4aa]" />
              相关资讯
            </h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          {newsLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-2 border-[#00d4aa]/30 border-t-[#00d4aa] rounded-full animate-spin" />
            </div>
          ) : robotNews.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {robotNews.data.map((item) => (
                <Link
                  key={item.id}
                  to={`/news/${item.id}`}
                  className="group block rounded-2xl bg-[#0f141e]/40 border border-white/5 overflow-hidden hover:border-[#00d4aa]/30 hover:bg-[#0f141e]/60 transition-all duration-300"
                >
                  <div className="aspect-[16/10] relative overflow-hidden bg-black/20">
                    {item.coverImage ? (
                      <img
                        src={addImageCompressSuffix(item.coverImage, 400)}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                        <Newspaper size={40} strokeWidth={1} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-transparent to-transparent opacity-80" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white text-sm line-clamp-2 mb-2 group-hover:text-[#00d4aa] transition-colors">
                      {item.titleCn || item.title}
                    </h3>
                    <p className="text-xs text-zinc-500 line-clamp-2 mb-3">
                      {item.summaryCn || item.summary}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-zinc-600">
                      <span>{item.sourceName || '来源'}</span>
                      <span>{item.publishTime ? item.publishTime.replace('T', ' ').slice(0, 16) : ''}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/5 bg-[#0f141e]/30 py-16 text-center text-zinc-500">
              <Newspaper size={48} className="mx-auto mb-4 opacity-50" />
              <p>暂无该机器人相关资讯</p>
            </div>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default RobotPage;