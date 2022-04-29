import yargs, { showHelpOnFail } from 'yargs';
import { prompt } from 'enquirer';
import chalk from 'chalk';
import semver from 'semver';
import packageJson from '../../package.json';
import logSymbols from 'log-symbols';
const simpleGit = require('simple-git');
const shelljs = require('shelljs');

type PreBuildEnv = 'dev' | 'beta' | 'release';
type ReleaseType = 'prerelease' | 'prepatch' | 'preminor' | 'major';

interface EnvVersion {
  env: PreBuildEnv;
  releaseType: ReleaseType;
}

export const preBuild: yargs.CommandModule = {
  command: ['pre:build'],
  describe: '预打包',
  handler: async () => {
    try {
      const curVersion = packageJson.version;
      const { env, releaseType } = await prompt<EnvVersion>([
        {
          type: 'select',
          name: 'env',
          message: '请选择打包环境',
          choices: [
            {
              name: 'dev',
              message: '开发版',
            },
            {
              name: 'beta',
              message: '测试版',
            },
            {
              name: 'release',
              message: '正式版',
            },
          ],
        },
        {
          type: 'select',
          name: 'releaseType',
          message: '请选择打包版本',
          choices: [
            {
              name: 'prerelease',
              message: '补丁版本',
            },
            {
              name: 'prepatch',
              message: '小版本',
            },
            {
              name: 'preminor',
              message: '中版本',
            },
            {
              name: 'major',
              message: '大版本',
            },
          ],
        },
      ]);

      const nextVersion = semver.inc(curVersion, releaseType, env);
      const { confirm } = await prompt<{ confirm?: boolean }>({
        type: 'confirm',
        name: 'confirm',
        message: `当前版本: v${curVersion}, 请确定打包版本: v${nextVersion}`,
      });
      if (!confirm) return console.log(chalk.red('取消打包'));
      if (!semver.valid(nextVersion))
        return console.log(logSymbols.error, chalk.red('版本号格式错误'));
      const git = simpleGit();
      const diff = await git.diff();
      if (diff)
        return console.log(logSymbols.error, chalk.red('当前有未提交的修改'));
      shelljs.exec(`npm version ${nextVersion}`, { slient: true });
      await git.add('./*');
      await git.commit(`prebuild: v${nextVersion}`);
      await git.push('origin', 'main');
      console.log(logSymbols.success, chalk.green('推送代码成功'));

      await git.tag([`v${nextVersion}`]);
      await git.push('origin', [`v${nextVersion}`]);
      console.log(logSymbols.success, chalk.green('推送tag成功'));

    } catch (err) {
      console.log(chalk.bgRed('已取消reson:', err));
    }
  },
};
