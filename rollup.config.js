import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

const fileEnv = '.env'
// get the env variables from the .env file relative to the current NODE_ENV
let ENV_VARS = {}
try {
	ENV_VARS = dotenv.parse(fs.readFileSync(path.resolve(__dirname, fileEnv)))
} catch (err) {
	ENV_VARS = {}
}
const valuesEnvToReplace = () => {
	return Object.entries(ENV_VARS).reduce((acc, [key, val]) => {
		acc[`process.env.${key}`] = JSON.stringify(val)
		return acc
	}, {})
}

const production = !process.env.ROLLUP_WATCH;
const api = process.env.API_URL

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		replace({
			process: JSON.stringify({
				env: {
					BB_MANAGER_TITLE: 'BB_MANAGER_TITLE' in ENV_VARS ? ENV_VARS.BB_MANAGER_TITLE : process.env.BB_MANAGER_TITLE,
					BB_MANAGER_API_URL: 'BB_MANAGER_API_URL' in ENV_VARS ? ENV_VARS.BB_MANAGER_API_URL : process.env.BB_MANAGER_API_URL,
					BB_MANAGER_DNS_EXTENSION: 'BB_MANAGER_DNS_EXTENSION' in ENV_VARS ? ENV_VARS.BB_MANAGER_DNS_EXTENSION : process.env.BB_MANAGER_DNS_EXTENSION,
					BB_MANAGER_CHART_VERSION: 'BB_MANAGER_CHART_VERSION' in ENV_VARS ? ENV_VARS.BB_MANAGER_CHART_VERSION : process.env.BB_MANAGER_CHART_VERSION,
					BB_MANAGER_AUTH_USER: 'BB_MANAGER_AUTH_USER' in ENV_VARS ? ENV_VARS.BB_MANAGER_AUTH_USER : process.env.BB_MANAGER_AUTH_USER,
					BB_MANAGER_AUTH_USER_PASSWORD: 'BB_MANAGER_AUTH_USER_PASSWORD' in ENV_VARS ? ENV_VARS.BB_MANAGER_AUTH_USER_PASSWORD : process.env.BB_MANAGER_AUTH_USER_PASSWORD,
				}
			}),
			...valuesEnvToReplace()
		}),
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
      // a separate file - better for performance
      emitCss: true,
			css: css => {
				css.write('public/build/bundle.css');
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
    commonjs(),
    postcss({
      extract: true,
      minimize: true,
      use: [
        ['sass', {
          includePaths: [
            './src/theme',
            './node_modules'
          ]
        }]
      ]
    }),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false,
		chokidar: false
	}
};

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}
