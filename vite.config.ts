// import react from '@vitejs/plugin-react-swc'
import react from '@vitejs/plugin-react';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { Plugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
// @ts-expect-error wtf???? like it finds the type, but STILL complains about it
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';

function emptySourcemapFix() {
    let currentInterval = null;
    return {
        name: 'empty-sourcemap-fix',
        enforce: 'post',
        transform(source: string) {
            if (currentInterval) return;
            currentInterval = setInterval(() => {
                const nodeModulesPath = path.join(__dirname, 'node_modules', '.vite', 'deps');
                if (!fs.existsSync(nodeModulesPath)) return;
                clearInterval(currentInterval);
                currentInterval = null;
                const files = fs.readdirSync(nodeModulesPath);
                files.forEach((file) => {
                    const mapFile = file + '.map';
                    const mapPath = path.join(nodeModulesPath, mapFile);
                    if (!fs.existsSync(mapPath)) return;
                    const mapData = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
                    if (!mapData.sources || mapData.sources.length == 0) {
                        mapData.sources = [path.relative(mapPath, path.join(nodeModulesPath, file))];
                        fs.writeFileSync(mapPath, JSON.stringify(mapData), 'utf8');
                    }
                });
            }, 100);
            return source;
        },
    };
}

// https://stackoverflow.com/questions/75839993/vite-build-hangs-forever/76920975#76920975
function ClosePlugin() {
    return {
        name: 'ClosePlugin', // required, will show up in warnings and errors

        // use this to catch errors when building
        buildEnd(error: never) {
            if (error) {
                console.error('Error bundling');
                console.error(error);
                process.exit(1);
            } else {
                console.log('Build ended');
            }
        },

        // use this to catch the end of a build without errors
        closeBundle() {
            console.log('Bundle closed');
            process.exit(0);
        },
    };
}

const ReactCompilerConfig = {
    target: '19',
};

const viteConfig = defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
            },
        }),
        tsconfigPaths(),
        TanStackRouterVite({
            target: 'react',
            trailingSlash: true,
            quoteStyle: 'single',
            semicolons: true,
        }),
        emptySourcemapFix() as Plugin,
        ClosePlugin() as Plugin,
    ],
    test: {
        alias: {
            '@utils': path.resolve(__dirname, './src/utils'),
        },
    },
    build: {},
});

export default viteConfig;
