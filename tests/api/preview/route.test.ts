import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/preview/route';
import { NextRequest } from 'next/server';

describe('Preview API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if URL is missing', async () => {
    const request = new Request('http://localhost/api/preview');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('URL is required');
  });

  it('should extract metadata correctly from HTML', async () => {
    const html = `
      <html>
        <head>
          <title>Test Title</title>
          <meta property="og:description" content="Test Description" />
          <meta property="og:image" content="https://example.com/image.jpg" />
        </head>
      </html>
    `;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(html),
    });

    const request = new Request('http://localhost/api/preview?url=https://youtube.com/watch?v=123');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.title).toBe('Test Title');
    expect(data.description).toBe('Test Description');
    expect(data.image).toBe('https://example.com/image.jpg');
  });

  it('should return 500 if fetch fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    const request = new Request('http://localhost/api/preview?url=https://youtube.com/watch?v=123');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch preview');
  });

  it('should return 500 on unexpected error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const request = new Request('http://localhost/api/preview?url=https://youtube.com/watch?v=123');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch preview');
  });
});