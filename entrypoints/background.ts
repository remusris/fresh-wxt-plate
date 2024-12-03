export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true})
});
