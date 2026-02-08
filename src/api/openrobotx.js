import axios from './axios';

const PATH = '/productx/openrobotx/companies';
const PATH_HUMANOID = '/productx/openrobotx/humanoid-robots';
const PATH_NEWS = '/productx/openrobotx/news';
const PATH_HISTORY_EVENTS = '/productx/openrobotx/history-events';
const PATH_ROBOT_STRUCTURE = '/productx/openrobotx/robot-structure';

/**
 * 分页查询公司列表
 * @param {Object} params - { currentPage, pageSize, featured, countryOrigin, companyStatus, keyword }
 * @returns {Promise<{ success: boolean, data?: { data: [], totalNum }, message?: string }>}
 */
export const getCompanyList = async (params = {}) => {
  try {
    const { data } = await axios.get(PATH, { params });
    if (data?.success && data?.data != null) {
      return { success: true, data: data.data };
    }
    return { success: false, message: data?.message || '获取列表失败' };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '获取列表失败',
    };
  }
};

/**
 * 根据 ID 查询公司详情
 * @param {number} id
 */
export const getCompanyById = async (id) => {
  try {
    const { data } = await axios.get(`${PATH}/${id}`);
    if (data?.success && data?.data != null) {
      return { success: true, data: data.data };
    }
    return { success: false, message: data?.message || '公司不存在' };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '获取详情失败',
    };
  }
};

/**
 * 根据 slug 查询公司详情（用于详情页路由）
 * @param {string} slug
 */
export const getCompanyBySlug = async (slug) => {
  try {
    const { data } = await axios.get(`${PATH}/slug/${encodeURIComponent(slug)}`);
    if (data?.success && data?.data != null) {
      return { success: true, data: data.data };
    }
    return { success: false, message: data?.message || '公司不存在' };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '获取详情失败',
    };
  }
};

// ========== 人形机器人（参数对比） ==========

/**
 * 分页查询人形机器人列表
 * @param {Object} params - { currentPage, pageSize, company, countryOrigin, keyword, orderBy }
 * @param {string} params.orderBy - 排序方式: valuation(市值,默认), latest(最新), hot(最热), update(最近更新)
 * @returns {Promise<{ success: boolean, data?: { data: [], totalNum }, message?: string }>}
 */
export const getHumanoidRobotList = async (params = {}) => {
  try {
    const { data } = await axios.get(PATH_HUMANOID, { params });
    if (data?.success && data?.data != null) {
      return { success: true, data: data.data };
    }
    return { success: false, message: data?.message || '获取列表失败' };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '获取列表失败',
    };
  }
};

/**
 * 根据 ID 查询人形机器人详情
 * @param {number} id
 */
export const getHumanoidRobotById = async (id) => {
  try {
    const { data } = await axios.get(`${PATH_HUMANOID}/${id}`);
    if (data?.success && data?.data != null) {
      return { success: true, data: data.data };
    }
    return { success: false, message: data?.message || '机器人不存在' };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '获取详情失败',
    };
  }
};

// ========== 行业资讯 ==========

/**
 * 分页查询资讯列表
 * @param {Object} params - { currentPage, pageSize, newsType, relatedCompany, keyword }
 * @returns {Promise<{ success: boolean, data?: { data: [], totalNum }, message?: string }>}
 */
export const getNewsList = async (params = {}) => {
  try {
    const { data } = await axios.get(PATH_NEWS, { params });
    if (data?.success && data?.data != null) {
      return { success: true, data: data.data };
    }
    return { success: false, message: data?.message || '获取列表失败' };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '获取列表失败',
    };
  }
};

/**
 * 分页查询某机器人的资讯（用于机器人详情页）
 * @param {number} robotId 机器人 ID
 * @param {Object} params - { currentPage, pageSize }
 */
export const getRobotNewsList = async (robotId, params = {}) => {
  try {
    const { data } = await axios.get(`${PATH_NEWS}/by-robot/${robotId}`, { params });
    if (data?.success && data?.data != null) {
      return { success: true, data: data.data };
    }
    return { success: false, message: data?.message || '获取列表失败' };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '获取列表失败',
    };
  }
};

/**
 * 根据 ID 查询资讯详情
 * @param {number} id
 */
export const getNewsById = async (id) => {
  try {
    const { data } = await axios.get(`${PATH_NEWS}/${id}`);
    if (data?.success && data?.data != null) {
      return { success: true, data: data.data };
    }
    return { success: false, message: data?.message || '资讯不存在' };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '获取详情失败',
    };
  }
};

