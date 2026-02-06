import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import AppHeader from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const PageWrap = styled.div`
  min-height: 100vh;
  background: #0a0e17;
  color: #e8eaed;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  padding-top: 72px;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
`;

const Hero = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const Title = styled.h1`
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
`;

const Tagline = styled.p`
  font-size: 18px;
  color: #9aa0a6;
  max-width: 720px;
  margin: 0 auto;
`;

const Section = styled.section`
  margin-bottom: 48px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 16px;
`;

const Paragraph = styled.p`
  font-size: 16px;
  color: #b0b5ba;
  line-height: 1.7;
  margin-bottom: 12px;
`;

const HighlightList = styled.ul`
  list-style: none;
  padding: 0;
  li {
    font-size: 15px;
    color: #e8eaed;
    padding: 12px 16px;
    margin-bottom: 8px;
    background: rgba(0, 212, 170, 0.08);
    border-left: 3px solid #00d4aa;
    border-radius: 8px;
  }
`;

const CompanyPageLayout = ({ data, theme }) => {
  const title = `${data.name}${data.nameCn ? ` · ${data.nameCn}` : ''} | Open Robot X`;

  return (
    <PageWrap>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={data.tagline} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
      </Helmet>
      <AppHeader />
      <Content>
        <Hero>
          <Title style={{ color: theme?.primary || '#00d4aa' }}>
            {data.name}
            {data.nameCn && <span style={{ fontSize: '0.6em', color: '#9aa0a6', display: 'block', marginTop: 8 }}>{data.nameCn}</span>}
          </Title>
          <Tagline>{data.tagline}</Tagline>
        </Hero>

        {data.aboutParagraphs && data.aboutParagraphs.length > 0 && (
          <Section>
            <SectionTitle>关于公司</SectionTitle>
            {data.aboutParagraphs.map((p, i) => (
              <Paragraph key={i}>{p}</Paragraph>
            ))}
          </Section>
        )}

        {data.highlights && data.highlights.length > 0 && (
          <Section>
            <SectionTitle>核心亮点</SectionTitle>
            <HighlightList>
              {data.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </HighlightList>
          </Section>
        )}

        {data.officialUrl && (
          <Section>
            <a
              href={data.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                background: theme?.primary || '#00d4aa',
                color: '#0a0e17',
                fontWeight: 600,
                borderRadius: 100,
                textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
            >
              访问官网 →
            </a>
          </Section>
        )}
      </Content>
      <Footer />
    </PageWrap>
  );
};

export default CompanyPageLayout;
