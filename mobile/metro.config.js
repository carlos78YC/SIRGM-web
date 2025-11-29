// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuración para evitar problemas con node:sea en Windows
// Deshabilitar package exports para evitar el error de node:sea
config.resolver = {
  ...config.resolver,
  unstable_enablePackageExports: false,
  sourceExts: [...config.resolver.sourceExts, 'cjs'],
};

// Configuración de watchFolders para evitar problemas con paths
config.watchFolders = [__dirname];

module.exports = config;