/**
 * 分页查询机器人编年史事件列表
 * @param {Object} params - { currentPage, pageSize, eventYear, eventType, importanceLevel, keyword }
 */
export const getHistoryEventList = async (params = {}) => {
  try {
    const { data } = await axios.get(PATH_HISTORY_EVENTS, { params });
    if (data?.success && data?.data != null) {
      return { success: true, data: data.data };
    }
    return { success: false, message: data?.message || '获取列表失败' };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '获取列表失败',
    };
  }
};

/**
 * 根据 ID 查询编年史事件详情
 * @param {number} id
 */
export const getHistoryEventById = async (id) => {
  try {
    const { data } = await axios.get(`${PATH_HISTORY_EVENTS}/${id}`);
    if (data?.success && data?.data != null) {
      return { success: true, data: data.data };
    }
    return { success: false, message: data?.message || '事件不存在' };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '获取详情失败',
    };
  }
};

/**
 * 获取机器人架构页完整数据（核心节点、四层节点、三种连接）
 * @returns {Promise<{ success: boolean, data?: RobotStructureDTO, message?: string }>}
 *  data: { coreNode, layers, systems, subNodes, microNodes, crossConnections, subConnections, microConnections }
 */
export const getRobotStructure = async () => {
  try {
    const { data } = await axios.get(PATH_ROBOT_STRUCTURE);
    if (data?.success && data?.data != null) {
      return { success: true, data: data.data };
    }
    return { success: false, message: data?.message || '获取架构数据失败' };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '获取架构数据失败',
    };
  }
};

/**
 * 资讯点赞
 * @param {number} id 资讯 ID
 */
export const likeNews = async (id) => {
  try {
    const { data } = await axios.post(`${PATH_NEWS}/${id}/like`);
    if (data?.success) {
      return { success: true, message: data?.message };
    }
    return { success: false, message: data?.message || '点赞失败' };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '点赞失败',
    };
  }
};

// ========== 材料系统 ==========

const PATH_MATERIALS = '/productx/openrobotx/materials';

/**
 * 获取材料分类树
 * @returns {Promise<{ success: boolean, data?: OpenrobotxMaterialCategoryTreeVO[], message?: string }>}
 */
export const getMaterialCategoryTree = async () => {
  try {
    const { data } = await axios.get(`${PATH_MATERIALS}/categories/tree`);
    if (data?.success && data?.data != null) {
      return { success: true, data: data.data };
    }
    return { success: false, message: data?.message || '获取分类树失败' };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '获取分类树失败',
    };
  }
};

/**
 * 分页查询材料列表
 * @param {Object} params - { currentPage, pageSize, categoryId, keyword }
 * @returns {Promise<{ success: boolean, data?: { data: [], totalNum }, message?: string }>}
 */
export const getMaterialList = async (params = {}) => {
  try {
    const { data } = await axios.get(`${PATH_MATERIALS}`, { params });
    if (data?.success && data?.data != null) {
      return { success: true, data: data.data };
    }
    return { success: false, message: data?.message || '获取列表失败' };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '获取列表失败',
    };
  }
};

/**
 * 根据基础材料 ID 查询详情（含规格与物理属性）
 * @param {number} id 基础材料 ID
 * @returns {Promise<{ success: boolean, data?: OpenrobotxMaterialDetailVO, message?: string }>}
 */
export const getMaterialDetail = async (id) => {
  try {
    const { data } = await axios.get(`${PATH_MATERIALS}/${id}`);
    if (data?.success && data?.data != null) {
      return { success: true, data: data.data };
    }
    return { success: false, message: data?.message || '获取详情失败' };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '获取详情失败',
    };
  }
};

/**
 * 批量查询材料详情（用于对比看板）
 * @param {number[]} ids 基础材料 ID 列表
 * @returns {Promise<{ success: boolean, data?: OpenrobotxMaterialDetailVO[], message?: string }>}
 */
export const getMaterialDetailBatch = async (ids) => {
  try {
    if (!ids?.length) return { success: true, data: [] };
    const idsStr = ids.join(',');
    const { data } = await axios.get(`${PATH_MATERIALS}/batch`, { params: { ids: idsStr } });
    if (data?.success && Array.isArray(data?.data)) {
      return { success: true, data: data.data };
    }
    return { success: false, message: data?.message || '获取详情失败' };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || '批量获取详情失败',
    };
  }
};
