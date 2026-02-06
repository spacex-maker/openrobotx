import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Input, Pagination, Spin, Empty } from 'antd';
import { SearchOutlined, CalendarOutlined, TagOutlined, AppstoreOutlined, UnorderedListOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons';
import { useLocale } from '../../contexts/LocaleContext';
import AppHeader from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { getNewsList } from '../../api/openrobotx';
import { addImageCompressSuffix } from '../../utils/imageUtils';

const NEWS_TYPE_TAGS = [
  { value: null, labelZh: '全部类型', labelEn: 'All' },
  { value: 1, labelZh: '快讯', labelEn: 'News Flash' },
  { value: 2, labelZh: '深度文章', labelEn: 'In-depth' },
  { value: 3, labelZh: '融资财报', labelEn: 'Funding' },
  { value: 4, labelZh: '发布会', labelEn: 'Launch' },
];

const PageWrap = styled.div`
  min-height: 100vh;
  background: #0a0e17;
  color: #e8eaed;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  padding-top: 72px;
`;

const Hero = styled.section`
  padding: 64px 24px 48px;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  @media (max-width: 768px) {
    padding: 48px 16px 32px;
  }
`;

const HeroTitle = styled.h1`
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #fff;
  margin: 0 0 12px;
  line-height: 1.2;
`;

const HeroSubtitle = styled.p`
  font-size: 17px;
  color: #9aa0a6;
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 80px;
  @media (max-width: 768px) {
    padding: 0 16px 48px;
  }
`;

const SectionTop = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 32px;
`;

const Filters = styled.div`
  flex: 1;
  min-width: 0;
`;

const LayoutToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  button {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.04);
    color: #9aa0a6;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
    &:hover {
      color: #e8eaed;
      border-color: rgba(0, 212, 170, 0.4);
    }
    &.active {
      background: rgba(0, 212, 170, 0.15);
      border-color: #00d4aa;
      color: #00d4aa;
    }
  }
`;

const TypeTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const TypeTag = styled.button`
  padding: 8px 18px;
  font-size: 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.04);
  color: #9aa0a6;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
  &:hover {
    border-color: rgba(0, 212, 170, 0.5);
    color: #e8eaed;
  }
  &.active {
    background: #00d4aa;
    border-color: #00d4aa;
    color: #0a0e17;
    font-weight: 600;
  }
`;

const SearchRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  .ant-input-affix-wrapper {
    border-radius: 9999px;
    max-width: 280px;
    background: rgba(255, 255, 255, 0.04) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
  }
  .ant-input {
    background: transparent !important;
    color: #e8eaed !important;
  }
`;

const SearchBtn = styled.button`
  padding: 8px 24px;
  border-radius: 9999px;
  background: #00d4aa;
  color: #0a0e17;
  border: none;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Card = styled.article`
  background: transparent;
  border: none;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s;
  cursor: pointer;
  position: relative;
  height: 400px;
  width: 100%;
  
  &:hover {
    transform: translateY(-6px);
    
    img {
      transform: scale(1.05);
    }
    
    .news-card-body {
      border-color: rgba(0, 212, 170, 0.5);
      box-shadow: 
        0 16px 56px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba(0, 212, 170, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      background: linear-gradient(
        135deg,
        rgba(10, 14, 23, 0.6) 0%,
        rgba(15, 20, 30, 0.58) 50%,
        rgba(10, 14, 23, 0.62) 100%
      );
    }
  }
  ${(p) =>
    p.$list &&
    `
    display: flex;
    flex-direction: row;
    align-items: stretch;
    height: 200px;
    overflow: visible;
    
    .news-card-body {
      position: relative;
      top: auto;
      bottom: auto;
      left: auto;
      right: auto;
      margin: 20px 20px 20px -48px;
      border-radius: 16px;
      padding-left: 64px;
      background: linear-gradient(
        135deg,
        rgba(10, 14, 23, 0.52) 0%,
        rgba(15, 20, 30, 0.48) 50%,
        rgba(10, 14, 23, 0.55) 100%
      );
    }
    .news-card-title {
      -webkit-line-clamp: 2;
    }
    .news-card-summary {
      -webkit-line-clamp: 2;
    }
  `}
`;

const CardCover = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 280px;
  background: rgba(0, 0, 0, 0.4);
  overflow: hidden;
  border-radius: 16px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s;
  }
`;

const ListCover = styled.div`
  width: 240px;
  min-width: 240px;
  flex-shrink: 0;
  align-self: stretch;
  background-color: rgba(0, 0, 0, 0.4);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 16px;
  z-index: 1;
