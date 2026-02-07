/**
 * 国际化资源 - 与 Header 语言选择联动
 * 参考 productx-backend-react 的 locales 结构
 */
import zh from './zh/translation.json';
import en from './en/translation.json';

export const LOCALE_MAP = {
  zh: 'zh-CN',
  en: 'en-US',
};

export const MESSAGES = {
  'zh-CN': zh,
  'en-US': en,
};

export const LANGUAGES = [
  { languageCode: 'zh-CN', languageNameNative: '简体中文', shortCode: 'zh' },
  { languageCode: 'en-US', languageNameNative: 'English', shortCode: 'en' },
];

export default { LOCALE_MAP, MESSAGES, LANGUAGES };
