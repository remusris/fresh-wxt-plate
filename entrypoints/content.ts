

// content-script.ts
import './styles.css';

import html2canvas from 'html2canvas';

/* export default defineContentScript({
    matches: ['<all_urls>'],
    cssInjectionMode: 'ui',

    async main(ctx) {
        let isActive = false;
        let currentOverlay: HTMLElement | null = null;

        // Inject overlay styles directly into the document
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
        .hover-overlay {
          position: absolute;
          border: 2px solid #4CAF50;
          background-color: rgba(76, 175, 80, 0.1);
          pointer-events: none;
          z-index: 9999;
          transition: all 0.2s ease;
        }
      `;
        document.head.appendChild(styleSheet);

        // Create and mount the button using Shadow DOM
        const ui = await createShadowRootUi(ctx, {
            name: 'hover-overlay-ui',
            position: 'inline',
            anchor: 'body',
            onMount(container) {
                const button = document.createElement('button');
                button.textContent = 'Toggle Hover Overlay';
                button.className = 'overlay-button';

                button.addEventListener('click', () => {
                    isActive = !isActive;
                    button.style.backgroundColor = isActive ? '#f44336' : '#4CAF50';
                    if (!isActive && currentOverlay) {
                        currentOverlay.remove();
                        currentOverlay = null;
                    }
                });

                container.appendChild(button);
            },
        });

        // Mount the UI
        ui.mount();



        const shouldShowOverlay = (element: HTMLElement): boolean => {
            // Return true for all elements except the overlay itself
            return !element.classList.contains('hover-overlay');
        };

        // Add mouseover event listener to the document
        ctx.addEventListener(document, 'mouseover', (event) => {
            if (!isActive) return;

            const target = event.target as HTMLElement;
            if (shouldShowOverlay(target)) {
                // Remove existing overlay
                if (currentOverlay) {
                    currentOverlay.remove();
                }

                // Create new overlay
                const rect = target.getBoundingClientRect();
                currentOverlay = document.createElement('div');
                currentOverlay.className = 'hover-overlay';

                // Position the overlay
                currentOverlay.style.top = `${rect.top + window.scrollY}px`;
                currentOverlay.style.left = `${rect.left + window.scrollX}px`;
                currentOverlay.style.width = `${rect.width}px`;
                currentOverlay.style.height = `${rect.height}px`;

                document.body.appendChild(currentOverlay);
            }
        });

        // Remove overlay when mouse leaves the element
        ctx.addEventListener(document, 'mouseout', (event) => {
            if (!isActive) return;

            const target = event.target as HTMLElement;
            if (shouldShowOverlay(target) && currentOverlay) {
                currentOverlay.remove();
                currentOverlay = null;
            }
        });

        // Handle scroll events to update overlay position
        ctx.addEventListener(window, 'scroll', () => {
            if (!isActive || !currentOverlay) return;

            const hoveredElement = document.elementFromPoint(
                parseInt(currentOverlay.style.left),
                parseInt(currentOverlay.style.top)
            ) as HTMLElement;

            if (hoveredElement && shouldShowOverlay(hoveredElement)) {
                const rect = hoveredElement.getBoundingClientRect();
                currentOverlay.style.top = `${rect.top + window.scrollY}px`;
                currentOverlay.style.left = `${rect.left + window.scrollX}px`;
            }
        }, { passive: true });
    },
}); */

// Helper function to check if element should have overlay
/* const shouldShowOverlay = (element: HTMLElement): boolean => {
  const tagName = element.tagName.toLowerCase();
  return tagName === 'div' || tagName === 'p';
}; */

/* const shouldShowOverlay = (element: HTMLElement): boolean => {
  const tagName = element.tagName.toLowerCase();
  return ['div', 'p', 'figure', 'table', 'blockquote'].includes(tagName);
}; */

