module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // 'module:metro-react-native-babel-preset', 
      'babel-preset-expo'
    ],
    plugins: [
      // Other plugins as needed, such as:
      // ['module:react-native-dotenv'],
      'react-native-reanimated/plugin', // Uncomment if you need this
    ],
  };
};
