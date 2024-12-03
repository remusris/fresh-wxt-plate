// entrypoints/content.ts
export default defineContentScript({
  matches: ["<all_urls>"],
  allFrames: true,
  
  main(ctx) {
    function activityDetected(event: Event) {
      if (event.type === "mousemove") {
        grabVideoTimecode();
      }

      console.log(`activityDetected: ${event.type}`);
      
      chrome.runtime.sendMessage({ action: "userActive", value: `${event.type}` });
    }

    function grabVideoTimecode() {
      const video = document.querySelector('video');
      if (video) {
        const currentTime = video.currentTime;
        chrome.runtime.sendMessage({ 
          action: "videoTimecode", 
          value: currentTime.toFixed(2) 
        });
      } else {
        browser.runtime.sendMessage({ 
          action: "videoTimecode", 
          value: null 
        });
      }
    }

    // Add event listeners using the context to handle cleanup
    ctx.addEventListener(document, "mousemove", activityDetected);
    ctx.addEventListener(document, "keydown", activityDetected);    
    ctx.addEventListener(window, "blur", activityDetected);
    ctx.addEventListener(document, "visibilitychange", activityDetected);

    /* // Use regular DOM event listener for visibilitychange
    const visibilityHandler = (event: Event) => {
      activityDetected(event);
    };

    document.addEventListener("visibilitychange", visibilityHandler); */

    // Handle text selection and anchor tag detection
    ctx.addEventListener(document, "mouseup", () => {
      const selection = window.getSelection();
      if (!selection) return;
      
      const selectedText = selection.toString().trim();
      if (!selectedText) return;

      const range = selection.getRangeAt(0);
      let parentDiv = range.commonAncestorContainer as Node;
      
      while (parentDiv && (parentDiv as Element).nodeName?.toLowerCase() !== "div") {
        parentDiv = parentDiv.parentNode!;
      }

      if (parentDiv instanceof Element) {
        const anchorTag = parentDiv.querySelector("a");
        if (anchorTag) {
          anchorTag.style.backgroundColor = "yellow";
          console.log(`Found anchor: ${anchorTag.href}`);
        }
      }
    });

    // Clean up the visibilitychange listener when the content script is invalidated
    /* ctx.onInvalidated(() => {
      document.removeEventListener("visibilitychange", visibilityHandler);
    }); */
  }
});

/* export default defineContentScript({
  matches: ['*://*.google.com/*'],
  main() {
    console.log('Hello content.');
  },
});
 */