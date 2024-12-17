import './style.css';

function App() {
  return (
    <div>
      <button className="fixed bottom-5 right-5 rounded-md px-4 py-2 bg-blue-500 text-white hover:bg-blue-600">
        Click me
      </button>
    </div>
  );
}

export default App;


/* import { useState } from "react";

export default () => {
  const [count, setCount] = useState(1);
  const increment = () => setCount((count) => count + 1);

  return (
    <div>
      <p>This is React. {count}</p>
      <button onClick={increment} className="bg-blue-500 text-white px-4 py-2 rounded-md">Increment</button>
    </div>
  );
}; */