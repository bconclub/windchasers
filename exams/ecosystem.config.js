module.exports = {
  apps: [
    {
      name: "windchasers-exams",
      cwd: "/var/www/windchasers/exams",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "500M",
      error_file: "/var/log/pm2/windchasers-exams-error.log",
      out_file: "/var/log/pm2/windchasers-exams-out.log",
      time: true,
    },
  ],
};
