// ecosystem.config.js
export const apps = [
  {
    name: "sewer-app",
    script: "./build/index.js",
    interpreter: "node",
    interpreter_args: "--env-file=/opt/sewer-comedy/.env",
  },
];
