import { useEffect } from 'react';

export const useDarkMode = () => {
  useEffect(() => {
    const updateTheme = () => {
      // Check if dark mode is active by looking at the html tag's class
      const isDarkMode = document.documentElement.classList.contains('dark');
      
      // Try to find the element with either theme class
      const willowElement = document.querySelector('.wx-willow-theme, .wx-willow-dark-theme');
      if (willowElement) {
        if (isDarkMode) {
          willowElement.classList.remove('wx-willow-theme');
          willowElement.classList.add('wx-willow-dark-theme');
          console.log('Switched to dark theme');
        } else {
          willowElement.classList.remove('wx-willow-dark-theme');
          willowElement.classList.add('wx-willow-theme');
          console.log('Switched to light theme');
        }
      }

      // Set up an observer to watch for the element being added
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              // Check for either theme class
              const element = node.classList.contains('wx-willow-theme') || node.classList.contains('wx-willow-dark-theme') ? 
                node : node.querySelector('.wx-willow-theme, .wx-willow-dark-theme');
              
              if (element) {
                if (isDarkMode) {
                  element.classList.remove('wx-willow-theme');
                  element.classList.add('wx-willow-dark-theme');
                  console.log('New element switched to dark theme');
                } else {
                  element.classList.remove('wx-willow-dark-theme');
                  element.classList.add('wx-willow-theme');
                  console.log('New element switched to light theme');
                }
                observer.disconnect(); // Stop observing once we've made the change
              }
            }
          });
        });
      });

      // Start observing the document with the configured parameters
      observer.observe(document.body, { childList: true, subtree: true });

      // Cleanup the observer after 2 seconds (should be plenty of time)
      setTimeout(() => observer.disconnect(), 2000);
    };

    // Initial update
    updateTheme();

    // Watch for changes to the document's dark mode class
    const darkModeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target instanceof HTMLElement && 
            mutation.attributeName === 'class') {
          updateTheme();
        }
      });
    });

    // Start observing the html element for class changes
    darkModeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Cleanup
    return () => {
      darkModeObserver.disconnect();
    };
  }, []);
};
