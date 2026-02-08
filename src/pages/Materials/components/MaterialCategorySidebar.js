import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { ChevronRight, ChevronDown, LayoutGrid, Filter } from 'lucide-react';

// iconKey 到 Lucide 组件的映射（DB 可能存 "Share-2" 或 "Share2"）
const ICON_MAP = {
  Gem: LucideIcons.Gem,
  'Share-2': LucideIcons.Share2,
  Share2: LucideIcons.Share2,
  Waves: LucideIcons.Waves,
  Paintbrush: LucideIcons.Paintbrush,
  Eye: LucideIcons.Eye,
  'Shield-alert': LucideIcons.ShieldAlert,
  ShieldAlert: LucideIcons.ShieldAlert,
  Shirt: LucideIcons.Shirt,
  Flame: LucideIcons.Flame,
  Cpu: LucideIcons.Cpu,
  Zap: LucideIcons.Zap,
  'Zap-off': LucideIcons.ZapOff,
  ZapOff: LucideIcons.ZapOff,
  Snowflake: LucideIcons.Snowflake,
  Layers: LucideIcons.Layers,
  Grid: LucideIcons.LayoutGrid,
  LayoutGrid: LucideIcons.LayoutGrid,
  Sun: LucideIcons.Sun,
  Magnet: LucideIcons.Magnet,
  Activity: LucideIcons.Activity,
  Move: LucideIcons.Move,
  Droplet: LucideIcons.Droplet,
  Atom: LucideIcons.Atom,
  Box: LucideIcons.Box,
};

const getCategoryIcon = (iconKey, size = 16) => {
  const DefaultIcon = LucideIcons.Layers;
  if (!iconKey) return <DefaultIcon size={size} className="shrink-0 text-current opacity-70" />;
  const Icon = ICON_MAP[iconKey] || LucideIcons[iconKey] || DefaultIcon;
  return Icon ? <Icon size={size} className="shrink-0 text-current opacity-70" /> : <DefaultIcon size={size} className="shrink-0 text-current opacity-70" />;
};

const CategoryTreeNode = ({ node, selectedId, onSelect, depth = 0, isZh }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;

  useEffect(() => {
    if (selectedId === node.id) setIsOpen(true);
  }, [selectedId, node.id]);

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSelect = () => {
    onSelect(node.id);
    if (hasChildren && !isOpen) setIsOpen(true);
  };

  return (
    <div className="select-none">
      <div 
        onClick={handleSelect}
        className={`
          flex items-center gap-2 py-2 pl-2 pr-3 my-0.5 rounded-lg cursor-pointer transition-colors
          ${isSelected ? 'bg-[#00d4aa]/10 text-[#00d4aa]' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}
        `}
      >
        {hasChildren && (
          <div onClick={handleToggle} className="p-0.5 rounded hover:bg-white/10 transition-transform shrink-0">
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
        )}
        {getCategoryIcon(node.iconKey)}
        <span className="text-sm font-medium flex-1 min-w-0 break-words">
          {isZh ? (node.nameZh || node.name) : (node.name || node.nameZh)}
        </span>
      </div>
      
      {hasChildren && isOpen && (
        <div className="border-l border-white/5 ml-3">
          {node.children.map(child => (
            <CategoryTreeNode 
              key={child.id} 
              node={child} 
              selectedId={selectedId} 
              onSelect={onSelect} 
              depth={depth + 1}
              isZh={isZh}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const MaterialCategorySidebar = ({ categoryTree, selectedCategoryId, onSelectCategory, categoryLabel, allCategoriesLabel, isZh }) => (
  <aside className="w-full lg:w-80 shrink-0">
    <div className="sticky top-24 bg-[#0f0f10]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-4 px-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">
        <Filter size={12} />
        {categoryLabel}
      </div>
      
      <div 
        onClick={() => onSelectCategory(null)}
        className={`
          flex items-center gap-2 py-2.5 px-3 rounded-lg cursor-pointer transition-all mb-2
          ${selectedCategoryId === null ? 'bg-[#00d4aa] text-black font-semibold' : 'text-gray-300 hover:bg-white/5'}
        `}
      >
        <LayoutGrid size={16} />
        <span>{allCategoriesLabel}</span>
      </div>

      <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
        {categoryTree.map(node => (
          <CategoryTreeNode 
            key={node.id} 
            node={node} 
            selectedId={selectedCategoryId} 
            onSelect={onSelectCategory} 
            isZh={isZh}
          />
        ))}
      </div>
    </div>
  </aside>
);

export default MaterialCategorySidebar;