// this code below mostly works
/* export default defineContentScript({
    matches: ['<all_urls>'],
    cssInjectionMode: 'ui',
  
    async main(ctx) {
      let isActive = false;
      let currentOverlay: HTMLElement | null = null;
      const stickyOverlays: Set<HTMLElement> = new Set();
      let toggleButton: HTMLButtonElement;
  
      // Inject overlay styles directly into the document
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        .hover-overlay {
          position: absolute;
          border: 2px solid #4CAF50;
          background-color: rgba(76, 175, 80, 0.1);
          z-index: 9999;
          transition: all 0.2s ease;
          pointer-events: none;
        }
        .sticky-overlay {
          border: 2px solid #2196F3;
          background-color: rgba(33, 150, 243, 0.1);
          pointer-events: auto;
          cursor: pointer;
        }
      `;
      document.head.appendChild(styleSheet);

      // Function to deactivate all overlays
      const deactivateOverlays = () => {
        isActive = false;
        if (toggleButton) {
          toggleButton.style.backgroundColor = '#4CAF50';
        }
        if (currentOverlay) {
          currentOverlay.remove();
          currentOverlay = null;
        }
        stickyOverlays.forEach(overlay => overlay.remove());
        stickyOverlays.clear();
      };
  
      // Create and mount the button using Shadow DOM
      const ui = await createShadowRootUi(ctx, {
        name: 'hover-overlay-ui',
        position: 'inline',
        anchor: 'body',
        onMount(container) {
          toggleButton = document.createElement('button');
          toggleButton.textContent = 'Toggle Hover Overlay';
          toggleButton.className = 'overlay-button';
          
          toggleButton.addEventListener('click', () => {
            isActive = !isActive;
            toggleButton.style.backgroundColor = isActive ? '#f44336' : '#4CAF50';
            if (!isActive) {
              deactivateOverlays();
            }
          });
  
          container.appendChild(toggleButton);
        },
      });
  
      // Mount the UI
      ui.mount();

      // Add escape key handler
      ctx.addEventListener(document, 'keydown', (event) => {
        if (event.key === 'Escape') {
          deactivateOverlays();
        }
      });
  
      const shouldShowOverlay = (element: HTMLElement): boolean => {
        // Return true for all elements except overlays
        return !element.classList.contains('hover-overlay') && 
               !element.classList.contains('sticky-overlay');
      };
  
      // Function to create an overlay for a target element
      const createOverlay = (target: HTMLElement, isSticky: boolean = false): HTMLElement => {
        const rect = target.getBoundingClientRect();
        const overlay = document.createElement('div');
        overlay.className = `hover-overlay${isSticky ? ' sticky-overlay' : ''}`;
        
        // Position the overlay
        overlay.style.top = `${rect.top + window.scrollY}px`;
        overlay.style.left = `${rect.left + window.scrollX}px`;
        overlay.style.width = `${rect.width}px`;
        overlay.style.height = `${rect.height}px`;

        // Store reference to target element for sticky overlays
        if (isSticky) {
          (overlay as any)._targetElement = target;
        }
  
        // Add click handler for making overlay sticky
        if (!isSticky) {
          target.addEventListener('click', (e) => {
            // Only create sticky overlay if the feature is active
            if (!isActive) return;

            console.log(getElementText(target));
            
            e.stopPropagation();
            // Create a new sticky overlay
            const stickyOverlay = createOverlay(target, true);
            document.body.appendChild(stickyOverlay);
            stickyOverlays.add(stickyOverlay);
          });
        } else {
          overlay.addEventListener('click', (e) => {
            e.stopPropagation();
            // Remove sticky overlay when clicked
            overlay.remove();
            stickyOverlays.delete(overlay);

            console.log(getElementText(target));
          });
        }
  
        return overlay;
      };
  
      // Add mouseover event listener to the document
      ctx.addEventListener(document, 'mouseover', (event) => {
        if (!isActive) return;
  
        const target = event.target as HTMLElement;
        if (shouldShowOverlay(target)) {
          // Remove existing hover overlay
          if (currentOverlay) {
            currentOverlay.remove();
          }
  
          // Create new hover overlay
          currentOverlay = createOverlay(target);
          document.body.appendChild(currentOverlay);
        }
      });
  
      // Remove hover overlay when mouse leaves the element
      ctx.addEventListener(document, 'mouseout', (event) => {
        if (!isActive) return;
  
        const target = event.target as HTMLElement;
        if (shouldShowOverlay(target) && currentOverlay) {
          currentOverlay.remove();
          currentOverlay = null;
        }
      });

      const getElementText = (element: HTMLElement): string => {
        const text = element.textContent || '';
        return text.trim().replace(/\s+/g, ' ');
      };
  
      // Handle scroll events to update overlay positions
      ctx.addEventListener(window, 'scroll', () => {
        if (!isActive && stickyOverlays.size === 0) return;
  
        // Update position of hover overlay
        if (currentOverlay) {
          const hoveredElement = document.elementFromPoint(
            parseInt(currentOverlay.style.left),
            parseInt(currentOverlay.style.top)
          ) as HTMLElement;
  
          if (hoveredElement && shouldShowOverlay(hoveredElement)) {
            const rect = hoveredElement.getBoundingClientRect();
            currentOverlay.style.top = `${rect.top + window.scrollY}px`;
            currentOverlay.style.left = `${rect.left + window.scrollX}px`;
          }
        }
  
        // Update positions of sticky overlays
        stickyOverlays.forEach(overlay => {
          const targetElement = (overlay as any)._targetElement;
          if (targetElement) {
            const newRect = targetElement.getBoundingClientRect();
            overlay.style.top = `${newRect.top + window.scrollY}px`;
            overlay.style.left = `${newRect.left + window.scrollX}px`;
            overlay.style.width = `${newRect.width}px`;
            overlay.style.height = `${newRect.height}px`;

            console.log(getElementText(targetElement));
          }
        });
      }, { passive: true });
    },
  }); */

