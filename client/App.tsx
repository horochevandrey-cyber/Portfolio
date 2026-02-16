import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect, useRef } from "react";

const queryClient = new QueryClient();

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const state = useRef<'default' | 'hover' | 'click' | 'text'>('default');

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Smooth animation loop with requestAnimationFrame
    let rafId: number;

    const animate = () => {
      if (!cursor) return;

      // Easing interpolation for smooth follow
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15;

      // Use CSS transform for better performance
      cursor.style.left = cursorPos.current.x + 'px';
      cursor.style.top = cursorPos.current.y + 'px';

      rafId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    // Check if element is interactive
    const isInteractive = (target: Element | null): boolean => {
      if (!target) return false;

      const interactiveTags = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'];
      if (interactiveTags.includes((target as HTMLElement).tagName)) return true;

      const classList = (target as HTMLElement).classList;

      // Check for interactive classes
      if (Array.from(classList).some(cls => ['group', 'hover:scale-103', 'hover:scale-110', 'cursor-pointer'].includes(cls))) return true;

      if ((target as HTMLElement).getAttribute('role') === 'button') return true;
      if ((target as HTMLElement).getAttribute('data-cursor') === 'pointer') return true;

      return false;
    };

    // Check if element is text
    const isText = (target: Element | null): boolean => {
      if (!target) return false;
      const textTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'LABEL', 'LI', 'TD', 'TH'];
      return textTags.includes((target as HTMLElement).tagName);
    };

    const handleMouseOver = (e: MouseEvent) => {
      let target: Element | null = e.target as Element;

      // Check target and parents up to 3 levels
      for (let i = 0; i < 3; i++) {
        if (isInteractive(target)) {
          if (state.current !== 'hover') {
            state.current = 'hover';
            cursor.classList.add('hover');
            cursor.classList.remove('text', 'click');
          }
          return;
        }
        if (isText(target)) {
          if (state.current !== 'text' && state.current !== 'hover') {
            state.current = 'text';
            cursor.classList.add('text');
            cursor.classList.remove('hover', 'click');
          }
          return;
        }
        target = target?.parentElement || null;
      }

      // Default state
      if (state.current !== 'default') {
        state.current = 'default';
        cursor.classList.remove('hover', 'text', 'click');
      }
    };

    const handleMouseDown = () => {
      state.current = 'click';
      if (cursor) {
        cursor.classList.add('click');
        cursor.classList.remove('hover');
      }
    };

    const handleMouseUp = () => {
      state.current = 'default';
      if (cursor) {
        cursor.classList.remove('click');
      }
      // Re-check if we're still over something interactive
      const event = new MouseEvent('mouseover', { bubbles: true });
      document.elementFromPoint(mousePos.current.x, mousePos.current.y)?.dispatchEvent(event);
    };

    // Start animation loop
    animate();

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CustomCursor />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
