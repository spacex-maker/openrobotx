/**
 * 后端公司实体 -> 前端 UI 适配器
 * 负责将后端 API 数据转换为组件所需的 props 格式
 */

const DEFAULT_THEME = { 
  primary: '#00d4aa', 
  heroOverlay: 'linear-gradient(to bottom, rgba(10,14,23,0.3), rgba(10,14,23,1))' 
};

// 为知名公司定制品牌色
const SLUG_THEME = {
  'boston-dynamics': { primary: '#e63946' }, // 波士顿动力红
  'figure-ai': { primary: '#0ea5e9' },       // Figure 蓝
  'tesla': { primary: '#cc0000' },           // 特斯拉红
  'agility-robotics': { primary: '#22c55e' }, // Agility 绿
  '1x-technologies': { primary: '#a78bfa' },
  'unitree': { primary: '#00d4aa' },
  'agibot': { primary: '#f97316' },
  'ubtech': { primary: '#3b82f6' },
  'apptronik': { primary: '#6366f1' },
  'sanctuary-ai': { primary: '#8b5cf6' },
};

/**
 * 列表卡片适配器 (用于 RobotCompaniesSection)
 */
export function apiCompanyToCard(api) {
  if (!api) return null;
  
  const slug = api.slug || '';
  // 合并默认主题与自定义主题
  const theme = { ...DEFAULT_THEME, ...(SLUG_THEME[slug] || {}) };
  
  return {
    slug,
    name: api.companyName || api.company_name || '',
    nameCn: api.fullName || api.full_name || '',
    region: api.countryOrigin || api.country_origin || '',
    tagline: api.missionStatement || api.mission_statement || '',
    description: api.description || '',
    heroImage: api.bannerUrl || api.banner_url || api.logoUrl || api.logo_url || '',
    
    // 关键财务/规模数据
    foundedYear: api.foundedYear || api.founded_year,
    headquarters: api.headquarters || '',
    ceo: api.ceo || '',
    employeeCount: api.employeeCount || api.employee_count || '',
    employeeRange: api.employeeRange || api.employee_range || '',
    companyValuationUsd: api.companyValuationUsd || api.company_valuation_usd || '',
    totalFinancingUsd: api.totalFinancingUsd || api.total_financing_usd || '',
    latestRound: api.latestRound || api.latest_round || '',
    coreTechnology: api.coreTechnology || api.core_technology || '',
    officialUrl: api.officialWebsite || api.official_website || '',
    
    theme, // 将计算好的主题传递给组件
  };
}

/**
 * 详情页适配器 (用于 CompanyPageLayout)
 */
export function apiCompanyToDetail(api) {
  if (!api) return { data: null, theme: DEFAULT_THEME };
  
  const slug = api.slug || '';
  const theme = { ...DEFAULT_THEME, ...(SLUG_THEME[slug] || {}) };
  
  const desc = api.description || '';
  // 将长文本按段落分割，用于排版
  const aboutParagraphs = desc ? desc.split(/\n\n+/).filter(Boolean) : [];
  if (aboutParagraphs.length === 0 && desc) aboutParagraphs.push(desc);

  // 提取核心亮点
  const highlights = [];
  if (api.coreTechnology) highlights.push(api.coreTechnology);
  if (api.majorPartners) highlights.push(`Partner: ${api.majorPartners}`);
  if (api.companyValuationUsd) highlights.push(`Valuation: $${api.companyValuationUsd}`);
  if (api.totalFinancingUsd) highlights.push(`Funding: ${api.totalFinancingUsd}`);

  const data = {
    name: api.companyName || api.company_name || '',
    nameCn: api.fullName || api.full_name || '',
    region: api.countryOrigin || api.country_origin || '',
    tagline: api.missionStatement || api.mission_statement || desc.slice(0, 120) || '',
    heroImage: api.bannerUrl || api.banner_url || api.logoUrl || api.logo_url || '',
    aboutParagraphs,
    highlights,
    officialUrl: api.officialWebsite || api.official_website || '',
    
    // 详细数据字段
    foundedYear: api.foundedYear || api.founded_year,
    headquarters: api.headquarters || '',
    ceo: api.ceo || '',
    employeeCount: api.employeeCount || api.employee_count || '',
    employeeRange: api.employeeRange || api.employee_range || '',
    companyValuationUsd: api.companyValuationUsd || api.company_valuation_usd,
    totalFinancingUsd: api.totalFinancingUsd || api.total_financing_usd,
    latestRound: api.latestRound || api.latest_round,
    coreTechnology: api.coreTechnology || api.core_technology,
    majorPartners: api.majorPartners || api.major_partners || '',
  };

  return { data, theme };
}