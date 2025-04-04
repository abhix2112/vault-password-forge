
import React, { useEffect } from 'react';
import faviconSvg from '../assets/favicon.svg';

/**
 * This component handles loading the favicon and converting SVG to PNG for browsers 
 * that don't support SVG favicons
 */
const FaviconLoader: React.FC = () => {
  useEffect(() => {
    // This code runs only in the browser, not during SSR
    if (typeof document !== 'undefined') {
      // Check if browser already has SVG favicon support
      const existingFavicon = document.querySelector('link[rel="icon"]');
      if (existingFavicon && existingFavicon.getAttribute('type') === 'image/svg+xml') {
        // Browser supports SVG favicons, no need to do anything
        return;
      }

      // For browsers that don't support SVG favicons, create a PNG fallback
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, 32, 32);
            const pngFavicon = document.createElement('link');
            pngFavicon.rel = 'icon';
            pngFavicon.href = canvas.toDataURL('image/png');
            document.head.appendChild(pngFavicon);
          };
          img.src = faviconSvg;
        }
      } catch (error) {
        console.error('Error creating favicon fallback:', error);
      }
    }
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default FaviconLoader;
