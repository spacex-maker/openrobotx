import React, { createContext, useState, useContext } from 'react';
import { IntlProvider } from 'react-intl';

// 简化版：仅支持中英文
const messages = {
  'zh-CN': {},
  'en-US': {},
};

const LOCALES = {
  'zh': 'zh-CN',
  'en': 'en-US',
};

export const LocaleContext = createContext();

/**
 * 检测浏览器/系统语言
 * @returns {string} 语言代码 (如 'zh', 'en')
 */
function detectBrowserLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  if (LOCALES[langCode]) {
    return langCode;
  }
  
  return 'zh'; // 默认中文
}

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    // 1. 优先从 localStorage 读取
    const saved = localStorage.getItem('locale');
    if (saved && LOCALES[saved]) {
      return LOCALES[saved];
    }
    
    // 2. 自动检测浏览器语言
    const detectedLang = detectBrowserLanguage();
    if (detectedLang) {
      return LOCALES[detectedLang];
    }
    
    // 3. 默认中文
    return 'zh-CN';
  });

  const changeLocale = (newLocale) => {
    // 支持短代码（zh, en）或完整代码（zh-CN, en-US）
    let standardLocale = LOCALES[newLocale];
    if (!standardLocale && messages[newLocale]) standardLocale = newLocale;
    if (!standardLocale) standardLocale = LOCALES['zh'] || 'zh-CN';
    setLocale(standardLocale);
    localStorage.setItem('locale', standardLocale.split('-')[0]);
  };

  return (
    <LocaleContext.Provider value={{ 
      locale: locale.split('-')[0], 
      changeLocale 
    }}>
      <IntlProvider
        messages={messages[locale]}
        locale={locale}
        defaultLocale="zh-CN"
      >
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
