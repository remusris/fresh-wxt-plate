import "./style.css";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "wxt-react-example",
      position: "inline",
      anchor: "body",
      append: "first",
      onMount: (container) => {
        // Don't mount react app directly on <body>
        const wrapper = document.createElement("div");
        container.append(wrapper);

        const root = ReactDOM.createRoot(wrapper);
        root.render(<App />);
        return { root, wrapper };
      },
      onRemove: (elements) => {
        elements?.root.unmount();
        elements?.wrapper.remove();
      },
    });

    ui.mount();
  },
});






// // entrypoints/example-ui.content/index.tsx
// import ReactDOM from 'react-dom/client';
// import App from './App';

// export default defineContentScript({
//   matches: ['<all_urls>'],

//   main(ctx) {
//     const ui = createIntegratedUi(ctx, {
//       position: 'inline',
//       anchor: 'body',
//       onMount: (container) => {
//         // Create a root on the UI container and render a component
//         const root = ReactDOM.createRoot(container);
//         root.render(<App />);
//         return root;
//       },
//       onRemove: (root) => {
//         // Unmount the root when the UI is removed
//         root?.unmount();
//       },
//     });

//     // Call mount to add the UI to the DOM
//     ui.mount();
//   },
// });