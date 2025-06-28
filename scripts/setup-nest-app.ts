// scripts/setup-nest-app.ts
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const appName: string = process.argv[2];

if (!appName) {
    console.error('❌ Please provide the app name: node scripts/setup-nest-app.ts <app-name>');
    process.exit(1);
}

const rootDir = path.resolve('apps', appName);
if (!fs.existsSync(rootDir)) {
    console.error(`❌ Directory ${rootDir} does not exist. Make sure you created the Nest app first.`);
    process.exit(1);
}

console.log(`🔧 Setting up NestJS app '${appName}'...`);

const filesToRemove: string[] = [
    '.prettierrc',
    '.gitignore',
    'README.md',
    'package-lock.json'
];

for (const filename of filesToRemove) {
    const filePath = path.join(rootDir, filename);
    if (fs.existsSync(filePath)) {
        fs.rmSync(filePath);
        console.log(`🧹 Removed ${filename}`);
    }
}

const testFolder = path.join(rootDir, 'test');
if (fs.existsSync(testFolder) && fs.readdirSync(testFolder).length === 0) {
    fs.rmSync(testFolder, { recursive: true });
    console.log(`🧼 Removed empty folder: test`);
}

// ✨ Liste personnalisable des dépendances à installer
const dependencies: string[] = [
    '@nestjs/config',
    '@nestjs/typeorm',
    'class-validator',
    'class-transformer',
    'reflect-metadata',
    'rxjs',
    'typeorm',
    'pg',
    "zod"
];

if (dependencies.length > 0) {
    console.log(`📦 Installing dependencies: ${dependencies.join(', ')}`);
    try {
        execSync(`pnpm add ${dependencies.join(' ')}`, {
            cwd: rootDir,
            stdio: 'inherit'
        });
        console.log(`✅ Dependencies installed successfully.`);
    } catch (err) {
        console.error('❌ Failed to install dependencies:', err);
        process.exit(1);
    }
} else {
    console.log('ℹ️ No dependencies specified to install.');
}

console.log(`🚀 '${appName}' is ready!`);