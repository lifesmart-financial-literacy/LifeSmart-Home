const BASE_URL = 'https://lifesmart.app';

const routes = [
  {
    path: '/',
    priority: 1.0,
    changefreq: 'daily'
  },
  {
    path: '/budget-tool',
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    path: '/quiz',
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    path: '/calculator',
    priority: 0.8,
    changefreq: 'weekly'
  }
];

export const generateSitemap = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${routes.map(route => `
  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    ${route.priority ? `<priority>${route.priority}</priority>` : ''}
    ${route.changefreq ? `<changefreq>${route.changefreq}</changefreq>` : ''}
    <mobile:mobile/>
    <image:image>
      <image:loc>${BASE_URL}/og-image.png</image:loc>
      <image:title>LifeSmart - ${route.path.replace('/', '')}</image:title>
      <image:caption>LifeSmart Financial Education Platform</image:caption>
    </image:image>
  </url>`).join('')}
</urlset>`;

  return sitemap;
}; 