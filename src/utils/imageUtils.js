/**
 * 添加腾讯云图片压缩后缀
 * @param {string} url - 图片URL
 * @param {number} width - 缩略图宽度（默认值根据使用场景调整）
 * @returns {string} 添加压缩后缀的URL
 */
export const addImageCompressSuffix = (url, width = 1200) => {
  if (!url) return '';
  // 如果已经包含压缩参数或是base64图片，直接返回
  if (url.includes('imageMogr2') || url.startsWith('data:')) return url;
  // 添加腾讯云万象压缩参数
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}imageMogr2/format/webp/quality/80/thumbnail/${width}x`;
};
