import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import './style.css';

import { PlateEditor } from '@/components/editor/plate-editor';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="h-full w-full" data-registry="plate">
      <PlateEditor />
    </div>
  );
}

export default App;
