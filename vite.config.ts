// import react from '@vitejs/plugin-react-swc'
// @ts-expect-error wtf???? like it finds the type, but STILL complains about it
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { HttpProxy, loadEnv, UserConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import { z } from 'zod';

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

// Uncomment to enable logging for proxy. Use for debugging purposes only.
// const configureProxy = (proxy: HttpProxy.Server) => {
//     proxy.on('error', (err, _req, _res) => {
//         console.log('proxy error', err);
//     });
//     proxy.on('proxyReq', (proxyReq, req, _res) => {
//         console.log('Sending Request to the Target:', req.method, req.url);
//     });
//     proxy.on('proxyRes', (proxyRes, req, _res) => {
//         console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
//     });
// };

const viteConfig = defineConfig(({ mode }) => {
    const processEnv = loadEnv(mode, process.cwd());

    /**
     * ENV SETUP
     */

    const VITE_CONFIG_SCHEMA = z.object({
        VITE_BACKEND_URL: z.string(),
        VITE_CDN_URL: z.string(),
        VITE_HOST: z.string(),
        VITE_PORT: z.coerce.number(),
    });
    console.log(processEnv);

    const env = VITE_CONFIG_SCHEMA.parse(processEnv);

    return {
        plugins: [
            tsconfigPaths(),
            TanStackRouterVite({
                target: 'react',
                trailingSlash: true,
                quoteStyle: 'single',
                semicolons: true,
                autoCodeSplitting: true,
            }),
            react({
                babel: {
                    plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
                },
            }),
            emptySourcemapFix(),
            ClosePlugin(),
        ],
        test: {
            alias: {
                '@utils': path.resolve(__dirname, './src/utils'),
            },
        },
        build: {},
        server: {
            host: env.VITE_HOST,
            port: env.VITE_PORT,
            proxy: {
                '/api': {
                    target: env.VITE_BACKEND_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                    // configure: configureProxy,
                },
                '/socket.io/': {
                    target: env.VITE_BACKEND_URL,
                    changeOrigin: true,
                    rewriteWsOrigin: true,
                    ws: true,
                    // configure: configureProxy,
                },
                '/cdn': {
                    target: env.VITE_CDN_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/cdn/, ''),
                    // configure: configureProxy,
                },
            },
        },
    };
});

export default viteConfig;
