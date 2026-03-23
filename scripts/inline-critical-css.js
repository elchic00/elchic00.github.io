const fs = require('fs');
const path = require('path');

/**
 * Post-build script to inline critical CSS for improved performance
 * This reduces render-blocking CSS and improves First Contentful Paint
 */

const BUILD_DIR = path.join(__dirname, '../build');
const INDEX_HTML = path.join(BUILD_DIR, 'index.html');

// Routes that need static HTML files for SEO
const ROUTES = ['projects', 'travel', 'snake'];

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
      return html;
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

      console.log('✅ Critical CSS inlined successfully!');
      return html;
    } else {
      console.warn('⚠️  No CSS link found in index.html');
      return html;
    }
  } catch (error) {
    console.error('❌ Error inlining critical CSS:', error);
    throw error;
  }
}

function createRouteDirectories(html) {
  try {
    console.log('Creating static route files for SEO...');

    ROUTES.forEach(route => {
      const routeDir = path.join(BUILD_DIR, route);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
        console.log(`📁 Created directory: ${route}/`);
      }

      // Write index.html to the route directory
      const routeHtmlPath = path.join(routeDir, 'index.html');
      
      // Update canonical URL for the specific route
      const routeHtml = html.replace(
        /<link rel="canonical" href="https:\/\/elchic00.github.io\/" \/>/,
        `<link rel="canonical" href="https://elchic00.github.io/${route}/" />`
      ).replace(
        /<meta property="og:url" content="https:\/\/elchic00.github.io\/" \/>/,
        `<meta property="og:url" content="https://elchic00.github.io/${route}/" />`
      );
      
      fs.writeFileSync(routeHtmlPath, routeHtml, 'utf8');
      console.log(`📝 Created: ${route}/index.html`);
    });

    console.log('✅ Static route files created successfully!');
  } catch (error) {
    console.error('❌ Error creating route directories:', error);
    throw error;
  }
}

function main() {
  try {
    const html = inlineCriticalCSS();
    
    // Write the modified HTML back to root
    fs.writeFileSync(INDEX_HTML, html, 'utf8');
    console.log('📊 This should improve your mobile performance score');
    
    // Create static files for each route
    createRouteDirectories(html);
    
    console.log('\n🎉 Build post-processing complete!');
    console.log('   - Routes now have static HTML files for SEO');
    console.log('   - Critical CSS is inlined for performance');
    console.log('   - GitHub Pages will serve proper URLs: /projects, /travel, /snake');
  } catch (error) {
    console.error('❌ Build post-processing failed:', error);
    process.exit(1);
  }
}

main();
