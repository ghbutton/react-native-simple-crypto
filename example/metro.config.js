const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const libraryRoot = path.resolve(__dirname, '..');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [libraryRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(libraryRoot, 'node_modules'),
    ],
    blockList: [
      new RegExp(
        `${libraryRoot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/node_modules/react-native/.*`,
      ),
      new RegExp(
        `${libraryRoot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/node_modules/react/.*`,
      ),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
