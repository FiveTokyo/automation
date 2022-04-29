import yargs from 'yargs'
import { prompt } from 'enquirer'
import chalk from 'chalk'
import semver from 'semver'
import packageJson from '../../package.json'
import logSymbols from 'log-symbols';
const path = require('path')
const fs = require('fs')
const simpleGit = require('simple-git')

type PreBuildEnv = 'dev' | 'beta' | 'release'
type ReleaseType = 'prerelease' | 'prepatch' | 'preminor' | 'major'

interface EnvVersion {
    env: PreBuildEnv
    releaseType: ReleaseType
}

export const preBuild: yargs.CommandModule = {
    command: ['pre:build'],
    describe: '预打包',
    handler: async () => {
        try {
            const curVersion = packageJson.version
            const packagePath = path.join(__dirname, '.', '../../package.json')
            const { env, releaseType } = await prompt<EnvVersion>([
                {
                    type: 'select',
                    name: 'env',
                    message: '请选择打包环境',
                    choices: [
                        {
                            name: 'dev',
                            message: '开发版'
                        },
                        {
                            name: 'beta',
                            message: '测试版'
                        },
                        {
                            name: 'release',
                            message: '正式版'
                        }
                    ]
                },
                {
                    type: 'select',
                    name: 'releaseType',
                    message: '请选择打包版本',
                    choices: [
                        {
                            name: 'prerelease',
                            message: '补丁版本'
                        },
                        {
                            name: 'prepatch',
                            message: '小版本'
                        },
                        {
                            name: 'preminor',
                            message: '中版本'
                        },
                        {
                            name: 'major',
                            message: '大版本'
                        }
                    ]
                }
            ])

            const nextVersion = semver.inc(curVersion, releaseType, env)
            const { confirm } = await prompt<{ confirm?: boolean }>({
                type: 'confirm',
                name: 'confirm',
                message: `当前版本: v${curVersion}, 请确定打包版本: v${nextVersion}`
            })
            if(!confirm) return console.log(chalk.red('取消打包'))
            if(!semver.valid(nextVersion)) return console.log(logSymbols.error,chalk.red('版本号格式错误'))
            packageJson.version = nextVersion as string
            let packageJSON = JSON.stringify(packageJson, null, 4)
            fs.writeFile(packagePath, packageJSON, 'utf8', (err: { message: string }) => {
                if (err) {
                    throw new Error(err.message)
                }
            })
            const git = simpleGit();
            await git.add('./*')
            await git.commit(`prebuild: v${nextVersion}`)
            await git.tag(`v${nextVersion}`, `prebuild: v${nextVersion}`)
            await git.push('origin', env, {
                setUpstream: true
            })
            await git.push('origin', nextVersion, {
                setUpstream: true
            })
            console.log(confirm)
            console.log(nextVersion)
        } catch (err) {
            console.log(chalk.bgRed('已取消reson:', err))
        }
    }
}