`;

const CardBody = styled.div.attrs({ className: 'news-card-body' })`
  padding: 18px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: absolute;
  top: 250px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  
  /* 更透明的玻璃态效果 */
  background: linear-gradient(
    135deg,
    rgba(10, 14, 23, 0.5) 0%,
    rgba(15, 20, 30, 0.45) 50%,
    rgba(10, 14, 23, 0.52) 100%
  );
  backdrop-filter: blur(36px) saturate(220%);
  -webkit-backdrop-filter: blur(36px) saturate(220%);
  border-radius: 0 0 16px 16px;
  
  /* 多层边框效果 */
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 4px 16px rgba(0, 0, 0, 0.3),
    inset 0 1px 1px rgba(255, 255, 255, 0.2),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1);
  
  /* 顶部高光条 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 20%;
    right: 20%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 100%
    );
    z-index: 1;
  }
  
  /* 底部微光 */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(0, 212, 170, 0.05) 100%
    );
    border-radius: 0 0 16px 16px;
    pointer-events: none;
  }
  
  transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s, background 0.3s;
  
  @media (max-width: 768px) {
    top: 250px;
    padding: 16px;
  }
`;

const CardTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
`;

const CardType = styled.span`
  display: inline-block;
  font-size: 12px;
  color: #00d4aa;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const CardSource = styled.span`
  font-size: 12px;
  color: #6b7280;
  margin-left: auto;
  flex-shrink: 0;
  max-width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CardTitle = styled.h2.attrs({ className: 'news-card-title' })`
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 6px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardSummary = styled.p.attrs({ className: 'news-card-summary' })`
  font-size: 13px;
  color: #9aa0a6;
  line-height: 1.5;
  margin: 0 0 10px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
  margin-top: auto;
  .card-meta-time {
    white-space: nowrap;
    flex-shrink: 0;
  }
  .card-meta-stats {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }
  .card-meta-right {
    margin-left: auto;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 45%;
  }
`;

const PaginationWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 48px;
  .ant-pagination-item, .ant-pagination-prev, .ant-pagination-next {
    background: rgba(255, 255, 255, 0.04) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    a { color: #e8eaed !important; }
  }
  .ant-pagination-item-active {
    border-color: #00d4aa !important;
    a { color: #00d4aa !important; }
  }
`;

const SpinWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 320px;
`;

const EmptyWrap = styled.div`
  padding: 64px 24px;
  text-align: center;
  color: #9aa0a6;
