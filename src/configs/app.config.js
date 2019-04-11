module.exports = {
  platform: process.platform,
  port: process.env.PORT ? process.env.PORT : 3000,
  title: 'Children Activity',
  languages: ['en', 'jp','zh'],
  fallbackLng: 'en',
  namespace: 'translation'
};