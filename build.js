import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import copy from 'rollup-plugin-copy';

const copyConfig = {
    targets: [
        { src: 'index.html', dest: 'build' },
        { src: 'a.out.wasm', dest: 'build' },
        { src: 'a.out.js', dest: 'build'},
        { src: 'worker.js', dest: 'build' }
    ]
};

const config = {
    input: ['components.js'],
    output: {
        dir: 'build/',
        format: 'es'
    },
    plugins: [
        minifyHTML(),
        copy(copyConfig),
        resolve()
    ],
    preserveEntrySignatures: false
};

if (process.env.NODE_ENV !== 'development') {
    config.plugins.push(terser());
}

export default config;