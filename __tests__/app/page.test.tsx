import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Home from '@/app/page';

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('Home Page', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should render the initial state correctly', () => {
    render(<Home />);
    
    expect(screen.getByPlaceholderText('Paste YouTube, X, LinkedIn URL...')).toBeInTheDocument();
    expect(screen.getByText(/Open Links/)).toBeInTheDocument();
  });

  it('should show "Platform not supported" for unsupported URLs', async () => {
    render(<Home />);
    
    const input = screen.getByPlaceholderText('Paste YouTube, X, LinkedIn URL...');
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'https://example.com' } });
      vi.advanceTimersByTime(250); // Fast-forward debounce
    });

    expect(screen.getByText('Platform not supported. We currently support YouTube, X, LinkedIn, Instagram, and Facebook.')).toBeInTheDocument();
  });

  it('should show platform details for supported URLs', async () => {
    render(<Home />);
    
    const input = screen.getByPlaceholderText('Paste YouTube, X, LinkedIn URL...');
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'https://youtube.com/watch?v=dQw4w9WgXcQ' } });
      vi.advanceTimersByTime(250); // Fast-forward debounce
    });

    expect(screen.getByText('youtube')).toBeInTheDocument();
    expect(screen.getByText('App Ready')).toBeInTheDocument();
    expect(screen.getByText('https://youtube.com/watch?v=dQw4w9WgXcQ')).toBeInTheDocument();
  });

  it('should copy link to clipboard when "Copy Link" is clicked', async () => {
    render(<Home />);
    
    const input = screen.getByPlaceholderText('Paste YouTube, X, LinkedIn URL...');
    
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
});
