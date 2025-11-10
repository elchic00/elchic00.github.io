const fs = require('fs');
const path = require('path');

/**
 * Post-build script to inline critical CSS for improved performance
 * This reduces render-blocking CSS and improves First Contentful Paint
 */

const BUILD_DIR = path.join(__dirname, '../build');
const INDEX_HTML = path.join(BUILD_DIR, 'index.html');

// Critical CSS for above-the-fold content (navbar, hero section)
const CRITICAL_CSS = `
<style>
/* Critical CSS - Inlined for performance */
*,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}
html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"}
body{margin:0;line-height:inherit}
#root{min-height:100vh}
.bg-slate-950{background-color:#020617}
.text-slate-200{color:#e2e8f0}
.bg-slate-800\/95{background-color:rgba(30,41,59,.95)}
.backdrop-blur-md{backdrop-filter:blur(12px)}
.fixed{position:fixed}
.top-0{top:0}
.left-0{left:0}
.z-50{z-index:50}
.w-full{width:100%}
.shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1)}
.flex{display:flex}
.items-center{align-items:center}
.justify-between{justify-content:space-between}
.py-3{padding-top:.75rem;padding-bottom:.75rem}
.px-4{padding-left:1rem;padding-right:1rem}
.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
.scrollbar-hide::-webkit-scrollbar{display:none}
/* Loading state */
#root>div{font-family:sans-serif;text-align:center;padding:2rem}
</style>
`;

function inlineCriticalCSS() {
  try {
    console.log('Starting critical CSS inlining...');

    // Read the built HTML file
    let html = fs.readFileSync(INDEX_HTML, 'utf8');

    // Check if critical CSS is already inlined
    if (html.includes('/* Critical CSS - Inlined for performance */')) {
      console.log('Critical CSS already inlined, skipping...');
      return;
    }

    // Find the CSS link tag
    const cssLinkMatch = html.match(/<link rel="stylesheet"[^>]*href="([^"]*)"[^>]*>/);

    if (cssLinkMatch) {
      const cssLink = cssLinkMatch[0];

      // Insert critical CSS before the CSS link and add media="print" to defer non-critical CSS
      const deferredCssLink = cssLink.replace(
        'rel="stylesheet"',
        'rel="preload" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"'
      );

      // Add noscript fallback for users without JS
      const noscriptFallback = `<noscript>${cssLink}</noscript>`;

      html = html.replace(
        cssLink,
        `${CRITICAL_CSS}\n    ${deferredCssLink}\n    ${noscriptFallback}`
      );

      // Write the modified HTML back
      fs.writeFileSync(INDEX_HTML, html, 'utf8');

      console.log('✅ Critical CSS inlined successfully!');
      console.log('📊 This should improve your mobile performance score');
    } else {
      console.warn('⚠️  No CSS link found in index.html');
    }
  } catch (error) {
    console.error('❌ Error inlining critical CSS:', error);
    process.exit(1);
  }
}

inlineCriticalCSS();
