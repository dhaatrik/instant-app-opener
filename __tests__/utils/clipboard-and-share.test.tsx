import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Home from '@/app/page';

// Mock the url-parser
vi.mock('@/lib/url-parser', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/url-parser')>();
  return {
    ...actual,
    parseUrl: vi.fn(() => ({
      platform: 'youtube',
      id: '123',
      originalUrl: 'https://youtube.com/watch?v=123',
      deepLink: 'vnd.youtube://123',
      fallbackUrl: 'https://youtube.com/watch?v=123',
      color: '#FF0000',
      glowClass: 'mock-glow-class',
    })),
    encodeDeepLinkId: vi.fn(() => 'mock-encoded-id'),
  };
});

describe('Browser API Interactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should successfully copy link to clipboard', async () => {
    render(<Home />);
    const input = screen.getByPlaceholderText(/Paste YouTube, X, LinkedIn URL.../i);

    fireEvent.change(input, { target: { value: 'https://youtube.com/watch?v=123' } });
    
    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(screen.getByText('Copy Link')).toBeInTheDocument();

    const copyButton = screen.getByText('Copy Link').closest('button');
    await act(async () => {
      fireEvent.click(copyButton!);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('/open/mock-encoded-id'));
  });

  it('should fallback to copy if share is not supported', async () => {
    // Ensure navigator.share is undefined
    Object.assign(navigator, { share: undefined });

    render(<Home />);
    const input = screen.getByPlaceholderText(/Paste YouTube, X, LinkedIn URL.../i);

    await act(async () => {
      fireEvent.change(input, { target: { value: 'https://youtube.com/watch?v=123' } });
      vi.advanceTimersByTime(250);
    });

    expect(screen.getByText('Share')).toBeInTheDocument();

    const shareButton = screen.getByText('Share').closest('button');
    await act(async () => {
      fireEvent.click(shareButton!);
    });

    // Should call clipboard.writeText as a fallback
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('/open/mock-encoded-id'));
  });
});
