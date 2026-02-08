import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Modal, Spin, ConfigProvider, theme } from 'antd';
import { Beaker, Info, Layers } from 'lucide-react';
import { Tag, StatItem } from './MaterialShared';
import { addImageCompressSuffix } from '../../../utils/imageUtils';

const MaterialDetailModal = ({
  open,
  onClose,
  loading,
  detailData,
  isZh,
  t,
}) => (
  <ConfigProvider theme={{ algorithm: theme.darkAlgorithm, token: { colorBgElevated: '#1f1f1f' } }}>
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      destroyOnClose
      modalRender={(modal) => (
        <div className="bg-[#0f1014] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          {modal}
        </div>
      )}
      closable={false}
      styles={{ 
        mask: { 
          backdropFilter: 'blur(8px)', 
          WebkitBackdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0,0,0,0.25)' 
        },
        content: { background: 'transparent', boxShadow: 'none', padding: 0 },
        body: { padding: 0 }
      }}
    >
      {loading || !detailData ? (
        <div className="h-64 flex items-center justify-center"><Spin /></div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Modal Header */}
          <div className="relative p-6 md:p-8 bg-gradient-to-r from-[#1a1f2e] to-[#0f1014] border-b border-white/10 flex gap-6">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors shrink-0 aspect-square"
              aria-label="Close"
            >
              ✕
            </button>
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center shrink-0">
              {detailData.base?.thumbnailUrl ? (
                <img src={addImageCompressSuffix(detailData.base.thumbnailUrl, 200)} className="max-w-full max-h-full p-2" alt="" />
              ) : (
                <Beaker size={40} className="text-gray-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl md:text-3xl font-bold text-white truncate">{detailData.base?.name}</h2>
                {detailData.category && (
                  <span className="px-3 py-1 rounded-full bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20 text-xs font-medium">
                    {isZh ? (detailData.category.nameZh || detailData.category.name) : (detailData.category.name || detailData.category.nameZh)}
                  </span>
                )}
              </div>
              {detailData.base?.chemicalFormula && (
                <div className="text-[#00d4aa] font-mono text-lg mb-2">{detailData.base.chemicalFormula}</div>
              )}
              <div className="flex flex-wrap gap-2">
                {detailData.base?.tags?.map(tag => <Tag key={tag}>{tag}</Tag>)}
              </div>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
            {/* Description */}
            {detailData.base?.description && (
              <div className="mb-8 prose prose-invert prose-sm max-w-none text-gray-400">
                <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Info size={14} /> {isZh ? '简介' : 'Description'}
                </h3>
                <ReactMarkdown>{detailData.base.description}</ReactMarkdown>
              </div>
            )}

            {/* Variants & Properties */}
            <div>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2 sticky top-0 bg-[#0f1014] py-2 z-10">
                <Layers size={14} /> {t.specs}
              </h3>
              
              {detailData.variants && detailData.variants.length > 0 ? (
                <div className="space-y-6">
                  {detailData.variants.map((vp, idx) => {
                    const v = vp.variant || {};
                    const p = vp.property || {};
                    return (
                      <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-5">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-white/5 pb-3">
                          <span className="text-lg font-semibold text-white">{v.name}</span>
                          <div className="flex gap-3 text-xs text-gray-400">
                            {v.gradeStandard && <span>{v.gradeStandard}</span>}
                            {v.processState && <span className="text-gray-500">• {v.processState}</span>}
                            {v.isRohs === 1 && <span className="text-green-500">• RoHS</span>}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          <StatItem label={t.properties.density} value={p.density} unit="g/cm³" />
                          <StatItem label={t.properties.youngsModulus} value={p.youngsModulus} unit="GPa" />
                          <StatItem label={t.properties.yieldStrength} value={p.yieldStrength} unit="MPa" />
                          <StatItem label={t.properties.ultimateStrength} value={p.ultimateStrength} unit="MPa" />
                          <StatItem label={t.properties.thermalConductivity} value={p.thermalConductivity} unit="W/(m·K)" />
                          <StatItem label={t.properties.meltingPoint} value={p.meltingPoint} unit="°C" />
                          <StatItem label="Poisson's Ratio" value={p.poissonsRatio} />
                          <StatItem label="Hardness" value={p.hardnessValue} unit={p.hardnessScale} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-gray-500 italic py-4">{isZh ? '暂无详细规格数据' : 'No specification data available'}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  </ConfigProvider>
);

export default MaterialDetailModal;
