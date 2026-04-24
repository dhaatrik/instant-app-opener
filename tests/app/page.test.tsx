import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Home from '@/app/page';

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
    readText: vi.fn(),
  },
  share: vi.fn(),
});

describe('Home Page', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ error: true }),
      })
    ) as any;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should render the initial state correctly', () => {
    render(<Home />);
    
    expect(screen.getByPlaceholderText(/Paste YouTube, X, TikTok, Spotify URL.../i)).toBeInTheDocument();
    expect(screen.getByText(/Open Links/)).toBeInTheDocument();
  });

  it('should show "Platform not supported" for unsupported URLs', async () => {
    render(<Home />);
    
    const input = screen.getByPlaceholderText(/Paste YouTube, X, TikTok, Spotify URL.../i);
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'https://example.com' } });
      vi.advanceTimersByTime(250); // Fast-forward debounce
    });

    expect(screen.getByText('Platform not supported. We currently support YouTube, X, LinkedIn, Instagram, Facebook, TikTok, and Spotify.')).toBeInTheDocument();
  });

  it('should show platform details for supported URLs', async () => {
    render(<Home />);
    
    const input = screen.getByPlaceholderText(/Paste YouTube, X, TikTok, Spotify URL.../i);
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'https://youtube.com/watch?v=dQw4w9WgXcQ' } });
      vi.advanceTimersByTime(250); // Fast-forward debounce
    });

    // Wait for fetch to resolve
    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByText('youtube')).toBeInTheDocument();
    expect(screen.getByText('Certified App')).toBeInTheDocument();
    expect(screen.getByText('https://youtube.com/watch?v=dQw4w9WgXcQ')).toBeInTheDocument();
  });

  it('should show TikTok details for valid TikTok URLs', async () => {
    render(<Home />);
    
    const input = screen.getByPlaceholderText(/Paste YouTube, X, TikTok, Spotify URL.../i);
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'https://www.tiktok.com/@user/video/1234567890' } });
      vi.advanceTimersByTime(250);
    });

    expect(screen.getByText('tiktok')).toBeInTheDocument();
  });

  it('should show Spotify details for valid Spotify URLs', async () => {
    render(<Home />);
    
    const input = screen.getByPlaceholderText(/Paste YouTube, X, TikTok, Spotify URL.../i);
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'https://open.spotify.com/track/1234567890' } });
      vi.advanceTimersByTime(250);
    });

    expect(screen.getByText('spotify')).toBeInTheDocument();
  });

  it('should copy link to clipboard when "Copy Link" is clicked', async () => {
    render(<Home />);
    
    const input = screen.getByPlaceholderText(/Paste YouTube, X, TikTok, Spotify URL.../i);
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'https://youtube.com/watch?v=dQw4w9WgXcQ' } });
      vi.advanceTimersByTime(250);
    });

    const copyButton = screen.getByText('Copy Link');
    
    await act(async () => {
      fireEvent.click(copyButton);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(screen.getByText('Link Copied!')).toBeInTheDocument();
  });

  it('should clear the input when clear button is clicked', async () => {
    render(<Home />);
    
    const input = screen.getByPlaceholderText(/Paste YouTube, X, TikTok, Spotify URL.../i) as HTMLInputElement;
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'https://youtube.com/watch?v=dQw4w9WgXcQ' } });
      vi.advanceTimersByTime(250);
    });

    expect(input.value).toBe('https://youtube.com/watch?v=dQw4w9WgXcQ');

    // Find the button containing the X icon
    const clearButton = screen.getByRole('button', { name: '' }).parentElement?.querySelector('svg.lucide-x')?.parentElement;
    
    if (clearButton) {
      await act(async () => {
        fireEvent.click(clearButton);
      });
      expect(input.value).toBe('');
    }
  });

  it('should paste from clipboard when paste button is clicked', async () => {
    const pasteText = 'https://x.com/user/status/123';
    (navigator.clipboard.readText as any) = vi.fn().mockResolvedValue(pasteText);
    
    render(<Home />);
    
    const pasteButton = screen.getByTitle('Paste');
    
    await act(async () => {
      fireEvent.click(pasteButton);
    });

    const input = screen.getByPlaceholderText(/Paste YouTube, X, TikTok, Spotify URL.../i) as HTMLInputElement;
    expect(input.value).toBe(pasteText);
  });

  it('should show QR code when QR button is clicked', async () => {
    render(<Home />);
    
    const input = screen.getByPlaceholderText(/Paste YouTube, X, TikTok, Spotify URL.../i);
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'https://youtube.com/watch?v=dQw4w9WgXcQ' } });
      vi.advanceTimersByTime(250);
    });

    const qrButton = screen.getByTitle('Show QR Code');
    
    await act(async () => {
      fireEvent.click(qrButton);
    });

    expect(screen.getByText('Scan the Sauce')).toBeInTheDocument();
  });

  it('should call navigator.share when share button is clicked', async () => {
    render(<Home />);
    
    const input = screen.getByPlaceholderText(/Paste YouTube, X, TikTok, Spotify URL.../i);
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'https://youtube.com/watch?v=dQw4w9WgXcQ' } });
      vi.advanceTimersByTime(250);
    });

    const shareButton = screen.getByText('Share');
    
    await act(async () => {
      fireEvent.click(shareButton);
    });

    expect(navigator.share).toHaveBeenCalled();
  });

  it('should show recent drops from localStorage', async () => {
    const recentDrops = ['https://youtube.com/watch?v=dQw4w9WgXcQ'];
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue(JSON.stringify(recentDrops)),
      setItem: vi.fn(),
    });

    render(<Home />);
    
    expect(screen.getByText('Recent Drops:')).toBeInTheDocument();
    expect(screen.getByText('youtube.com')).toBeInTheDocument();
  });

  it('should handle Ctrl+C keyboard shortcut', async () => {
    render(<Home />);
    
    const input = screen.getByPlaceholderText(/Paste YouTube, X, TikTok, Spotify URL.../i);
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'https://youtube.com/watch?v=dQw4w9WgXcQ' } });
      vi.advanceTimersByTime(250);
    });

    await act(async () => {
      fireEvent.keyDown(window, { key: 'c', ctrlKey: true });
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  it('should handle Ctrl+S keyboard shortcut', async () => {
    render(<Home />);
    
    const input = screen.getByPlaceholderText(/Paste YouTube, X, TikTok, Spotify URL.../i);
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'https://youtube.com/watch?v=dQw4w9WgXcQ' } });
      vi.advanceTimersByTime(250);
    });

    await act(async () => {
      fireEvent.keyDown(window, { key: 's', ctrlKey: true });
    });

    expect(navigator.share).toHaveBeenCalled();
  });

  it('should show error message when pasting from clipboard fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (navigator.clipboard.readText as any) = vi.fn().mockRejectedValue(new Error('Clipboard blocked'));
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');

    render(<Home />);

    const pasteButton = screen.getByTitle('Paste');

    await act(async () => {
      fireEvent.click(pasteButton);
    });

    // Resolve the readText promise rejection
    await act(async () => {
      await Promise.resolve();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(screen.getByText('Clipboard access blocked. Please paste manually (Cmd/Ctrl+V).')).toBeInTheDocument();

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 3000);

    consoleErrorSpy.mockRestore();
    setTimeoutSpy.mockRestore();
  });

});
