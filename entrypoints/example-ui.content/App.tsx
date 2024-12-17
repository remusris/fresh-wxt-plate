import './style.css';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

function App() {
    return (
        <div>
            {/* <button className="fixed bottom-5 right-5 rounded-md px-4 py-2 bg-blue-500 text-white hover:bg-blue-600">
                Click me
            </button> */}

            <Dialog>
                <DialogTrigger asChild>
                    <button className="fixed bottom-5 right-5 rounded-md px-4 py-2 bg-blue-500 text-white hover:bg-blue-600">
                        Click me
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

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