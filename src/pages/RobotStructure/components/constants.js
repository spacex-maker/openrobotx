import React from 'react';
import {
  ApiOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  ControlOutlined,
  DatabaseOutlined,
  SafetyOutlined,
  CloudOutlined,
  ClusterOutlined,
  ExperimentOutlined,
  RocketOutlined,
  SettingOutlined,
  ToolOutlined,
  CloseOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';

export const ICON_MAP = {
  ApiOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  ControlOutlined,
  DatabaseOutlined,
  SafetyOutlined,
  CloudOutlined,
  ClusterOutlined,
  ExperimentOutlined,
  RocketOutlined,
  SettingOutlined,
  ToolOutlined,
  CloseOutlined,
  ShareAltOutlined,
};

export const renderIcon = (icon) => {
  if (icon == null) return null;
  if (React.isValidElement(icon)) return icon;
  return React.createElement(icon, null);
};
