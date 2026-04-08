import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import OpenPage from '@/app/open/[id]/page';
import * as navigation from 'next/navigation';
import * as urlParser from '@/lib/url-parser';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: vi.fn(),
}));

// Mock url-parser
vi.mock('@/lib/url-parser', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/url-parser')>();
  return {
    ...actual,
    decodeDeepLinkId: vi.fn(),
  };
});

describe('OpenPage', () => {
  let originalLocation: Location;
  let originalUserAgent: string;

  beforeEach(() => {
    originalLocation = window.location;
    originalUserAgent = navigator.userAgent;
    
    // Mock window.location
    delete (window as any).location;
    window.location = { ...originalLocation, href: '' } as Location;
    
    vi.useFakeTimers();
  });

  afterEach(() => {
    window.location = originalLocation;
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    });
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should handle invalid id parameter gracefully', () => {
    vi.mocked(navigation.useParams).mockReturnValue({ id: undefined });
    
    render(<OpenPage />);
    
    expect(screen.getByText('Invalid link')).toBeInTheDocument();
  });

  it('should handle invalid decoded data gracefully', () => {
    vi.mocked(navigation.useParams).mockReturnValue({ id: 'invalid-id' });
    vi.mocked(urlParser.decodeDeepLinkId).mockReturnValue(null);
    
    render(<OpenPage />);
    
    expect(screen.getByText('Invalid link data')).toBeInTheDocument();
  });

  it('should redirect to standard web URL immediately on desktop', () => {
    vi.mocked(navigation.useParams).mockReturnValue({ id: 'valid-id' });
    vi.mocked(urlParser.decodeDeepLinkId).mockReturnValue({
      p: 'youtube',
      u: 'https://youtube.com/watch?v=123',
      d: 'vnd.youtube://123',
    });

    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      configurable: true,
    });

    render(<OpenPage />);

    expect(screen.getByText('Redirecting to web...')).toBeInTheDocument();
    expect(window.location.href).toBe('https://youtube.com/watch?v=123');
  });

  it('should attempt deep link and fallback to app store after timeout on mobile', () => {
    vi.mocked(navigation.useParams).mockReturnValue({ id: 'valid-id' });
    vi.mocked(urlParser.decodeDeepLinkId).mockReturnValue({
      p: 'youtube',
      u: 'https://youtube.com/watch?v=123',
      d: 'vnd.youtube://123',
    });

    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      configurable: true,
    });

    render(<OpenPage />);

    expect(screen.getByText('Opening app...')).toBeInTheDocument();
    expect(window.location.href).toBe('vnd.youtube://123');

    // Fast-forward 2 seconds
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText('App not found. Redirecting...')).toBeInTheDocument();
    expect(window.location.href).toBe('https://apps.apple.com/app/youtube/id544007664');
  });
});
