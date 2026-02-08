import React from 'react';
import { Input } from 'antd';
import { Search } from 'lucide-react';

const MaterialSearch = ({ keyword, onKeywordChange, onSearch, searchPlaceholder }) => (
  <div className="relative w-full md:w-80 group">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#00d4aa] transition-colors">
      <Search size={18} />
    </div>
    <Input 
      placeholder={searchPlaceholder}
      value={keyword}
      onChange={e => onKeywordChange(e.target.value)}
      onPressEnter={onSearch}
      className="w-full pl-10 h-12 bg-white/5 border border-white/10 rounded-xl text-gray-200 placeholder-gray-600 focus:bg-white/10 focus:border-[#00d4aa] hover:border-white/20 transition-all !shadow-none"
      style={{ paddingLeft: '40px', background: 'rgba(255,255,255,0.05)', color: 'white' }}
      bordered={false}
    />
  </div>
);

export default MaterialSearch;