`;

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const getTypeLabel = (newsType, isZh) => {
  const o = NEWS_TYPE_TAGS.find((x) => x.value === newsType);
  if (!o) return isZh ? '资讯' : 'News';
  return isZh ? o.labelZh : o.labelEn;
};

const getNewsTitle = (item, isZh) =>
  isZh ? (item.titleCn || item.title || '') : (item.title || item.titleCn || '');
const getNewsSummary = (item, isZh) =>
  isZh ? (item.summaryCn || item.summary || '') : (item.summary || item.summaryCn || '');

const NewsListPage = () => {
  const navigate = useNavigate();
  const { locale } = useLocale();
  const isZh = !locale || locale === 'zh-CN' || String(locale).toLowerCase().startsWith('zh');
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [newsType, setNewsType] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [layoutMode, setLayoutMode] = useState('grid');

  // 国际化文本
  const pageTitle = isZh ? '行业资讯' : 'Industry News';
  const pageSubtitle = isZh 
    ? '人形机器人、具身智能与开源机器人领域的最新动态、深度解读与融资财报'
    : 'Latest updates, in-depth analysis, and funding reports in humanoid robots, embodied intelligence, and open-source robotics';
  const searchPlaceholder = isZh ? '搜索标题或摘要' : 'Search title or summary';
  const searchButton = isZh ? '搜索' : 'Search';
  const emptyText = isZh ? '暂无数据' : 'No data available';
  const gridLayoutTitle = isZh ? '方块布局' : 'Grid Layout';
  const listLayoutTitle = isZh ? '列表布局' : 'List Layout';

  const fetchList = async (page = 1) => {
    setLoading(true);
    const res = await getNewsList({
      currentPage: page,
      pageSize,
      newsType: newsType ?? undefined,
      keyword: keyword.trim() || undefined,
    });
    setLoading(false);
    if (res.success && res.data) {
      setList(res.data.data || []);
      setTotal(res.data.totalNum || 0);
    } else {
      setList([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    fetchList(currentPage);
  }, [currentPage, newsType]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchList(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageWrap>
      <Helmet>
        <title>{pageTitle} | Open Robot X</title>
        <meta name="description" content={pageSubtitle} />
      </Helmet>
      <AppHeader />
      <Hero>
        <HeroTitle>{pageTitle}</HeroTitle>
        <HeroSubtitle>
          {pageSubtitle}
        </HeroSubtitle>
      </Hero>
      <Section>
        <SectionTop>
          <Filters>
            <TypeTags>
              {NEWS_TYPE_TAGS.map(({ value, labelZh, labelEn }) => (
                <TypeTag
                  key={value === null ? 'all' : value}
                  type="button"
                  className={newsType === value ? 'active' : ''}
                  onClick={() => {
                    setNewsType(value);
                    setCurrentPage(1);
                  }}
                >
                  {isZh ? labelZh : labelEn}
                </TypeTag>
              ))}
            </TypeTags>
            <SearchRow>
              <Input
                placeholder={searchPlaceholder}
                prefix={<SearchOutlined />}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onPressEnter={handleSearch}
                style={{ width: 240 }}
                allowClear
              />
              <SearchBtn type="button" onClick={handleSearch}>
                {searchButton}
              </SearchBtn>
            </SearchRow>
          </Filters>
          <LayoutToggle>
            <button
              type="button"
              className={layoutMode === 'grid' ? 'active' : ''}
              onClick={() => setLayoutMode('grid')}
              title={gridLayoutTitle}
            >
              <AppstoreOutlined />
            </button>
            <button
              type="button"
              className={layoutMode === 'list' ? 'active' : ''}
              onClick={() => setLayoutMode('list')}
              title={listLayoutTitle}
            >
              <UnorderedListOutlined />
            </button>
          </LayoutToggle>
        </SectionTop>

        {loading ? (
          <SpinWrap>
            <Spin size="large" />
          </SpinWrap>
        ) : list.length === 0 ? (
          <EmptyWrap>
            <Empty description={emptyText} />
          </EmptyWrap>
        ) : (
          <>
            {layoutMode === 'grid' ? (
              <CardGrid>
                {list.map((item) => {
                  const title = getNewsTitle(item, isZh);
                  const summary = getNewsSummary(item, isZh);
                  return (
                    <Card key={item.id} onClick={() => navigate(`/news/${item.id}`)}>
                      <CardCover>
                        {item.coverImage ? (
                          <img src={addImageCompressSuffix(item.coverImage, 400)} alt="" loading="lazy" />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1f2e 0%, #0d1117 100%)' }} />
                        )}
                      </CardCover>
                      <CardBody>
                        <CardTopRow>
                          <CardType>{getTypeLabel(item.newsType, isZh)}</CardType>
                          {item.sourceName && <CardSource>{item.sourceName}</CardSource>}
                        </CardTopRow>
                        <CardTitle>{title}</CardTitle>
                        <CardSummary>{summary}</CardSummary>
                        <CardMeta>
                          {item.publishTime && (
                            <span className="card-meta-time"><CalendarOutlined /> {formatDate(item.publishTime)}</span>
                          )}
                          <span className="card-meta-stats">
                            <span><EyeOutlined /> {item.viewCount ?? 0}</span>
                            <span><LikeOutlined /> {item.likeCount ?? 0}</span>
                          </span>
                          {item.tags && (
                            <span className="card-meta-right"><TagOutlined /> {String(item.tags).split(',').slice(0, 2).join(', ')}</span>
                          )}
                        </CardMeta>
                      </CardBody>
                    </Card>
                  );
                })}
              </CardGrid>
            ) : (
              <CardList>
                {list.map((item) => {
                  const title = getNewsTitle(item, isZh);
                  const summary = getNewsSummary(item, isZh);
                  return (
                    <Card key={item.id} $list onClick={() => navigate(`/news/${item.id}`)}>
                      <ListCover
                        style={
                          item.coverImage
                            ? { backgroundImage: `url(${addImageCompressSuffix(item.coverImage, 400)})` }
                            : { background: 'linear-gradient(135deg, #1a1f2e 0%, #0d1117 100%)' }
                        }
                      />
                      <CardBody>
                        <CardTopRow>
                          <CardType>{getTypeLabel(item.newsType, isZh)}</CardType>
                          {item.sourceName && <CardSource>{item.sourceName}</CardSource>}
                        </CardTopRow>
                        <CardTitle>{title}</CardTitle>
                      <CardSummary>{summary}</CardSummary>
                      <CardMeta>
                        {item.publishTime && (
                          <span className="card-meta-time"><CalendarOutlined /> {formatDate(item.publishTime)}</span>
                        )}
                        <span className="card-meta-stats">
                          <span><EyeOutlined /> {item.viewCount ?? 0}</span>
                          <span><LikeOutlined /> {item.likeCount ?? 0}</span>
                        </span>
                        {item.tags && (
                          <span className="card-meta-right"><TagOutlined /> {String(item.tags).split(',').slice(0, 2).join(', ')}</span>
                        )}
                      </CardMeta>
                    </CardBody>
                  </Card>
                );
              })}
            </CardList>
            )}
            {total > pageSize && (
              <PaginationWrap>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={total}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showTotal={(t) => `共 ${t} 条`}
                />
              </PaginationWrap>
            )}
          </>
        )}
      </Section>
      <Footer />
    </PageWrap>
  );
};

export default NewsListPage;
