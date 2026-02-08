import React, { useState } from 'react';
import { Pagination, Spin, Empty, ConfigProvider, theme, Checkbox, message } from 'antd';
import { ChevronRight, Atom, Info, Copy, Check } from 'lucide-react';
import { GlassCard, Tag } from './MaterialShared';
import { addImageCompressSuffix } from '../../../utils/imageUtils';

const MaterialList = ({
  list,
  loading,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onItemClick,
  emptyText,
  viewDetailText,
  compareMode = false,
  selectedCompareIds = [],
  onCompareIdsChange,
  selectAllOnPageText,
  deselectAllOnPageText,
  copySuccessText = 'Copied',
  compareBoardLabel,
  compareIdsCount = 0,
  compareHint,
  onOpenCompareBoard,
}) => {
  const [copiedId, setCopiedId] = useState(null);
  const handleCopyName = async (e, name, id) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(name);
      setCopiedId(id);
      message.success(copySuccessText);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      message.error('Copy failed');
    }
  };

  return (
  <div className="flex-1 min-w-0">
    {loading ? (
      <div className="h-96 flex items-center justify-center">
        <Spin size="large" />
      </div>
    ) : list.length === 0 ? (
      <div className="h-96 flex flex-col items-center justify-center text-gray-500 bg-white/5 rounded-3xl border border-white/5 border-dashed">
        <Empty description={<span className="text-gray-500">{emptyText}</span>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    ) : (
      <>
        {compareMode && (onCompareIdsChange && (selectAllOnPageText || deselectAllOnPageText) || onOpenCompareBoard) && (
          <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
            {onCompareIdsChange && selectAllOnPageText && (
              <button
                type="button"
                onClick={() => {
                  const ids = list.map(i => i.id);
                  const merged = [...new Set([...selectedCompareIds, ...ids])];
                  onCompareIdsChange(merged);
                }}
                className="px-3 py-2 text-sm rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
              >
                {selectAllOnPageText}
              </button>
            )}
            {onCompareIdsChange && deselectAllOnPageText && (
              <button
                type="button"
                onClick={() => {
                  const idsSet = new Set(list.map(i => i.id));
                  onCompareIdsChange(selectedCompareIds.filter(id => !idsSet.has(id)));
                }}
                className="px-3 py-2 text-sm rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
              >
                {deselectAllOnPageText}
              </button>
            )}
            {onOpenCompareBoard && compareBoardLabel && (
              <button
                type="button"
                onClick={onOpenCompareBoard}
                title={compareIdsCount > 0 && compareHint ? compareHint(compareIdsCount) : undefined}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border font-medium transition-colors ${
                  compareIdsCount > 0
                    ? 'border-[#00d4aa]/50 bg-[#00d4aa]/10 text-[#00d4aa] hover:bg-[#00d4aa]/20'
                    : 'border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {compareBoardLabel}
                {compareIdsCount > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-[#00d4aa] text-black text-xs font-bold">
                    {compareIdsCount}
                  </span>
                )}
              </button>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {list.map((item) => {
            const isSelected = selectedCompareIds.includes(item.id);
            return (
            <GlassCard
              key={item.id}
              onClick={(e) => {
                if (compareMode && e.target.closest('[data-compare-check]')) return;
                onItemClick(item.id);
              }}
              className="cursor-pointer flex flex-col h-full"
            >
              {/* Image Area */}
              <div className="h-48 relative bg-gradient-to-br from-[#1a1f2e] to-[#0f141e] flex items-center justify-center p-6 border-b border-white/5">
                {item.thumbnailUrl ? (
                  <img 
                    src={addImageCompressSuffix(item.thumbnailUrl, 400)} 
                    className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                    alt={item.name} 
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-5xl font-mono font-bold text-white/10 mb-2 select-none">
                      {item.chemicalFormula?.slice(0, 4) || 'MAT'}
                    </div>
                    <Atom size={48} className="mx-auto text-[#00d4aa]/20" />
                  </div>
                )}
                
                {/* Compare checkbox */}
                {compareMode && onCompareIdsChange && (
                  <div
                    data-compare-check
                    className="absolute top-3 right-3 z-10"
                    onClick={e => e.stopPropagation()}
                  >
                    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm, token: { colorPrimary: '#00d4aa' } }}>
                      <Checkbox
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          if (e.target.checked) {
                            onCompareIdsChange([...selectedCompareIds, item.id]);
                          } else {
                            onCompareIdsChange(selectedCompareIds.filter(id => id !== item.id));
                          }
                        }}
                      />
                    </ConfigProvider>
                  </div>
                )}
                {/* Type Badge */}
                <div className="absolute top-3 left-3">
                  {item.chemicalFormula && (
                    <span className="px-2 py-1 bg-black/40 backdrop-blur-md rounded text-xs font-mono text-[#00d4aa] border border-[#00d4aa]/20">
                      {item.chemicalFormula}
                    </span>
                  )}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#00d4aa] transition-colors flex-1 min-w-0 truncate">
                    {item.name}
                  </h3>
                  <button
                    type="button"
                    onClick={(e) => handleCopyName(e, item.name, item.id)}
                    className="shrink-0 p-1.5 rounded-lg text-gray-500 hover:text-[#00d4aa] hover:bg-white/10 transition-colors"
                    title={copySuccessText}
                  >
                    {copiedId === item.id ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                
                {item.aliases && item.aliases.length > 0 && (
                  <p className="text-xs text-gray-500 mb-3 truncate">
                    {item.aliases.join(', ')}
                  </p>
                )}

                <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">
                  {item.description?.replace(/^[#*>\s]+/, '')}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {item.tags?.slice(0, 3).map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Info size={12} /> ID: {item.id}
                  </span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-[#00d4aa]">
                    {viewDetailText} <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            </GlassCard>
          );})}
        </div>

        <div className="mt-12 flex justify-center">
          <ConfigProvider theme={{
            algorithm: theme.darkAlgorithm,
            token: { colorPrimary: '#00d4aa', colorBgContainer: 'transparent' }
          }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={(p) => {
                onPageChange(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              showSizeChanger={false}
            />
          </ConfigProvider>
        </div>
      </>
    )}
  </div>
  );
};

export default MaterialList;
