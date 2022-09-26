import { serve } from 'esbuild'
import NodeModulesPolyfills from '@esbuild-plugins/node-modules-polyfill'

const config = {
  bundle: true,
  entryPoints: ['./index.jsx'],
  entryNames: 'app',
  format: 'iife',
  inject: ['./react-shim.mjs'],
  outdir: 'www',
  plugins: [
    NodeModulesPolyfills.default(),
  ],
}

serve({ servedir: './www' }, config)
  .then(server => { console.log(`View the app at: http://localhost:${server.port}`) })
  .catch(err => {
    console.log(err)
    process.exit(1)
  })
