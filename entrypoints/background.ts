import { onMessage } from '@/messaging/messaging';

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  onMessage('getStringLength', (messageInput) => {
    console.log('Received message:', messageInput);
    const { id, data, type, timestamp, sender } = messageInput
    return data.length

  });

  chrome.commands.onCommand.addListener((command) => {
    console.log('Command executed:', command);

    /* if (command === "_execute_action") {
      console.log('Command executed:', command);
    } */
  });


  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true})
});
