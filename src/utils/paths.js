/**
 * 前端路由路径集中定义，用于未登录跳转等场景。
 * 使用 PUBLIC_URL 以支持子路径部署（如 package.json 的 homepage）。
 */
const base = process.env.PUBLIC_URL || '';

export const paths = {
  home: base || '/',
  login: base + '/login',
  signup: base + '/signup',
};

export function getLoginPath() {
  return paths.login;
}

export function getSignupPath() {
  return paths.signup;
}
