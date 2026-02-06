# 文件复制指南

由于部分组件和页面文件较大且复杂，建议从原项目直接复制以下文件：

## 需要复制的文件

### 1. 首页组件（从 protx-soramv/src/pages/OpenRobotX/components/）
- `RobotCompaniesSection.js` → `src/pages/Home/components/RobotCompaniesSection.js`
- `RobotCompareSection.js` → `src/pages/Home/components/RobotCompareSection.js`

### 2. 公司页面（从 protx-soramv/src/pages/OpenRobotX/companies/）
- `CompanyPage.js` → `src/pages/Companies/CompanyPage.js`
- `CompanyPageLayout.js` → `src/pages/Companies/CompanyPageLayout.js`
- `companyAdapter.js` → `src/pages/Companies/companyAdapter.js`
- `sections/` 目录下的所有文件 → `src/pages/Companies/sections/`

### 3. 机器人页面（从 protx-soramv/src/pages/OpenRobotX/robots/）
- `RobotPage.js` → `src/pages/Robots/RobotPage.js`

### 4. 资讯页面（从 protx-soramv/src/pages/OpenRobotX/news/）
- `NewsListPage.js` → `src/pages/News/NewsListPage.js`
- `NewsDetailPage.js` → `src/pages/News/NewsDetailPage.js`

### 5. AGI路径页面（从 protx-soramv/src/pages/OpenRobotX/agi/）
- `AgiPathPage.js` → `src/pages/AgiPath/AgiPathPage.js`

### 6. 登录注册页面（从 protx-soramv/src/pages/OpenRobotX/auth/）
- `OpenRobotXLoginPage.js` → `src/pages/Auth/LoginPage.js`
- `OpenRobotXSignupPage.js` → `src/pages/Auth/SignupPage.js`

## 复制后需要调整的内容

1. **导入路径**：将所有相对路径导入改为从 `src` 开始的绝对路径
   - `../../../api/openrobotx` → `../../api/openrobotx` 或使用绝对路径
   - `../../../contexts/LocaleContext` → `../../contexts/LocaleContext`
   - `../../../utils/imageUtils` → `../../utils/imageUtils`

2. **路由路径**：将 `/openrobotx/` 前缀改为 `/`
   - `/openrobotx/news` → `/news`
   - `/openrobotx/companies/:slug` → `/companies/:slug`
   - `/openrobotx/robots/:id` → `/robots/:id`
   - `/openrobotx/agi-path` → `/agi-path`
   - `/openrobotx/login` → `/login`
   - `/openrobotx/signup` → `/signup`

3. **组件引用**：
   - `OpenRobotXHeader` → `AppHeader` (从 `../../components/Header/Header`)
   - `FooterSection` → `Footer` (从 `../../components/Footer/Footer`)

4. **图片压缩工具**：
   - 使用 `addImageCompressSuffix` 从 `../../utils/imageUtils` 导入

## 快速复制脚本（Windows PowerShell）

```powershell
# 复制 RobotCompaniesSection
Copy-Item "e:\pro\protx-soramv\src\pages\OpenRobotX\components\RobotCompaniesSection.js" "e:\pro\openrobotx\src\pages\Home\components\RobotCompaniesSection.js"

# 复制 RobotCompareSection
Copy-Item "e:\pro\protx-soramv\src\pages\OpenRobotX\components\RobotCompareSection.js" "e:\pro\openrobotx\src\pages\Home\components\RobotCompareSection.js"

# 复制公司页面
Copy-Item "e:\pro\protx-soramv\src\pages\OpenRobotX\companies\*" "e:\pro\openrobotx\src\pages\Companies\" -Recurse

# 复制机器人页面
Copy-Item "e:\pro\protx-soramv\src\pages\OpenRobotX\robots\*" "e:\pro\openrobotx\src\pages\Robots\" -Recurse

# 复制资讯页面
Copy-Item "e:\pro\protx-soramv\src\pages\OpenRobotX\news\*" "e:\pro\openrobotx\src\pages\News\" -Recurse

# 复制AGI路径页面
Copy-Item "e:\pro\protx-soramv\src\pages\OpenRobotX\agi\*" "e:\pro\openrobotx\src\pages\AgiPath\" -Recurse

# 复制登录注册页面
Copy-Item "e:\pro\protx-soramv\src\pages\OpenRobotX\auth\OpenRobotXLoginPage.js" "e:\pro\openrobotx\src\pages\Auth\LoginPage.js"
Copy-Item "e:\pro\protx-soramv\src\pages\OpenRobotX\auth\OpenRobotXSignupPage.js" "e:\pro\openrobotx\src\pages\Auth\SignupPage.js"
```

## 注意事项

1. 复制后需要手动调整所有导入路径
2. 确保所有组件都正确引用新的 Header 和 Footer 组件
3. 检查路由路径是否正确
4. 确保图片压缩工具函数正确导入和使用
