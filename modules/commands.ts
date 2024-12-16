// modules/commands.ts
import { defineWxtModule } from 'wxt/modules';

export default defineWxtModule({
  setup(wxt) {
    // Hook into the manifest generation process
    wxt.hook('build:manifestGenerated', (_, manifest) => {
      // Only modify commands in production build
      if (wxt.config.mode === 'production') {
        // Ensure we have a commands object
        manifest.commands = manifest.commands || {};
        
        // Set your custom command
        manifest.commands._execute_action = {
          suggested_key: {
            default: "Ctrl+Shift+U",
            mac: "Command+Shift+U",
            windows: "Ctrl+Shift+U",
            linux: "Ctrl+Shift+U"
          },
          description: 'Run "foo" on the current page.'
        };
        
        // Remove the WXT development command if it exists
        delete manifest.commands['wxt:reload-extension'];
      } else {
        // In development, we'll keep both but modify the reload command
        manifest.commands = manifest.commands || {};
        
        // Set your custom command
        manifest.commands._execute_action = {
          suggested_key: {
            default: "Ctrl+Shift+U",
            mac: "Command+Shift+U",
            windows: "Ctrl+Shift+U",
            linux: "Ctrl+Shift+U"
          },
          description: 'Run "foo" on the current page.'
        };
        
        // Modify the WXT reload command to use a different shortcut if needed
        if (manifest.commands['wxt:reload-extension']) {
          manifest.commands['wxt:reload-extension'].suggested_key = {
            default: "Alt+R"
          };
        }
      }
    });
  }
});