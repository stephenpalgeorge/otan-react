const fs = require('fs')
const chalk = require('chalk')

const addScripts = () => {
    const rootDir = process.cwd()
    if (fs.existsSync(`${rootDir}/package.json`)) {
        const pkg = require(`${rootDir}/package.json`)
        pkg.scripts["test"] = "testing"
        pkg.scripts["example"] = "another script"
        const package = JSON.stringify(pkg)
    }
    else {
        console.warn(
            chalk.yellow('we couldn\'t find a package.json file...')
        )
    }
}

addScripts()