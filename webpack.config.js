const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAllowSyncFileSystemAccess: true,
      },
    },
    argv
  );

  // Customize the config before returning it
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
  };

  // Configure for progressive web app
  config.plugins = config.plugins || [];
  
  return config;
};