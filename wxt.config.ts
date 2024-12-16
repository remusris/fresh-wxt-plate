import { defineConfig } from 'wxt';

import { defineRunnerConfig } from 'wxt';

import commands from './modules/commands';

// modules: ['@wxt-dev/module-react', commands],


// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  manifest: () => ({
    permissions: ["activeTab", "scripting", "sidePanel", "storage", "tabs", "commands"],
    commands: {
      "_execute_action": {
        suggested_key: {
          default: "Ctrl+Shift+U",
          mac: "Command+Shift+U",
          windows: "Ctrl+Shift+U",
          linux: "Ctrl+Shift+U"
        },
        description: "Run \"foo\" on the current page."
      },
      "test-command": {
        suggested_key: {
          default: "Ctrl+Shift+Y",
          mac: "Command+Shift+Y",
          windows: "Ctrl+Shift+Y",
          linux: "Ctrl+Shift+Y"
        },
        description: "Test command"
      }
    },
    action: {}
  }),
  runner: defineRunnerConfig({
    disabled: false,
  }),
  manifestVersion: 3

});


