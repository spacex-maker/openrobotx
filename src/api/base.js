import axios from './axios';

export const base = {
  // 获取登录方式列表（根据国家）
  getLoginMethodsByCountry: async (countryCode = 'CN') => {
    try {
      const { data } = await axios.get(`/base/productx/auth/login-methods/by-country?countryCode=${countryCode}`);
      return data;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '获取登录方式失败' 
      };
    }
  },

  // 获取国家列表
  getCountriesList: async () => {
    try {
      const { data } = await axios.get('/base/countries/list-all-enable');
      return data;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '获取国家列表失败' 
      };
    }
  },
};
