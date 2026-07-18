const fs = require('fs');
const path = require('path');
const projects = require('../src/data/structured/projects.json');

/**
 * Post-build script to inline critical CSS for improved performance
 * This reduces render-blocking CSS and improves First Contentful Paint
 */

const BUILD_DIR = path.join(__dirname, '../build');
const INDEX_HTML = path.join(BUILD_DIR, 'index.html');

// Routes that need static HTML files for SEO
const ROUTES = ['projects', 'travel', 'snake'];

// Internal case-study pages (excludes external links like myPal's GitHub repo)
const CASE_STUDIES = projects.filter((p) => p.link.startsWith('/projects/'));

// Per-project social preview image, for the case studies that have a real
// screenshot. Anything not listed here keeps the site-wide default
// (profile.webp) rather than a broken/missing image.
const SOCIAL_IMAGES = {
  hermes: { file: 'hermes-langfuse-traces.webp', width: 1600, height: 818 },
  'inference-engine': { file: 'inference-grafana.webp', width: 1600, height: 936 },
  'pi-cloud': { file: 'pi-cloud-homepage.webp', width: 1600, height: 586 },
};

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

// Swap in per-project title/description so each case study gets its own
// preview instead of the generic homepage copy — this is also what unblocks
// link scrapers (LinkedIn, Slack, etc.) that need a real 200 response with
// matching metadata, not just a redirect.
function replaceMetaContent(html, matcher, newContent) {
  return html.replace(matcher, (_match, before, after) => `${before}${newContent}${after}`);
}

function createCaseStudyRouteDirectories(html) {
  try {
    console.log('Creating static route files for case studies...');

    CASE_STUDIES.forEach((project) => {
      const routeDir = path.join(BUILD_DIR, 'projects', project.id);

      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
        console.log(`📁 Created directory: projects/${project.id}/`);
      }

      const pageTitle = `${project.title} | Andrew Alagna`;
      const socialTitle = `${project.title} — ${project.subtitle} | Andrew Alagna`;
      const url = `https://elchic00.github.io${project.link}/`;

      let routeHtml = html
        .replace(/<title>[\s\S]*?<\/title>/, `<title>\n      ${pageTitle}\n    </title>`)
        .replace(
          /(rel="canonical" href=")[^"]*(")/,
          `$1${url}$2`
        )
        .replace(
          /(property="og:url" content=")[^"]*(")/,
          `$1${url}$2`
        );

      routeHtml = replaceMetaContent(
        routeHtml,
        /(property="og:title"[\s\S]*?content=")[^"]*(")/,
        socialTitle
      );
      routeHtml = replaceMetaContent(
        routeHtml,
        /(property="og:description"[\s\S]*?content=")[^"]*(")/,
        project.description
      );
      routeHtml = replaceMetaContent(
        routeHtml,
        /(name="description"[\s\S]*?content=")[^"]*(")/,
        project.description
      );
      routeHtml = replaceMetaContent(
        routeHtml,
        /(name="twitter:title"[\s\S]*?content=")[^"]*(")/,
        socialTitle
      );
      routeHtml = replaceMetaContent(
        routeHtml,
        /(name="twitter:description"[\s\S]*?content=")[^"]*(")/,
        project.description
      );

      const socialImage = SOCIAL_IMAGES[project.id];
      if (socialImage) {
        const imageUrl = `https://elchic00.github.io/images/case-studies/${socialImage.file}`;
        const imageAlt = `${project.title} — ${project.subtitle}`;
        routeHtml = replaceMetaContent(routeHtml, /(property="og:image" content=")[^"]*(")/, imageUrl);
        routeHtml = replaceMetaContent(routeHtml, /(property="og:image:width" content=")[^"]*(")/, String(socialImage.width));
        routeHtml = replaceMetaContent(routeHtml, /(property="og:image:height" content=")[^"]*(")/, String(socialImage.height));
        routeHtml = replaceMetaContent(routeHtml, /(property="og:image:alt"[\s\S]*?content=")[^"]*(")/, imageAlt);
        routeHtml = replaceMetaContent(routeHtml, /(name="twitter:image" content=")[^"]*(")/, imageUrl);
        routeHtml = replaceMetaContent(routeHtml, /(name="twitter:image:alt"[\s\S]*?content=")[^"]*(")/, imageAlt);
      }

      fs.writeFileSync(path.join(routeDir, 'index.html'), routeHtml, 'utf8');
      console.log(`📝 Created: projects/${project.id}/index.html`);
    });

    console.log('✅ Case-study route files created successfully!');
  } catch (error) {
    console.error('❌ Error creating case-study route directories:', error);
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
    createCaseStudyRouteDirectories(html);

    console.log('\n🎉 Build post-processing complete!');
    console.log('   - Routes now have static HTML files for SEO');
    console.log('   - Critical CSS is inlined for performance');
    console.log('   - GitHub Pages will serve proper URLs: /projects, /travel, /snake');
    console.log('   - Case studies have their own static URLs + accurate previews');
  } catch (error) {
    console.error('❌ Build post-processing failed:', error);
    process.exit(1);
  }
}

main();
