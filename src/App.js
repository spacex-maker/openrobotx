import React from 'react';
import 'antd/dist/reset.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme, message } from 'antd';
import { ThemeProvider } from 'styled-components';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { LocaleProvider, useLocale } from './contexts/LocaleContext';
import { Helmet } from 'react-helmet';

// Pages
import HomePage from './pages/Home';
import CompanyPage from './pages/Companies/CompanyPage';
import RobotPage from './pages/Robots/RobotPage';
import RobotStructurePage from './pages/RobotStructure/RobotStructurePage';
import NewsListPage from './pages/News/NewsListPage';
import NewsDetailPage from './pages/News/NewsDetailPage';
import AgiPathPage from './pages/AgiPath/AgiPathPage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';

// Ant Design 语言包
const antdLocaleMap = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

function AppContent() {
  const { fullLocale } = useLocale();

  return (
    <ThemeProvider
      theme={{
        isDark: true,
        primary: '#00d4aa',
        bg: '#0a0e17',
        text: '#e8eaed',
        textSecondary: '#9aa0a6',
      }}
    >
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: '#00d4aa',
            colorBgBase: '#0a0e17',
            colorText: '#e8eaed',
            colorTextSecondary: '#9aa0a6',
            borderRadius: 8,
          },
        }}
        locale={antdLocaleMap[fullLocale] || zhCN}
      >
        <Router>
          <Helmet>
            <html lang={fullLocale?.startsWith('zh') ? 'zh-CN' : 'en-US'} />
          </Helmet>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/companies/:slug" element={<CompanyPage />} />
            <Route path="/robots/:id" element={<RobotPage />} />
            <Route path="/robot-structure" element={<RobotStructurePage />} />
            <Route path="/news" element={<NewsListPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
            <Route path="/agi-path" element={<AgiPathPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default function App() {
  message.config({
    top: 60,
    duration: 2,
    maxCount: 3,
  });

  return (
    <LocaleProvider>
      <AppContent />
    </LocaleProvider>
  );
}
