module.exports = {
  apps: [
    {
      name: 'memix-api',
      cwd: './api',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4444,
      },
    },
    {
      name: 'memix-client',
      cwd: './client',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      env: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_API_URL: 'http://93.180.133.166/api', // Corrected for production
      },
    },
  ],
};
