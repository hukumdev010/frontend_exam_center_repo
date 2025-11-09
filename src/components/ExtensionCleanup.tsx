/**
 * Component that injects a script to clean browser extension attributes before React hydration
 * This helps prevent hydration mismatches caused by browser extensions
 * Enhanced version to handle BiS (Built-in Security) and other common extensions
 */
export default function ExtensionCleanup() {
  const cleanupScript = `
    (function() {
      // Comprehensive extension attributes that commonly cause hydration mismatches
      const extensionAttributes = [
        'bis_skin_checked',
        'bis_register', 
        'data-gramm',
        'data-gramm_editor',
        'data-darkreader',
        'grammarly-extension',
        'data-adblock',
        'data-honey-extension',
        'data-lastpass',
        'data-bitwarden',
        'data-onepassword',
        'spellcheck',
        '_target',
      ];

      // Function to clean attributes from an element with enhanced pattern matching
      function cleanElement(element) {
        if (!element || !element.removeAttribute) return;
        
        // Remove known extension attributes
        extensionAttributes.forEach(function(attr) {
          if (element.hasAttribute && element.hasAttribute(attr)) {
            try {
              element.removeAttribute(attr);
            } catch (e) {
              // Ignore removal errors
            }
          }
        });

        // Clean attributes that start with or contain known patterns
        if (element.attributes) {
          const attributesToRemove = [];
          for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            const name = attr.name;
            
            // Check for various extension patterns
            if (name.includes('__processed_') || 
                name.startsWith('bis_') ||
                name.includes('gramm') ||
                name.startsWith('data-gramm') ||
                name.includes('darkreader') ||
                name.includes('lastpass') ||
                name.includes('bitwarden') ||
                name.includes('onepassword') ||
                name.includes('honey') ||
                name.includes('adblock') ||
                // Specific pattern from the error message
                name.includes('8e92d8c1-8047-46e4-9b32-9625c6a0ed71')) {
              attributesToRemove.push(name);
            }
          }
          
          attributesToRemove.forEach(function(name) {
            try {
              element.removeAttribute(name);
            } catch (e) {
              // Ignore removal errors
            }
          });
        }
      }

      // Enhanced document cleaning with TreeWalker for efficiency
      function cleanDocument() {
        try {
          // Clean body and html elements first
          cleanElement(document.body);
          cleanElement(document.documentElement);
          
          // Use TreeWalker for efficient DOM traversal
          if (document.body && typeof document.createTreeWalker !== 'undefined') {
            const walker = document.createTreeWalker(
              document.body,
              NodeFilter.SHOW_ELEMENT,
              function(node) {
                return NodeFilter.FILTER_ACCEPT;
              }
            );

            let currentNode = walker.nextNode();
            let cleanedCount = 0;
            const maxNodes = 200; // Limit for performance

            while (currentNode && cleanedCount < maxNodes) {
              cleanElement(currentNode);
              currentNode = walker.nextNode();
              cleanedCount++;
            }
          } else {
            // Fallback to querySelectorAll if TreeWalker not available
            var allElements = document.querySelectorAll('*');
            // Clean first 100 elements for performance
            for (var i = 0; i < Math.min(allElements.length, 100); i++) {
              cleanElement(allElements[i]);
            }
          }
        } catch (cleanError) {
          // Continue if cleaning fails - log in development only
          if (typeof console !== 'undefined' && console.log) {
            console.log('Extension cleanup: Document cleaning encountered an error');
          }
        }
      }

      // Enhanced mutation observer with better attribute filtering
      function setupObserver() {
        if (typeof MutationObserver !== 'undefined' && document.documentElement) {
          try {
            var observer = new MutationObserver(function(mutations) {
              mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.target && mutation.attributeName) {
                  var target = mutation.target;
                  var attributeName = mutation.attributeName;
                  
                  // Check if the attribute is extension-related
                  var isExtensionAttribute = extensionAttributes.some(function(attr) {
                    return attributeName === attr || attributeName.indexOf(attr) === 0;
                  }) || 
                  attributeName.includes('__processed_') ||
                  attributeName.startsWith('bis_') ||
                  attributeName.includes('gramm') ||
                  attributeName.startsWith('data-gramm') ||
                  attributeName.includes('8e92d8c1-8047-46e4-9b32-9625c6a0ed71');

                  if (isExtensionAttribute && target && typeof target.removeAttribute === 'function') {
                    try {
                      target.removeAttribute(attributeName);
                    } catch (removeError) {
                      // Ignore removal errors
                    }
                  }
                }
              });
            });

            // Observe the entire document
            observer.observe(document.documentElement, {
              attributes: true,
              subtree: true,
              attributeOldValue: false
            });

            // Store observer reference for potential cleanup
            window.__extensionObserver = observer;
            
          } catch (observerError) {
            // Fallback if observer setup fails
            // Set up periodic cleaning instead
            setInterval(function() {
              cleanDocument();
            }, 1000);
          }
        }
      }

      // Enhanced initialization with multiple entry points
      function initializeCleanup() {
        // Clean immediately
        cleanDocument();
        
        // Setup observer for continuous monitoring
        setupObserver();
        
        // Clean again after short delays to catch late-loading extensions
        setTimeout(cleanDocument, 50);
        setTimeout(cleanDocument, 100);
        setTimeout(cleanDocument, 250);
        setTimeout(cleanDocument, 500);
      }

      // Multiple initialization strategies
      
      // Strategy 1: Run immediately if possible
      if (document.body) {
        initializeCleanup();
      }
      
      // Strategy 2: Wait for DOM content loaded
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCleanup);
      } else {
        initializeCleanup();
      }

      // Strategy 3: Window load as final backup
      if (typeof window !== 'undefined') {
        window.addEventListener('load', function() {
          // Final cleanup pass
          cleanDocument();
        });
      }
      
      // Strategy 4: Continuous monitoring in development
      if (typeof window !== 'undefined' && window.location && 
          window.location.hostname === 'localhost') {
        // In development, run more aggressive cleaning
        setInterval(function() {
          if (document.body) {
            cleanDocument();
          }
        }, 2000);
      }
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: cleanupScript
      }}
    />
  );
}