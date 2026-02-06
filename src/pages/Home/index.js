import React from 'react';
import { Helmet } from 'react-helmet';
import { PageContainer } from '../styles';
import AppHeader from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import RobotCompaniesSection from './components/RobotCompaniesSection';
import RobotCompareSection from './components/RobotCompareSection';
import SubscribeSection from './components/SubscribeSection';

const TITLE = 'Open Robot X - 开源具身智能社区';
const DESCRIPTION =
  'Open Robot X 聚焦 Humanoid、Embodied AI、ROS 与开源机器人，连接开发者与爱好者，推动下一代机器人技术。';

const HomePage = () => {
  return (
    <PageContainer>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="keywords" content="open source robot, humanoid, embodied AI, ROS, 开源机器人, 具身智能, 人形机器人" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
      </Helmet>
      <AppHeader />
      <HeroSection />
      <FeaturesSection />
      <RobotCompaniesSection />
      <RobotCompareSection />
      <SubscribeSection />
      <Footer />
    </PageContainer>
  );
};

export default HomePage;
