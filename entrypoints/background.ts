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
  


  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true})
});
