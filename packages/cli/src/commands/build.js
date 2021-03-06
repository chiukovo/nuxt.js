import { common } from '../options'

export default {
  name: 'build',
  description: 'Compiles the application for production deployment',
  usage: 'build <dir>',
  options: {
    ...common,
    analyze: {
      alias: 'a',
      type: 'boolean',
      description: 'Launch webpack-bundle-analyzer to optimize your bundles',
      prepare(cmd, options, argv) {
        // Analyze option
        options.build = options.build || {}
        if (argv.analyze && typeof options.build.analyze !== 'object') {
          options.build.analyze = true
        }
      }
    },
    devtools: {
      type: 'boolean',
      default: false,
      description: 'Enable Vue devtools',
      prepare(cmd, options, argv) {
        options.vue = options.vue || {}
        options.vue.config = options.vue.config || {}
        if (argv.devtools) {
          options.vue.config.devtools = true
        }
      }
    },
    generate: {
      type: 'boolean',
      default: true,
      description: 'Don\'t generate static version for SPA mode (useful for nuxt start)'
    },
    quiet: {
      alias: 'q',
      type: 'boolean',
      description: 'Disable output except for errors',
      prepare(cmd, options, argv) {
        // Silence output when using --quiet
        options.build = options.build || {}
        if (argv.quiet) {
          options.build.quiet = !!argv.quiet
        }
      }
    }
  },
  async run(cmd) {
    const config = await cmd.getNuxtConfig({ dev: false })
    const nuxt = await cmd.getNuxt(config)

    if (nuxt.options.mode !== 'spa' || cmd.argv.generate === false) {
      // Build only
      const builder = await cmd.getBuilder(nuxt)
      await builder.build()
    } else {
      // Build + Generate for static deployment
      const generator = await cmd.getGenerator(nuxt)
      await generator.generate({ build: true })
    }
  }
}
