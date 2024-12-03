import { defineConfig } from 'wxt';

import { defineRunnerConfig } from 'wxt';


// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permission: ["activeTab", "scripting", "sidePanel", "storage", "tabs"]
  },
  runner: defineRunnerConfig({
    disabled: true
  })

});


