// This script prepares a new version of j3-drydock for release according to the procedure: https://dev.azure.com/jibe-erp/JiBe/_wiki/wikis/JiBe2Web.wiki/742/Development-Process.
// Use the command "npm run bump-version -- [version] [--api] [--frontend]" to run the script.
import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';

const rootPath = process.cwd();
const toolsPath = path.join(rootPath, 'tools');
const frontendPath = path.join(rootPath, 'frontend');

function checkIfScriptInRoot(): void {
    if (!fs.existsSync(toolsPath)) {
        console.error('-- Please run the script from the root folder of the project.');
        process.exit(1);
    }
}

function checkoutAndPullLatestDevBranch(): void {
    try {
        console.log('-- Checking out and pulling latest dev branch of j3-drydock...');
        child_process.execSync('git checkout dev');
        child_process.execSync('git pull origin dev');
    } catch (error) {
        console.error(`-- Error checking out and pulling latest dev branch: ${error}`);
        process.exit(1);
    }
}

function createBumpBranch(newVersion: string, flags: { api: boolean; frontend: boolean }) {
    const prefixes = [];
    if (flags.api) prefixes.push('api');
    if (flags.frontend) prefixes.push('frontend');

    const branchName = `bump-${prefixes.join('-')}-${newVersion}`;

    try {
        child_process.execSync(`git checkout -b ${branchName}`);
        child_process.execSync(`git push --set-upstream origin ${branchName}`);
    } catch (error) {
        console.error(`-- Error creating a new branch: ${error}`);
        process.exit(1);
    }

    return branchName;
}

function updateVersion(packagePath: string, newVersion: string): void {
    const folderJsonPath = path.join(rootPath, packagePath);
    const packageJsonPath = path.join(folderJsonPath, 'package.json');

    try {
        console.log(`-- Updating version in ${packageJsonPath}...`);
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
        const updatedContent = packageJsonContent.replace(/"version":\s*"[^"]*"/, `"version": "${newVersion}"`);

        fs.writeFileSync(packageJsonPath, updatedContent);
    } catch (error) {
        console.error(`-- Error updating version in ${packageJsonPath}: ${error}`);
        process.exit(1);
    }

    try {
        console.log(`-- Staging updated ${packageJsonPath}...`);
        child_process.execSync(`git add ${packageJsonPath}`, { cwd: folderJsonPath });
    } catch (error) {
        console.error(`-- Error staging changes: ${error}`);
        process.exit(1);
    }
}

function stageCommitPush(message: string, cwd: string): void {
    try {
        child_process.execSync(`git commit -m "${message}"`, { cwd });
        child_process.execSync(`git push`, { cwd });
    } catch (error) {
        console.error(`-- Error committing or pushing changes: ${error}`);
        process.exit(1);
    }
}

function prepareApi(newVersion: string): void {
    updateVersion('api', newVersion);
    updateVersion('', newVersion);
}

function prepareFrontend(newVersion: string) {
    try {
        console.log('-- Checking out and pulling latest dev branch of JiBe2Web...');
        child_process.execSync('git checkout dev', { cwd: '../JiBe2Web' });
        child_process.execSync('git pull origin dev', { cwd: '../JiBe2Web' });
        const branchName = `bump-j3-drydock-ng-${newVersion}`;
        try {
            console.log('-- Creating a new branch for JiBe2Web...');
            child_process.execSync(`git checkout -b "${branchName}"`, { cwd: '../JiBe2Web' });
            child_process.execSync(`git push --set-upstream origin ${branchName}`, { cwd: '../JiBe2Web' });
        } catch (error) {
            console.error(`-- Error creating a new branch: ${error}`);
            process.exit(1);
        }

        updateVersion('frontend/projects/j3-drydock', newVersion);
        updateVersion('frontend', newVersion);

        console.log('-- Building j3-drydock-ng...');
        child_process.execSync('npm run build', { cwd: frontendPath });
        console.log('-- Publishing j3-drydock-ng...');
        child_process.execSync('npm publish', { cwd: path.join(frontendPath, 'dist/j3-drydock') });

        const jibe2WebPackageJsonPath = path.join('../JiBe2Web', 'package.json');
        console.log(`-- Updating version in ${jibe2WebPackageJsonPath}...`);
        const jibe2WebPackageJsonContent = fs.readFileSync(jibe2WebPackageJsonPath, 'utf-8');
        const updatedJibe2WebContent = jibe2WebPackageJsonContent.replace(
            /"j3-drydock-ng":\s*"[^"]*"/,
            `"j3-drydock-ng": "${newVersion}"`,
        );
        fs.writeFileSync(jibe2WebPackageJsonPath, updatedJibe2WebContent);

        updateVersion('../JiBe2Web', newVersion);

        stageCommitPush(`Bump version and j3-drydock-ng to ${newVersion}`, '../JiBe2Web');

        console.log(
            `\n\n-- JiBe2Web updated. Create a pull request here: https://dev.azure.com/jibe-erp/JiBe/_git/JiBe2Web/pullrequestcreate?sourceRef=${branchName}&targetRef=dev and link it with work item "658790"`,
        );
    } catch (error) {
        console.error(`-- Error preparing frontend: ${error}`);
        process.exit(1);
    }
}

function main(): void {
    checkIfScriptInRoot();
    const newVersion = process.argv[2];
    const flags = {
        api: process.argv.includes('--api'),
        frontend: process.argv.includes('--frontend'),
    };

    if (!newVersion) {
        console.error('-- Please provide a version number as an argument.');
        process.exit(1);
    }

    if (!flags.api && !flags.frontend) {
        console.error('-- Please provide at least one of the --api or --frontend flags.');
        process.exit(1);
    }

    checkoutAndPullLatestDevBranch();
    const dryDockNewBranchName = createBumpBranch(newVersion, flags);

    if (flags.api) {
        prepareApi(newVersion);
    }

    if (flags.frontend) {
        prepareFrontend(newVersion);
    }

    const prefixes = [];
    if (flags.api) prefixes.push('"api"');
    if (flags.frontend) prefixes.push('"frontend"');

    stageCommitPush(`Bump ${prefixes.join(', ')} version to ${newVersion}`, '.');
    console.log(
        `\n\n-- j3-drydock updated. Create a pull request here: https://dev.azure.com/jibe-erp/JiBe/_git/j3-drydock/pullrequestcreate?sourceRef=${dryDockNewBranchName}&targetRef=dev and link it with work item "658790"\n\n`,
    );
}

main();
