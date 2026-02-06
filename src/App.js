import React, { useState } from 'react';
import 'antd/dist/reset.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme, message } from 'antd';
import { ThemeProvider } from 'styled-components';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { LocaleProvider } from './contexts/LocaleContext';
import { Helmet } from 'react-helmet';

// Pages
import HomePage from './pages/Home';
import CompanyPage from './pages/Companies/CompanyPage';
import RobotPage from './pages/Robots/RobotPage';
import NewsListPage from './pages/News/NewsListPage';
import NewsDetailPage from './pages/News/NewsDetailPage';
import AgiPathPage from './pages/AgiPath/AgiPathPage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';

// Language config
const localeMap = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

export default function App() {
  const [isDark] = React.useState(true); // Always dark theme for OpenRobotX
  const [locale, setLocale] = useState('zh-CN');

  // Configure global message
  message.config({
    top: 60,
    duration: 2,
    maxCount: 3,
  });

  const themeConfig = React.useMemo(() => ({
    algorithm: theme.darkAlgorithm,
    token: {
      colorPrimary: '#00d4aa',
      colorBgBase: '#0a0e17',
      colorText: '#e8eaed',
      colorTextSecondary: '#9aa0a6',
      borderRadius: 8,
    },
  }), []);

  const styledTheme = {
    isDark: true,
    primary: '#00d4aa',
    bg: '#0a0e17',
    text: '#e8eaed',
    textSecondary: '#9aa0a6',
  };

  return (
    <LocaleProvider>
      <ThemeProvider theme={styledTheme}>
        <ConfigProvider theme={themeConfig} locale={localeMap[locale] || zhCN}>
          <Router>
            <Helmet>
              <html lang={locale.startsWith('zh') ? 'zh-CN' : 'en-US'} />
            </Helmet>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/companies/:slug" element={<CompanyPage />} />
              <Route path="/robots/:id" element={<RobotPage />} />
              <Route path="/news" element={<NewsListPage />} />
              <Route path="/news/:id" element={<NewsDetailPage />} />
              <Route path="/agi-path" element={<AgiPathPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </Router>
        </ConfigProvider>
      </ThemeProvider>
    </LocaleProvider>
  );
}
