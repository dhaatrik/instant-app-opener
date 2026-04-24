import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import RootLayout, { metadata, viewport } from '../../app/layout';
import React from 'react';

vi.mock('next/font/google', () => ({
  Inter: () => ({
    variable: '--mock-inter-variable',
  }),
}));

describe('RootLayout', () => {
  let originalError: typeof console.error;

  beforeAll(() => {
    originalError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('In HTML, <html> cannot be a child of <div>')) {
        return;
      }
      originalError.call(console, ...args);
    };
  });

  afterAll(() => {
    console.error = originalError;
  });

  it('renders children correctly', () => {
    // We can also test children rendering using direct function call, avoiding the HTML in div warning completely.
    const element = RootLayout({ children: <div data-testid="child-element">Test Child</div> });
    expect(element.props.children.props.children).toEqual(<div data-testid="child-element">Test Child</div>);
  });

  it('applies correct classes to html and body tags', () => {
    const element = RootLayout({ children: <div data-testid="child">Test</div> });

    expect(element.type).toBe('html');
    expect(element.props.lang).toBe('en');
    expect(element.props.className).toContain('dark');
    expect(element.props.className).toContain('--mock-inter-variable');

    const bodyElement = element.props.children;
    expect(bodyElement.type).toBe('body');
    expect(bodyElement.props.className).toContain('font-sans');
    expect(bodyElement.props.className).toContain('antialiased');
    expect(bodyElement.props.className).toContain('bg-[#050505]');
    expect(bodyElement.props.className).toContain('text-white');
    expect(bodyElement.props.suppressHydrationWarning).toBe(true);
  });

  describe('metadata', () => {
    it('contains the correct title and description', () => {
      expect(metadata.title).toBe('Instant App Opener | Open Social Links in App');
      expect(metadata.description).toBe('Convert standard social media URLs into mobile-app-compatible URI schemes instantly.');
    });

    it('contains the correct authors', () => {
      expect(metadata.authors).toEqual([{ name: 'Dhaatrik Chowdhury', url: 'https://github.com/dhaatrik' }]);
    });

    it('contains correct icons and apple web app info', () => {
      expect(metadata.manifest).toBe('/manifest.json');
      expect(metadata.icons).toEqual({
        icon: '/icon.png',
        apple: '/icon.png',
      });
      expect(metadata.appleWebApp).toEqual({
        capable: true,
        statusBarStyle: 'default',
        title: 'App Opener',
      });
    });
  });

  describe('viewport', () => {
    it('contains the correct themeColor', () => {
      expect(viewport.themeColor).toBe('#050505');
    });
  });
});
