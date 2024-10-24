// import react from '@vitejs/plugin-react-swc'
import react from '@vitejs/plugin-react'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

function emptySourcemapFix() {
    let currentInterval = null
    return {
        name: 'empty-sourcemap-fix',
        enforce: 'post',
        transform(source: string) {
            if (currentInterval) return
            currentInterval = setInterval(() => {
                const nodeModulesPath = path.join(__dirname, 'node_modules', '.vite', 'deps')
                if (!fs.existsSync(nodeModulesPath)) return
                clearInterval(currentInterval)
                currentInterval = null
                const files = fs.readdirSync(nodeModulesPath)
                files.forEach((file) => {
                    const mapFile = file + '.map'
                    const mapPath = path.join(nodeModulesPath, mapFile)
                    if (!fs.existsSync(mapPath)) return
                    const mapData = JSON.parse(fs.readFileSync(mapPath, 'utf8'))
                    if (!mapData.sources || mapData.sources.length == 0) {
                        mapData.sources = [path.relative(mapPath, path.join(nodeModulesPath, file))]
                        fs.writeFileSync(mapPath, JSON.stringify(mapData), 'utf8')
                    }
                })
            }, 100)
            return source
        },
    }
}

const ReactCompilerConfig = {
    target: '18',
}

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
            },
        }),
        tsconfigPaths(),
        emptySourcemapFix() as unknown as Plugin,
    ],
})