// this works via screenshot button
export default defineContentScript({
    matches: ['<all_urls>'],
    cssInjectionMode: 'ui',

    async main(ctx) {
        let isActive = false;
        let currentOverlay: HTMLElement | null = null;
        const stickyOverlays: Set<HTMLElement> = new Set();
        let toggleButton: HTMLButtonElement;

        // Inject overlay styles directly into the document
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
        .hover-overlay {
          position: absolute;
          border: 2px solid #4CAF50;
          background-color: rgba(76, 175, 80, 0.1);
          z-index: 9999;
          transition: all 0.2s ease;
          pointer-events: none;
        }
  
        .sticky-overlay {
          border: 2px solid #2196F3;
          background-color: rgba(33, 150, 243, 0.1);
          pointer-events: auto;
          cursor: pointer;
        }
  
        .screenshot-button {
          position: absolute;
          top: -25px;
          right: 0;
          padding: 2px 8px;
          background: #2196F3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          pointer-events: auto;
          z-index: 10000;
        }
  
        .tools-container {
          position: absolute;
          top: -25px;
          right: 0;
          display: flex;
          gap: 4px;
          z-index: 10000;
        }
  
        .remove-button {
          padding: 2px 8px;
          background: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          pointer-events: auto;
        }

          .resize-handle {
        position: absolute;
        width: 8px;
        height: 8px;
        background-color: #2196F3;
        border: 1px solid white;
        border-radius: 50%;
    }

    .resize-handle.top-left { 
        top: -4px; 
        left: -4px; 
        cursor: nw-resize;
    }
    .resize-handle.top-right { 
        top: -4px; 
        right: -4px; 
        cursor: ne-resize;
    }
    .resize-handle.bottom-left { 
        bottom: -4px; 
        left: -4px; 
        cursor: sw-resize;
    }
    .resize-handle.bottom-right { 
        bottom: -4px; 
        right: -4px; 
        cursor: se-resize;
    }
    .resize-handle.top { 
        top: -4px; 
        left: 50%;
        transform: translateX(-50%);
        cursor: n-resize;
    }
    .resize-handle.right { 
        top: 50%;
        right: -4px;
        transform: translateY(-50%);
        cursor: e-resize;
    }
    .resize-handle.bottom { 
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%);
        cursor: s-resize;
    }
    .resize-handle.left { 
        top: 50%;
        left: -4px;
        transform: translateY(-50%);
        cursor: w-resize;
    }

    .sticky-overlay {
        border: 2px solid #2196F3;
        background-color: rgba(33, 150, 243, 0.1);
        pointer-events: auto;
        cursor: move;
    }

    .disable-interactions {
        user-select: none !important;
        -webkit-user-select: none !important;
        pointer-events: none !important;
    }

    .overlay-resizing {
        user-select: none !important;
        -webkit-user-select: none !important;
    }
      `;
        document.head.appendChild(styleSheet);

        const addResizeHandles = (overlay: HTMLElement) => {
            const positions = [
                'top-left', 'top-right', 'bottom-left', 'bottom-right',
                'top', 'right', 'bottom', 'left'
            ];
        
            positions.forEach(pos => {
                const handle = document.createElement('div');
                handle.className = `resize-handle ${pos}`;
                
                handle.addEventListener('mousedown', (mouseDownEvent) => {
                    mouseDownEvent.stopPropagation();
                    mouseDownEvent.preventDefault();
                    
                    // Temporarily disable selection functionality
                    const previousActiveState = isActive;
                    isActive = false;
                    
                    // Add classes to prevent text selection
                    document.body.classList.add('disable-interactions');
                    overlay.classList.add('overlay-resizing');
                    
                    const startX = mouseDownEvent.clientX;
                    const startY = mouseDownEvent.clientY;
                    const startRect = overlay.getBoundingClientRect();
                    
                    const onMouseMove = (mouseMoveEvent: MouseEvent) => {
                        mouseMoveEvent.preventDefault();
                        mouseMoveEvent.stopPropagation();
                        
                        // Request animation frame for smooth updates
                        requestAnimationFrame(() => {
                            const deltaX = mouseMoveEvent.clientX - startX;
                            const deltaY = mouseMoveEvent.clientY - startY;
                            
                            let newLeft = startRect.left;
                            let newTop = startRect.top;
                            let newWidth = startRect.width;
                            let newHeight = startRect.height;
                
                            switch(pos) {
                                case 'top-left':
                                    newLeft += deltaX;
                                    newTop += deltaY;
                                    newWidth -= deltaX;
                                    newHeight -= deltaY;
                                    break;
                                case 'top-right':
                                    newTop += deltaY;
                                    newWidth += deltaX;
                                    newHeight -= deltaY;
                                    break;
                                case 'bottom-left':
                                    newLeft += deltaX;
                                    newWidth -= deltaX;
                                    newHeight += deltaY;
                                    break;
                                case 'bottom-right':
                                    newWidth += deltaX;
                                    newHeight += deltaY;
                                    break;
                                case 'top':
                                    newTop += deltaY;
                                    newHeight -= deltaY;
                                    break;
                                case 'right':
                                    newWidth += deltaX;
                                    break;
                                case 'bottom':
                                    newHeight += deltaY;
                                    break;
                                case 'left':
                                    newLeft += deltaX;
                                    newWidth -= deltaX;
                                    break;
                            }
                
                            // Apply minimum size constraints
                            if (newWidth >= 20 && newHeight >= 20) {
                                overlay.style.left = `${newLeft}px`;
                                overlay.style.top = `${newTop}px`;
                                overlay.style.width = `${newWidth}px`;
                                overlay.style.height = `${newHeight}px`;
                            }
                        });
                    };
                
                    const onMouseUp = () => {
                        document.removeEventListener('mousemove', onMouseMove);
                        document.removeEventListener('mouseup', onMouseUp);
                        // Remove the classes
                        document.body.classList.remove('disable-interactions');
                        overlay.classList.remove('overlay-resizing');
                        // Restore previous active state
                        isActive = previousActiveState;
                    };
                
                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
                });
        
                overlay.appendChild(handle);
            });
        };

        // Function to deactivate all overlays
        const deactivateOverlays = () => {
            isActive = false;
            if (toggleButton) {
                toggleButton.style.backgroundColor = '#4CAF50';
            }
            if (currentOverlay) {
                currentOverlay.remove();
                currentOverlay = null;
            }
            stickyOverlays.forEach(overlay => overlay.remove());
            stickyOverlays.clear();
        };

        // Create and mount the button using Shadow DOM
        const ui = await createShadowRootUi(ctx, {
            name: 'hover-overlay-ui',
            position: 'inline',
            anchor: 'body',
            onMount(container) {
                toggleButton = document.createElement('button');
                toggleButton.textContent = 'Toggle Element Selector';
                toggleButton.className = 'overlay-button';

                /* Object.assign(toggleButton.style, {
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    padding: '8px 16px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    zIndex: '999999',
                    height: 'auto',
                    minHeight: 'fit-content',
                    maxHeight: 'fit-content',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'background-color 0.2s ease'
                }); */

                Object.assign(toggleButton.style, {
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    padding: '8px 16px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    zIndex: '2147483647', // Maximum possible z-index
                    height: 'auto',
                    minHeight: 'fit-content',
                    maxHeight: 'fit-content',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)', // Slightly stronger shadow
                    transition: 'all 0.2s ease', // Transition for all properties
                    userSelect: 'none', // Prevent text selection
                    WebkitUserSelect: 'none',
                    outline: 'none', // Remove focus outline
                    backdropFilter: 'blur(4px)', // Add slight blur behind button
                    '-webkit-backdrop-filter': 'blur(4px)',
                    margin: '0', // Ensure no default margins
                    textShadow: '0 1px 1px rgba(0,0,0,0.1)' // Subtle text shadow
                });

                toggleButton.addEventListener('click', () => {
                    isActive = !isActive;
                    toggleButton.style.backgroundColor = isActive ? '#f44336' : '#4CAF50';
                    if (!isActive) {
                        deactivateOverlays();
                    }
                });

                container.appendChild(toggleButton);
            },
        });

        ui.mount();

        // Add escape key handler
        ctx.addEventListener(document, 'keydown', (event) => {
            if (event.key === 'Escape') {
                deactivateOverlays();
            }
        });

        const shouldShowOverlay = (element: HTMLElement): boolean => {
            return !element.classList.contains('hover-overlay') &&
                !element.classList.contains('sticky-overlay') &&
                !element.classList.contains('screenshot-button') &&
                !element.classList.contains('remove-button') &&
                !element.classList.contains('tools-container');
        };

        // Function to capture screen pixels
        const captureScreenPixels = async (element: HTMLElement) => {
            try {
                const rect = element.getBoundingClientRect();

                // Remove all overlays permanently
                deactivateOverlays();

                await new Promise(resolve => setTimeout(resolve, 300))

                // Send message to background script to take screenshot
                chrome.runtime.sendMessage({
                    action: "captureElement",
                    rect: {
                        x: rect.left,
                        y: rect.top,
                        width: rect.width,
                        height: rect.height
                    }
                });
            } catch (error) {
                console.error('Screenshot capture failed:', error);
            }
        };

        // Add message listener to process the screenshot
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === "processScreenshot") {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d')!;
                const image = new Image();

                image.onload = () => {
                    const dpr = window.devicePixelRatio;
                    canvas.width = request.rect.width * dpr;
                    canvas.height = request.rect.height * dpr;

                    ctx.scale(dpr, dpr);
                    ctx.drawImage(
                        image,
                        request.rect.x * dpr,
                        request.rect.y * dpr,
                        request.rect.width * dpr,
                        request.rect.height * dpr,
                        0,
                        0,
                        request.rect.width,
                        request.rect.height
                    );

                    canvas.toBlob((blob) => {
                        if (blob) {
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `screenshot-${Date.now()}.png`;
                            a.click();
                            URL.revokeObjectURL(url);
                        }
                    }, 'image/png', 1.0);
                };

                image.src = request.screenshot;
            }
        });

        // Function to create an overlay for a target element
        const createOverlay = (target: HTMLElement, isSticky: boolean = false): HTMLElement => {
            const rect = target.getBoundingClientRect();
            const overlay = document.createElement('div');
            overlay.className = `hover-overlay${isSticky ? ' sticky-overlay' : ''}`;

            overlay.style.top = `${rect.top + window.scrollY}px`;
            overlay.style.left = `${rect.left + window.scrollX}px`;
            overlay.style.width = `${rect.width}px`;
            overlay.style.height = `${rect.height}px`;

            if (isSticky) {
                (overlay as any)._targetElement = target;

                // Add resize handles
                addResizeHandles(overlay);

                const toolsContainer = document.createElement('div');
                toolsContainer.className = 'tools-container';

                const screenshotButton = document.createElement('button');
                screenshotButton.className = 'screenshot-button';
                screenshotButton.textContent = '📸 Screenshot';
                screenshotButton.addEventListener('click', async (event) => {
                    event.stopPropagation();
                    await captureScreenPixels(target);
                });

                const removeButton = document.createElement('button');
                removeButton.className = 'remove-button';
                removeButton.textContent = '✕';
                removeButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    overlay.remove();
                    stickyOverlays.delete(overlay);
                });

                toolsContainer.appendChild(screenshotButton);
                toolsContainer.appendChild(removeButton);
                overlay.appendChild(toolsContainer);
            } else {
                target.addEventListener('click', (event) => {
                    if (!isActive) return;
                    event.stopPropagation();
                    const stickyOverlay = createOverlay(target, true);
                    document.body.appendChild(stickyOverlay);
                    stickyOverlays.add(stickyOverlay);
                });
            }

            return overlay;
        };

        // Add mouseover event listener to the document
        ctx.addEventListener(document, 'mouseover', (event) => {
            if (!isActive) return;

            const target = event.target as HTMLElement;
            if (shouldShowOverlay(target)) {
                if (currentOverlay) {
                    currentOverlay.remove();
                }
                currentOverlay = createOverlay(target);
                document.body.appendChild(currentOverlay);
            }
        });

        // Remove hover overlay when mouse leaves the element
        ctx.addEventListener(document, 'mouseout', (event) => {
            if (!isActive) return;

            const target = event.target as HTMLElement;
            if (shouldShowOverlay(target) && currentOverlay) {
                currentOverlay.remove();
                currentOverlay = null;
            }
        });

        // Handle scroll events to update overlay positions
        ctx.addEventListener(window, 'scroll', () => {
            if (!isActive && stickyOverlays.size === 0) return;

            if (currentOverlay) {
                const hoveredElement = document.elementFromPoint(
                    parseInt(currentOverlay.style.left),
                    parseInt(currentOverlay.style.top)
                ) as HTMLElement;

                if (hoveredElement && shouldShowOverlay(hoveredElement)) {
                    const rect = hoveredElement.getBoundingClientRect();
                    currentOverlay.style.top = `${rect.top + window.scrollY}px`;
                    currentOverlay.style.left = `${rect.left + window.scrollX}px`;
                }
            }

            stickyOverlays.forEach(overlay => {
                const targetElement = (overlay as any)._targetElement;
                if (targetElement) {
                    const newRect = targetElement.getBoundingClientRect();
                    overlay.style.top = `${newRect.top + window.scrollY}px`;
                    overlay.style.left = `${newRect.left + window.scrollX}px`;
                    overlay.style.width = `${newRect.width}px`;
                    overlay.style.height = `${newRect.height}px`;
                }
            });
        }, { passive: true });

        ctx.addEventListener(document, 'click', (event) => {
            if (isActive) {
              event.preventDefault();
            }
          }, { capture: true });

        // Handle window resize
        ctx.addEventListener(window, 'resize', () => {
            if (currentOverlay) {
                const hoveredElement = (currentOverlay as any)._targetElement;
                if (hoveredElement) {
                    const rect = hoveredElement.getBoundingClientRect();
                    currentOverlay.style.top = `${rect.top + window.scrollY}px`;
                    currentOverlay.style.left = `${rect.left + window.scrollX}px`;
                    currentOverlay.style.width = `${rect.width}px`;
                    currentOverlay.style.height = `${rect.height}px`;
                }
            }

            stickyOverlays.forEach(overlay => {
                const targetElement = (overlay as any)._targetElement;
                if (targetElement) {
                    const newRect = targetElement.getBoundingClientRect();
                    overlay.style.top = `${newRect.top + window.scrollY}px`;
                    overlay.style.left = `${newRect.left + window.scrollX}px`;
                    overlay.style.width = `${newRect.width}px`;
                    overlay.style.height = `${newRect.height}px`;
                }
            });
        }, { passive: true });
    },
});


// extra padding version
/* const captureScreenPixels = async (element: HTMLElement) => {
    try {
        const rect = element.getBoundingClientRect();
        const padding = 16; // 16px padding on all sides
        
        // Calculate padded dimensions while checking viewport boundaries
        const x = Math.max(0, rect.left - padding);
        const y = Math.max(0, rect.top - padding);
        const width = Math.min(
            rect.width + (padding * 2),
            document.documentElement.clientWidth - x
        );
        const height = Math.min(
            rect.height + (padding * 2),
            document.documentElement.clientHeight - y
        );

        // Remove all overlays permanently
        deactivateOverlays();

        // Send message to background script to take screenshot
        chrome.runtime.sendMessage({
            action: "captureElement",
            rect: {
                x,
                y,
                width,
                height
            }
        });
    } catch (error) {
        console.error('Screenshot capture failed:', error);
    }
}; */