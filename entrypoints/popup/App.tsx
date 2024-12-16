import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import './style.css';
import { sendMessage } from '@/messaging/messaging';
import { PlateEditor } from '@/components/editor/plate-editor';

import { createTRPCProxyClient } from '@trpc/client';
import { chromeLink } from 'trpc-chrome/link';

// import type { AppRouter } from './background';

import type { AppRouter } from '@/entrypoints/background';

const port = chrome.runtime.connect();
const trpc = createTRPCProxyClient<AppRouter>({
  links: [chromeLink({ port })],
});

function App() {
  const [count, setCount] = useState(0);

  async function handleSendMessage() {
    const length = await sendMessage('getStringLength', 'Hello, world!')
    console.log("length", length)
  }

  async function handleOpenNewTab() {
    console.log("opening new tab")

    await trpc.openNewTab.mutate({ url: 'https://www.google.com' })
  }

  return (
    <div className="h-[500px] w-[500px]" data-registry="plate">
      {/* <PlateEditor /> */}

      <button onClick={handleOpenNewTab}>Open New Tab</button>

      {/* <button onClick={handleSendMessage}>Send Message</button> */}
    </div>
  );
}

export default App;
