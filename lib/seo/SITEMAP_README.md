# Sitemap Generation System

This document describes the automated sitemap generation system implemented for the Throne of Gods application.

## Overview

The sitemap generation system automatically creates and maintains XML sitemaps and robots.txt files for search engine optimization. It dynamically generates URLs based on the application's data and provides proper SEO metadata for all discoverable pages.

## Features

- **Automated sitemap.xml generation** - Creates XML sitemaps with all discoverable pages
- **Dynamic URL discovery** - Automatically includes character pages and quiz results based on data
- **robots.txt optimization** - Generates SEO-friendly robots.txt with proper directives
- **URL validation** - Validates all URLs before inclusion in sitemap
- **Change monitoring** - Tracks changes in data that affect sitemap content
- **Caching** - Implements appropriate caching headers for performance
- **Error handling** - Provides fallback sitemaps when errors occur

## Generated URLs

The system automatically generates URLs for:

1. **Homepage** (`/`) - Priority: 1.0, Change frequency: daily
2. **Quiz page** (`/quiz`) - Priority: 0.9, Change frequency: weekly
3. **Character pages** (`/characters/[slug]`) - Priority: 0.8, Change frequency: monthly
4. **Quiz result pages** (`/quiz/results/[slug]`) - Priority: 0.7, Change frequency: monthly

## Files Structure

```
lib/seo/
├── sitemap.ts              # Core sitemap generation utilities
├── sitemap-monitor.ts      # Change detection and monitoring
└── __tests__/
    ├── sitemap.test.ts     # Unit tests for sitemap functions
    └── sitemap-integration.test.ts # Integration tests

app/
├── sitemap.xml/
│   └── route.ts           # Next.js route handler for /sitemap.xml
└── robots.txt/
    └── route.ts           # Next.js route handler for /robots.txt
```

## API Reference

### Core Functions

#### `generateSitemapUrls(config?: SitemapConfig): SitemapUrl[]`

Generates an array of sitemap URLs for all discoverable pages.

#### `generateSitemapXML(urls: SitemapUrl[]): string`

Converts sitemap URLs into valid XML format.

#### `generateRobotsTxt(config?: SitemapConfig): string`

Generates robots.txt content with sitemap reference.

#### `validateSitemapUrls(urls: SitemapUrl[]): { valid: SitemapUrl[]; invalid: SitemapUrl[] }`

Validates sitemap URLs and returns valid/invalid arrays.

### Configuration

```typescript
interface SitemapConfig {
  baseUrl: string;
  defaultChangeFreq:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  defaultPriority: number;
}
```

### URL Structure

```typescript
interface SitemapUrl {
  url: string;
  lastModified?: Date;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}
```

## Usage

### Accessing Sitemaps

- **Sitemap XML**: `https://yoursite.com/sitemap.xml`
- **Robots.txt**: `https://yoursite.com/robots.txt`

### Programmatic Usage

```typescript
import { generateSitemapUrls, generateSitemapXML } from "@/lib/seo/sitemap";

// Generate sitemap URLs
const urls = generateSitemapUrls();

// Convert to XML
const xml = generateSitemapXML(urls);
```

### Monitoring Changes

```typescript
import { SitemapMonitor } from "@/lib/seo/sitemap-monitor";

const monitor = new SitemapMonitor();
const changes = monitor.detectChanges();
const health = monitor.getHealthStatus();
```

## Testing

Run sitemap tests:

```bash
npm test -- lib/seo/__tests__/sitemap.test.ts
npm test -- lib/seo/__tests__/sitemap-integration.test.ts
```

## Performance

- **Caching**: Sitemap responses are cached for 1 hour (3600 seconds)
- **Robots.txt**: Cached for 24 hours (86400 seconds)
- **Error fallback**: Shorter cache times (5 minutes) for error responses
- **Validation**: URLs are validated before inclusion to prevent errors

## SEO Benefits

1. **Search Engine Discovery**: Helps search engines find all pages
2. **Crawl Efficiency**: Provides metadata to optimize crawling
3. **Priority Signals**: Indicates page importance through priority values
4. **Change Frequency**: Helps search engines understand update patterns
5. **Mobile Optimization**: Includes mobile-friendly directives in robots.txt

## Monitoring and Maintenance

The system includes monitoring capabilities to track:

- Total URL count
- Character count changes
- URL validation status
- Health status
- Change detection

## Environment Variables

- `NEXT_PUBLIC_SITE_URL`: Base URL for the site (defaults to https://throneofgods.com)

## Error Handling

The system provides robust error handling:

- Fallback sitemaps when generation fails
- URL validation to prevent broken links
- Logging of invalid URLs in development
- Graceful degradation with minimal sitemaps

## Future Enhancements

Potential improvements:

- Database-driven last modified dates
- Automatic sitemap submission to search engines
- Multi-language sitemap support
- Image sitemap generation
- News sitemap for time-sensitive content
