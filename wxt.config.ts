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





// See https://wxt.dev/api/config.html
/* export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ["activeTab", "scripting", "sidePanel", "storage", "tabs", "history", "unlimitedStorage", "commands"],
    description: "A browser extension that allows you to view and interact with your browser history in a side panel.",
    commands: {
      "_execute_action": {
        suggested_key: {
          default: "Alt+Q",
          mac: "Alt+Q",
          windows: "Alt+Q",
          linux: "Alt+Q"
        },
        description: "Open the side panel."
      },
      "random-command": {
        suggested_key: {
          default: "Ctrl+Shift+Y",
          mac: "Command+Shift+Y",
          windows: "Ctrl+Shift+Y",
          linux: "Ctrl+Shift+Y"
        },
        description: "Open the side panel."
      }
    },
    action: {
      default_title: "Open Side Panel",
    },
  },
  runner: defineRunnerConfig({
    disabled: true
  }),
  manifestVersion: 3
});
 */