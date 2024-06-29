module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
    // plugins: ['transform-inline-environment-variables', 'module:react-native-dotenv'],
    // extra: {
    //   clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
    // }
  };
};