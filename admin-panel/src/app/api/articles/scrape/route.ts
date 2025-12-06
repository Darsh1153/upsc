import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

// Simple HTML parser to extract content blocks
function parseHtmlToBlocks(html: string): Array<{ type: string; content: string; [key: string]: any }> {
    const blocks: Array<{ type: string; content: string; [key: string]: any }> = [];
    
    let cleanHtml = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    cleanHtml = cleanHtml.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    
    // Extract headings
    const headingRegex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
    let match;
    while ((match = headingRegex.exec(cleanHtml)) !== null) {
        const level = parseInt(match[1]);
        const content = match[2].replace(/<[^>]+>/g, '').trim();
        if (content) {
            blocks.push({ type: 'heading', level, content });
        }
    }
    
    // Extract paragraphs
    const paragraphRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    while ((match = paragraphRegex.exec(cleanHtml)) !== null) {
        const content = match[1].replace(/<[^>]+>/g, '').trim();
        if (content && content.length > 20) {
            blocks.push({ type: 'paragraph', content });
        }
    }
    
    // Extract lists
    const listRegex = /<(ul|ol)[^>]*>([\s\S]*?)<\/\1>/gi;
    while ((match = listRegex.exec(cleanHtml)) !== null) {
        const listType = match[1];
        const listItems = match[2].match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
        const items = listItems.map(item => item.replace(/<[^>]+>/g, '').trim()).filter(item => item);
        if (items.length > 0) {
            blocks.push({ type: listType === 'ol' ? 'ordered-list' : 'unordered-list', items, content: items.join(', ') });
        }
    }
    
    // Extract blockquotes
    const blockquoteRegex = /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi;
    while ((match = blockquoteRegex.exec(cleanHtml)) !== null) {
        const content = match[1].replace(/<[^>]+>/g, '').trim();
        if (content) {
            blocks.push({ type: 'quote', content });
        }
    }
    
    return blocks;
}

// Extract main content from HTML
function extractMainContent(html: string): string {
    let content = html;
    
    const removePatterns = [
        /<nav\b[^>]*>[\s\S]*?<\/nav>/gi,
        /<header\b[^>]*>[\s\S]*?<\/header>/gi,
        /<footer\b[^>]*>[\s\S]*?<\/footer>/gi,
        /<aside\b[^>]*>[\s\S]*?<\/aside>/gi,
        /<div[^>]*class="[^"]*(?:sidebar|advertisement|ads|comments|related|social|share)[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
        /<!--[\s\S]*?-->/g,
    ];
    
    for (const pattern of removePatterns) {
        content = content.replace(pattern, '');
    }
    
    const articleMatch = content.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (articleMatch) return articleMatch[1];
    
    const mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    if (mainMatch) return mainMatch[1];
    
    return content;
}

export async function POST(request: NextRequest) {
    const user = verifyAuth(request);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: `Failed to fetch URL: ${response.statusText}` }, { status: 400 });
        }

        const html = await response.text();

        // Extract title
        const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        let title = titleMatch ? titleMatch[1].trim() : '';
        
        const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
        if (ogTitleMatch) title = ogTitleMatch[1];

        // Extract meta description
        const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
        const metaDescription = metaDescMatch ? metaDescMatch[1] : '';

        // Extract og:description as summary
        const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
        const summary = ogDescMatch ? ogDescMatch[1] : metaDescription;

        // Extract author
        const authorMatch = html.match(/<meta[^>]*name=["']author["'][^>]*content=["']([^"']+)["']/i);
        const author = authorMatch ? authorMatch[1] : null;

        // Extract published date
        const dateMatch = html.match(/<meta[^>]*property=["']article:published_time["'][^>]*content=["']([^"']+)["']/i);
        const publishedDate = dateMatch ? new Date(dateMatch[1]) : null;

        // Extract og:image
        const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
        const featuredImage = ogImageMatch ? ogImageMatch[1] : null;

        // Extract main content
        const mainContent = extractMainContent(html);
        const contentBlocks = parseHtmlToBlocks(mainContent);

        // Extract images
        const images: Array<{ url: string; alt?: string }> = [];
        if (featuredImage) {
            images.push({ url: featuredImage, alt: 'Featured image' });
        }

        const scrapedData = {
            title: title.replace(/\s*[|\-–—]\s*[^|]*$/, '').trim(),
            author,
            publishedDate,
            summary,
            metaDescription,
            content: contentBlocks.filter(b => b.type !== 'image'),
            images,
            sourceUrl: url,
        };

        return NextResponse.json({ article: scrapedData });
    } catch (error) {
        console.error('Scrape error:', error);
        return NextResponse.json({ error: 'Failed to scrape article' }, { status: 500 });
    }
}

