import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import './style.css';
import { sendMessage } from '@/messaging/messaging';
import { PlateEditor } from '@/components/editor/plate-editor';

function App() {
  const [count, setCount] = useState(0);

  async function handleSendMessage() {
    const length = await sendMessage('getStringLength', 'Hello, world!')
    console.log("length", length)
  }

  return (
    <div className="h-full w-full" data-registry="plate">
      <PlateEditor />

      {/* <button onClick={handleSendMessage}>Send Message</button> */}
    </div>
  );
}

export default App;
