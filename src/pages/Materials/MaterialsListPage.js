import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Drawer, ConfigProvider, theme } from 'antd';
import { useLocale } from '../../contexts/LocaleContext';
import AppHeader from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { getMaterialCategoryTree, getMaterialList, getMaterialDetail, getMaterialDetailBatch } from '../../api/openrobotx';
import {
  MaterialSearch,
  MaterialCategorySidebar,
  MaterialList,
  MaterialCompareBoard,
  MaterialDetailModal,
} from './components';

const MaterialsListPage = () => {
  const { locale } = useLocale();
  const isZh = !locale || locale === 'zh-CN' || String(locale).toLowerCase().startsWith('zh');

  // State
  const [categoryTree, setCategoryTree] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  
  // Detail Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const [compareDrawerOpen, setCompareDrawerOpen] = useState(false);
  const [compareIds, setCompareIds] = useState([]);
  const [compareDetailList, setCompareDetailList] = useState([]);
  const [compareLoading, setCompareLoading] = useState(false);

  // Constants
  const pageSize = 12;

  // Data Fetching
  useEffect(() => {
    getMaterialCategoryTree().then(res => {
      if (res.success) setCategoryTree(res.data || []);
    });
  }, []);

  // 切换分类时回到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryId]);

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        const res = await getMaterialList({
          currentPage,
          pageSize,
          categoryId: selectedCategoryId ?? undefined,
          keyword: keyword.trim() || undefined,
        });
        if (res.success && res.data) {
          setList(res.data.data || []);
          setTotal(res.data.totalNum || 0);
        } else {
          setList([]);
          setTotal(0);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [currentPage, selectedCategoryId, keyword]);

  const handleSearch = () => setCurrentPage(1);

  // Fetch compare board data when drawer is open
  useEffect(() => {
    if (!compareDrawerOpen || !compareIds.length) {
      setCompareDetailList([]);
      return;
    }
    const fetch = async () => {
      setCompareLoading(true);
      try {
        const res = await getMaterialDetailBatch(compareIds);
        if (res.success && res.data) setCompareDetailList(res.data);
        else setCompareDetailList([]);
      } finally {
        setCompareLoading(false);
      }
    };
    fetch();
  }, [compareDrawerOpen, compareIds.join(',')]);

  const openDetail = async (id) => {
    setDetailModalOpen(true);
    setDetailLoading(true);
    setDetailData(null);
    try {
      const res = await getMaterialDetail(id);
      if (res.success) setDetailData(res.data);
    } finally {
      setDetailLoading(false);
    }
  };

  // UI Strings
  const t = {
    title: isZh ? '材料数据库' : 'Material Database',
    subtitle: isZh ? '为高性能机器人研发打造的工程材料百科' : 'Engineering materials encyclopedia for high-performance robotics.',
    searchPlaceholder: isZh ? '搜索材料名称、化学式...' : 'Search name, formula...',
    allCategories: isZh ? '全部材料' : 'All Materials',
    category: isZh ? '分类' : 'Category',
    empty: isZh ? '未找到相关材料' : 'No materials found',
    specs: isZh ? '物理属性规格' : 'Physical Properties & Specs',
    viewDetail: isZh ? '查看详情' : 'View Details',
    compareBoard: isZh ? '对比看板' : 'Compare Board',
    emptySelectText: isZh ? '在列表中选择材料并切换至对比看板' : 'Select materials in list and switch to Compare Board',
    selectPropsText: isZh ? '选择对比属性' : 'Select properties',
    selectAllText: isZh ? '全选' : 'Select All',
    deselectAllText: isZh ? '取消全选' : 'Deselect All',
    selectAllOnPageText: isZh ? '本页全选' : 'Select All on Page',
    deselectAllOnPageText: isZh ? '本页取消' : 'Deselect All on Page',
    copySuccessText: isZh ? '已复制' : 'Copied',
    selectedMaterialsLabel: isZh ? '已选材料' : 'Selected Materials',
    tableModeText: isZh ? '表格' : 'Table',
    radarModeText: isZh ? '雷达图' : 'Radar',
    barModeText: isZh ? '柱状图' : 'Bar Chart',
    heatmapModeText: isZh ? '热力图' : 'Heatmap',
    compareHint: (n) => (isZh ? `已选 ${n} 项，点击查看对比` : `${n} selected, click to compare`),
    properties: {
      density: isZh ? '密度' : 'Density',
      youngsModulus: isZh ? '杨氏模量' : "Young's Modulus",
      yieldStrength: isZh ? '屈服强度' : 'Yield Strength',
      ultimateStrength: isZh ? '抗拉强度' : 'Ultimate Strength',
      thermalConductivity: isZh ? '热导率' : 'Thermal Cond.',
      meltingPoint: isZh ? '熔点' : 'Melting Point',
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-[#00d4aa] selection:text-black">
      <Helmet>
        <title>{t.title} | Open Robot X</title>
      </Helmet>

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-[#00d4aa]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <AppHeader />

      <main className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
              {t.title}
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl font-light">
              {t.subtitle}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <MaterialSearch
              keyword={keyword}
              onKeywordChange={setKeyword}
              onSearch={handleSearch}
              searchPlaceholder={t.searchPlaceholder}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <MaterialCategorySidebar
            categoryTree={categoryTree}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            categoryLabel={t.category}
            allCategoriesLabel={t.allCategories}
            isZh={isZh}
          />

          <MaterialList
            list={list}
            loading={loading}
            total={total}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onItemClick={openDetail}
            emptyText={t.empty}
            viewDetailText={t.viewDetail}
            compareMode
            selectedCompareIds={compareIds}
            onCompareIdsChange={setCompareIds}
            selectAllOnPageText={t.selectAllOnPageText}
            deselectAllOnPageText={t.deselectAllOnPageText}
            copySuccessText={t.copySuccessText}
            compareBoardLabel={t.compareBoard}
            compareIdsCount={compareIds.length}
            compareHint={t.compareHint}
            onOpenCompareBoard={() => setCompareDrawerOpen(true)}
          />
        </div>
      </main>

      <MaterialDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        loading={detailLoading}
        detailData={detailData}
        isZh={isZh}
        t={t}
      />

      {/* 对比看板 - 右侧抽屉，可同时操作列表 */}
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm, token: { colorBgElevated: '#0f1014', colorBorder: 'rgba(255,255,255,0.1)' } }}>
        <Drawer
          title={t.compareBoard}
          placement="right"
          width="min(90vw, 960px)"
          open={compareDrawerOpen}
          onClose={() => setCompareDrawerOpen(false)}
          mask={false}
          styles={{ body: { padding: '16px 24px', background: '#050505' }, header: { background: '#0f1014', borderBottom: '1px solid rgba(255,255,255,0.1)' } }}
          closeIcon={<span className="text-white/70 hover:text-white">✕</span>}
        >
          <MaterialCompareBoard
            selectedIds={compareIds}
            detailList={compareDetailList}
            loading={compareLoading}
            isZh={isZh}
            onMaterialClick={(id) => { openDetail(id); }}
            onCompareIdsChange={setCompareIds}
            emptySelectText={t.emptySelectText}
            selectedMaterialsLabel={t.selectedMaterialsLabel}
            selectPropsText={t.selectPropsText}
            selectAllText={t.selectAllText}
            deselectAllText={t.deselectAllText}
            tableModeText={t.tableModeText}
            radarModeText={t.radarModeText}
            barModeText={t.barModeText}
            heatmapModeText={t.heatmapModeText}
          />
        </Drawer>
      </ConfigProvider>

      <Footer />
    </div>
  );
};

export default MaterialsListPage;
