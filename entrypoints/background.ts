import { onMessage } from '@/messaging/messaging';

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  onMessage('getStringLength', (messageInput) => {
    console.log('Received message:', messageInput);
    const { id, data, type, timestamp, sender } = messageInput
    return data.length

  });


  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true})
});
