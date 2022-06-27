import { projectBuild, configOptions } from "project-build-ci";

const path = require('path');

projectBuild({
  apps: {
    label: 'swagger-build',
    name: 'swagger-build',
    projectPath: path.join(__dirname, '../'),
  },

  envs: [
    {
      name: 'prd',
      identifier: '',
      releaseBranch: 'release',
    },
    {
      name: 'dev',
      identifier: '',
      releaseBranch: 'dev',
    },
  ],
  prdAppEnv: 'prd',
});
