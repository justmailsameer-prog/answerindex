// Shared Technology Stack & CMS Fingerprint Detector for AnswerIndex
// Detects CMS, eCommerce, Hosting CDN, and SEO plugins from HTML and HTTP headers

export function detectTechStack(html = '', headers = null, domain = '') {
  const h = typeof html === 'string' ? html : '';
  const hLower = h.toLowerCase();
  
  // Normalize headers
  const getHeader = (name) => {
    if (!headers) return '';
    try {
      if (typeof headers.get === 'function') {
        return (headers.get(name) || '').toLowerCase();
      }
      if (typeof headers === 'object') {
        const key = Object.keys(headers).find(k => k.toLowerCase() === name.toLowerCase());
        return key ? (headers[key] || '').toLowerCase() : '';
      }
    } catch (e) {}
    return '';
  };

  const serverHeader = getHeader('server');
  const poweredBy = getHeader('x-powered-by');
  const cfRay = getHeader('cf-ray');
  const vercelId = getHeader('x-vercel-id');
  const wixServer = getHeader('x-wix-renderer-server');
  const amzCf = getHeader('x-amz-cf-id');
  const netlifyId = getHeader('x-nf-request-id');

  // Detect Hosting / CDN
  let cdn = 'Standard Web Host';
  if (cfRay || serverHeader.includes('cloudflare')) {
    cdn = 'Cloudflare Global Edge';
  } else if (vercelId || serverHeader.includes('vercel')) {
    cdn = 'Vercel Edge Network';
  } else if (amzCf || serverHeader.includes('cloudfront')) {
    cdn = 'AWS CloudFront';
  } else if (netlifyId || serverHeader.includes('netlify')) {
    cdn = 'Netlify CDN';
  } else if (poweredBy.includes('wp engine') || getHeader('wpe-backend')) {
    cdn = 'WP Engine Dedicated';
  } else if (serverHeader.includes('nginx')) {
    cdn = 'Nginx Reverse Proxy';
  } else if (serverHeader.includes('apache')) {
    cdn = 'Apache HTTP Server';
  }

  // Detect SEO Plugins
  let seoEngine = 'Standard HTML Meta Tags';
  if (hLower.includes('yoast seo') || hLower.includes('yoast-schema-graph')) {
    seoEngine = 'Yoast SEO';
  } else if (hLower.includes('rank math') || hLower.includes('rank-math')) {
    seoEngine = 'Rank Math SEO';
  } else if (hLower.includes('all in one seo') || hLower.includes('aioseo')) {
    seoEngine = 'All in One SEO (AIOSEO)';
  } else if (hLower.includes('seopress')) {
    seoEngine = 'SEOPress';
  }

  // Detect Ecommerce Engine
  let ecommerce = null;
  if (hLower.includes('woocommerce') || hLower.includes('wc-block') || hLower.includes('woocommerce-price-amount')) {
    ecommerce = 'WooCommerce';
  } else if (hLower.includes('cdn.shopify.com') || hLower.includes('window.shopify') || hLower.includes('myshopify.com')) {
    ecommerce = 'Shopify Storefront';
  } else if (hLower.includes('varienform') || hLower.includes('mage/cookies.js') || hLower.includes('/pub/static/frontend/')) {
    ecommerce = 'Magento / Adobe Commerce';
  } else if (hLower.includes('bigcommerce') || hLower.includes('cdn11.bigcommerce.com')) {
    ecommerce = 'BigCommerce';
  }

  // Detect Platform & CMS
  // 1. WordPress
  if (
    hLower.includes('/wp-content/') ||
    hLower.includes('/wp-includes/') ||
    hLower.includes('name="generator" content="wordpress') ||
    hLower.includes('wp-json') ||
    hLower.includes('wp-emoji') ||
    poweredBy.includes('wordpress')
  ) {
    const versionMatch = h.match(/name=["']generator["'] content=["']WordPress\s*([0-9.]+)?["']/i);
    const ver = versionMatch && versionMatch[1] ? ` ${versionMatch[1]}` : '';
    return {
      platform: 'wordpress',
      name: `WordPress${ver}`,
      cms_type: 'wordpress',
      badge_icon: '🌐',
      confidence: 'High (100%)',
      cdn,
      ecommerce,
      seo_engine: seoEngine,
      delivery_channel: 'wp_draft',
      delivery_desc: 'Staged automatically as Draft Posts in WordPress Admin via REST API. Zero coding required.',
      details: `Detected WordPress${ver}${ecommerce ? ' with ' + ecommerce : ''}. Seamless REST API draft synchronization active.`
    };
  }

  // 2. Shopify
  if (
    ecommerce === 'Shopify Storefront' ||
    hLower.includes('cdn.shopify.com') ||
    hLower.includes('window.shopify') ||
    hLower.includes('shopify-section') ||
    hLower.includes('myshopify.com')
  ) {
    return {
      platform: 'shopify',
      name: 'Shopify',
      cms_type: 'shopify',
      badge_icon: '🛍️',
      confidence: 'High (100%)',
      cdn: cdn === 'Cloudflare Global Edge' ? 'Shopify Cloudflare Edge' : cdn,
      ecommerce: 'Shopify Storefront',
      seo_engine: seoEngine !== 'Standard HTML Meta Tags' ? seoEngine : 'Shopify Liquid Metafields',
      delivery_channel: 'shopify_draft',
      delivery_desc: 'Staged as Draft Articles in Shopify Blog & Product Q&A Metafields via Shopify Admin API.',
      details: 'Detected Shopify eCommerce platform. Liquid blog drafts and product schema staging ready.'
    };
  }

  // 3. Webflow
  if (
    hLower.includes('assets.website-files.com') ||
    hLower.includes('data-wf-page') ||
    hLower.includes('data-wf-site') ||
    hLower.includes('webflow.js') ||
    hLower.includes('name="generator" content="webflow')
  ) {
    return {
      platform: 'webflow',
      name: 'Webflow',
      cms_type: 'webflow',
      badge_icon: '🎨',
      confidence: 'High (100%)',
      cdn: 'Webflow AWS / Fastly Edge',
      ecommerce,
      seo_engine: 'Webflow Designer Meta Graph',
      delivery_channel: 'portal',
      delivery_desc: 'Formatted for Webflow CMS collections & Rich Text components with 1-click schema injection.',
      details: 'Detected Webflow Visual CMS. Tailored for Webflow Collection CMS sync and Rich Text FAQ embeds.'
    };
  }

  // 4. Squarespace
  if (
    hLower.includes('static1.squarespace.com') ||
    hLower.includes('squarespace-core') ||
    hLower.includes('squarespace_cache_version') ||
    hLower.includes('squarespace.com')
  ) {
    return {
      platform: 'squarespace',
      name: 'Squarespace',
      cms_type: 'squarespace',
      badge_icon: '⬛',
      confidence: 'High (99%)',
      cdn: 'Squarespace Fastly CDN',
      ecommerce,
      seo_engine: 'Squarespace Built-in SEO',
      delivery_channel: 'portal',
      delivery_desc: 'Pre-formatted Code Injection blocks and Blog markdown drafts for Squarespace.',
      details: 'Detected Squarespace website. Staged for Squarespace Code Injection and Blog posts.'
    };
  }

  // 5. Wix
  if (
    wixServer ||
    hLower.includes('static.wixstatic.com') ||
    hLower.includes('wix-code') ||
    hLower.includes('wix-warmup-data') ||
    hLower.includes('wixsite.com')
  ) {
    return {
      platform: 'wix',
      name: 'Wix Studio / Editor',
      cms_type: 'wix',
      badge_icon: '⚡',
      confidence: 'High (99%)',
      cdn: 'Wix Global CDN',
      ecommerce,
      seo_engine: 'Wix SEO Wiz / Built-in',
      delivery_channel: 'portal',
      delivery_desc: 'Optimized HTML/Schema blocks ready for Wix Tracking Tools & Blog Manager.',
      details: 'Detected Wix platform. Optimized for Wix Advanced SEO and structured snippet embeds.'
    };
  }

  // 6. Next.js / React (Modern App Router / Pages)
  if (
    hLower.includes('/_next/static/') ||
    hLower.includes('id="__next_data__"') ||
    hLower.includes('__next') ||
    vercelId
  ) {
    return {
      platform: 'nextjs',
      name: 'Next.js / React',
      cms_type: 'portal',
      badge_icon: '▲',
      confidence: 'High (98%)',
      cdn: vercelId ? 'Vercel Edge Network' : cdn,
      ecommerce,
      seo_engine: 'Next.js Metadata API / JSON-LD',
      delivery_channel: 'portal',
      delivery_desc: 'Zero-Click Schema JSON-LD & React-compatible JSX answer blocks + GitHub PR ready.',
      details: 'Detected modern Next.js / React application. Clean TypeScript Schema snippets generated.'
    };
  }

  // 7. Magento / Adobe Commerce
  if (
    ecommerce === 'Magento / Adobe Commerce' ||
    hLower.includes('/pub/static/frontend/') ||
    hLower.includes('/skin/frontend/') ||
    hLower.includes('mage/cookies.js')
  ) {
    return {
      platform: 'magento',
      name: 'Magento / Adobe Commerce',
      cms_type: 'magento',
      badge_icon: '📦',
      confidence: 'High (95%)',
      cdn,
      ecommerce: 'Magento 2 Commerce',
      seo_engine: 'Magento Catalog SEO',
      delivery_channel: 'magento',
      delivery_desc: 'Staged as Magento 2 PageBuilder CMS Blocks & Catalog Meta via REST API.',
      details: 'Detected Enterprise Magento / Adobe Commerce stack.'
    };
  }

  // 8. Ghost CMS
  if (
    hLower.includes('name="generator" content="ghost') ||
    hLower.includes('ghost-portal') ||
    hLower.includes('ghost.org')
  ) {
    return {
      platform: 'ghost',
      name: 'Ghost CMS',
      cms_type: 'portal',
      badge_icon: '👻',
      confidence: 'High (95%)',
      cdn,
      ecommerce: null,
      seo_engine: 'Ghost Structured Data',
      delivery_channel: 'portal',
      delivery_desc: 'Staged markdown posts with Code Injection JSON-LD headers for Ghost Admin.',
      details: 'Detected Ghost Publishing Platform.'
    };
  }

  // 9. HubSpot CMS
  if (
    hLower.includes('hs-scripts.com') ||
    hLower.includes('hubspot') ||
    hLower.includes('hsg-nav')
  ) {
    return {
      platform: 'hubspot',
      name: 'HubSpot CMS Hub',
      cms_type: 'portal',
      badge_icon: '🟠',
      confidence: 'High (95%)',
      cdn: 'HubSpot Akamai / Cloudflare CDN',
      ecommerce,
      seo_engine: 'HubSpot Content Optimization System',
      delivery_channel: 'portal',
      delivery_desc: 'Formatted HubL module drafts & JSON-LD blocks for HubSpot Blog & Landing Pages.',
      details: 'Detected HubSpot CMS Hub.'
    };
  }

  // Default: Custom Web Portal & Universal Delivery
  return {
    platform: 'custom_portal',
    name: 'Custom Web Application / Modern HTML',
    cms_type: 'portal',
    badge_icon: '💻',
    confidence: 'Standard (Universal)',
    cdn,
    ecommerce,
    seo_engine: seoEngine,
    delivery_channel: 'portal',
    delivery_desc: 'Universal Web Portal with 1-Click Copy, verified Schema.org snippets, and daily email digests.',
    details: 'Universal architecture detected. Compatible with all CMS platforms, static sites, and custom stacks.'
  };
}
