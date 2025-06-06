const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const config = getDefaultConfig(__dirname);

// 可选：屏蔽 react-native-maps 模块目录，避免 Metro 扫描
config.resolver.blockList = exclusionList([/node_modules\/react-native-maps\/.*/]);

// Web 平台将 react-native-maps 解析为空模块
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'react-native-maps') {
    return { type: 'empty' };
  }
  // 其他情况使用默认解析器
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
