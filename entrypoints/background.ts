import { onMessage } from '@/messaging/messaging';
import { initTRPC } from '@trpc/server';
import { createChromeHandler } from 'trpc-chrome/adapter';
import { z } from 'zod';


const t = initTRPC.create({
  isServer: false,
  allowOutsideOfServer: true,
});

const appRouter = t.router({
  openNewTab: t.procedure.input(z.object({ url: z.string().url() })).mutation(async ({ input }) => {
    await chrome.tabs.create({ url: input.url, active: true });
  }),
});

export type AppRouter = typeof appRouter;

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
  createChromeHandler({
    router: appRouter,
    createContext: () => ({}),
    onError: ({
      error,
      type,
      path,
      input,
      ctx,
      errorId,
    }: {
      error: Error;
      type: "query" | "mutation";
      path: string | undefined;
      input: unknown;
      ctx: unknown;
      errorId: string;
    }) => {
      console.log("error", error);
    },
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "captureElement") {
        // Get the current active tab
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            try {
                const tab = tabs[0];
                if (!tab.id) return;

                // Capture the visible tab
                const screenshot = await chrome.tabs.captureVisibleTab(tab.windowId, {
                    format: 'png'
                });

                // Send the screenshot data back to the content script
                chrome.tabs.sendMessage(tab.id, {
                    action: "processScreenshot",
                    screenshot: screenshot,
                    rect: request.rect
                });
            } catch (error) {
                console.error('Failed to capture screenshot:', error);
            }
        });
    }
    // Return true to indicate we want to send a response asynchronously
    return true;
});



  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
});
