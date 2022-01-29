module.exports = {
  apps: [
    {
      name: 'server',
      script: 'dist/main.js',
      exec_mode: 'cluster',
      instances: 0,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
