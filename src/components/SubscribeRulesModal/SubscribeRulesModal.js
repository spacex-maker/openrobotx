import React from 'react';
import { Modal, Typography, Button, Space, Divider } from 'antd';
import { MailOutlined, CheckCircleOutlined, ClockCircleOutlined, StopOutlined, SafetyOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useTranslation } from '../../contexts/LocaleContext';

const { Paragraph } = Typography;

const ModalContent = styled.div`
  .ant-typography { color: rgba(255, 255, 255, 0.88); }
  .ant-typography.ant-typography-secondary { color: #9aa0a6; }
  .rule-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }
  .rule-item .icon {
    color: #00d4aa;
    font-size: 18px;
    margin-top: 2px;
  }
  .rule-item .label {
    font-weight: 600;
    color: #fff;
    margin-bottom: 4px;
  }
  .rule-item .desc {
    color: #9aa0a6;
    font-size: 14px;
    line-height: 1.5;
  }
`;

const SubscribeRulesModal = ({ open, onClose, onGoSubscribe }) => {
  const t = useTranslation();
  const rules = [
    { icon: <MailOutlined className="icon" />, labelKey: 'subscribeModal.rule1Label', descKey: 'subscribeModal.rule1Desc' },
    { icon: <ClockCircleOutlined className="icon" />, labelKey: 'subscribeModal.rule2Label', descKey: 'subscribeModal.rule2Desc' },
    { icon: <StopOutlined className="icon" />, labelKey: 'subscribeModal.rule3Label', descKey: 'subscribeModal.rule3Desc' },
    { icon: <SafetyOutlined className="icon" />, labelKey: 'subscribeModal.rule4Label', descKey: 'subscribeModal.rule4Desc' },
  ];
  const handleGoSubscribe = () => {
    onClose?.();
    onGoSubscribe?.();
  };

  return (
    <Modal
      title={
        <Space>
          <MailOutlined style={{ color: '#00d4aa' }} />
          <span>{t('subscribeModal.title')}</span>
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          {t('common.close')}
        </Button>,
        <Button key="go" type="primary" icon={<CheckCircleOutlined />} onClick={handleGoSubscribe}>
          {t('subscribeModal.goSubscribe')}
        </Button>,
      ]}
      width={520}
      centered
      destroyOnClose
      styles={{
        header: { borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#0f1419', color: '#fff' },
        body: { paddingTop: 16, background: '#0f1419', color: 'rgba(255,255,255,0.88)' },
        footer: { borderTop: '1px solid rgba(255,255,255,0.08)', background: '#0f1419' },
        content: { backgroundColor: '#0f1419', borderRadius: 16 },
        mask: { backdropFilter: 'blur(4px)' },
      }}
    >
      <ModalContent>
        <Paragraph type="secondary" style={{ marginBottom: 20 }}>
          {t('subscribeModal.intro')}
        </Paragraph>
        <Divider style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '16px 0' }} />
        {rules.map((r, i) => (
          <div key={i} className="rule-item">
            <span className="icon">{r.icon}</span>
            <div>
              <div className="label">{t(r.labelKey)}</div>
              <div className="desc">{t(r.descKey)}</div>
            </div>
          </div>
        ))}
      </ModalContent>
    </Modal>
  );
};

export default SubscribeRulesModal;
