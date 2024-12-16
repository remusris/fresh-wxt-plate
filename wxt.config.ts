import { defineConfig } from 'wxt';

import { defineRunnerConfig } from 'wxt';

import commands from './modules/commands';

// modules: ['@wxt-dev/module-react', commands],


// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permission: ["activeTab", "scripting", "sidePanel", "storage", "tabs"]
  },
  runner: defineRunnerConfig({
    disabled: false,
  }),
  manifestVersion: 3

});


