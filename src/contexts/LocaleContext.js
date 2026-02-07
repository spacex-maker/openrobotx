import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { IntlProvider, useIntl } from 'react-intl';
import { LOCALE_MAP, MESSAGES, LANGUAGES } from '../locales';

/** 将嵌套的 messages 展平，react-intl 需要扁平 key 格式 */
function flattenMessages(nested, prefix = '') {
  if (nested == null || typeof nested !== 'object') return {};
  return Object.keys(nested).reduce((acc, key) => {
    const value = nested[key];
    const flatKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      acc[flatKey] = value;
    } else {
      Object.assign(acc, flattenMessages(value, flatKey));
    }
    return acc;
  }, {});
}

export const LocaleContext = createContext();

/**
 * 检测浏览器/系统语言
 * @returns {string} 语言短代码 (如 'zh', 'en')
 */
function detectBrowserLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = (browserLang.split('-')[0] || '').toLowerCase();

  if (LOCALE_MAP[langCode]) {
    return langCode;
  }

  return 'zh'; // 默认中文
}

/**
 * 从 localStorage 或浏览器检测获取初始语言
 */
function getInitialLocale() {
  // 1. 优先从 localStorage 读取（与 Header 选择同步）
  const saved = localStorage.getItem('locale');
  if (saved && LOCALE_MAP[saved]) {
    return LOCALE_MAP[saved];
  }

  // 2. 自动检测浏览器语言
  const detectedLang = detectBrowserLanguage();
  if (detectedLang && LOCALE_MAP[detectedLang]) {
    return LOCALE_MAP[detectedLang];
  }

  // 3. 默认中文
  return 'zh-CN';
}

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(getInitialLocale);
  const messages = useMemo(
    () => flattenMessages(MESSAGES[locale] || MESSAGES['zh-CN']),
    [locale]
  );

  const changeLocale = useCallback((newLocale) => {
    // 支持短代码（zh, en）或完整代码（zh-CN, en-US）
    let standardLocale = LOCALE_MAP[newLocale] || newLocale;
    if (!MESSAGES[standardLocale]) {
      standardLocale = 'zh-CN';
    }
    setLocale(standardLocale);
    // 存短代码，与 Header 语言列表的 languageCode 对应
    const shortCode = standardLocale.split('-')[0];
    localStorage.setItem('locale', shortCode);
  }, []);

  const shortLocale = locale.split('-')[0];

  return (
    <LocaleContext.Provider
      value={{
        locale: shortLocale,
        fullLocale: locale,
        changeLocale,
        languages: LANGUAGES,
      }}
    >
      <IntlProvider
        key={locale}
        messages={messages}
        locale={locale}
        defaultLocale="zh-CN"
      >
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);

/**
 * 翻译 Hook - 基于 react-intl，提供 t(key, values) 便捷方法
 * 使用方式: const t = useTranslation(); t('common.loading'); t('news.total', { count: 10 })
 */
export function useTranslation() {
  const intl = useIntl();

  return useCallback(
    (id, values) => {
      return intl.formatMessage({ id }, values);
    },
    [intl]
  );
}
