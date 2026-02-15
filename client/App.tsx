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
  const isActive = useRef(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Smooth animation loop with requestAnimationFrame
    let rafId: number;
    
    const animate = () => {
      if (!cursor) return;
      
      // Easing interpolation for smooth follow
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.25;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.25;
      
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
      if (Array.from(classList).some(cls => ['group', 'hover:scale-103', 'hover:scale-110'].includes(cls))) return true;

      if ((target as HTMLElement).getAttribute('role') === 'button') return true;

      return false;
    };

    const handleMouseOver = (e: MouseEvent) => {
      let target: Element | null = e.target as Element;
      
      // Check target and parents up to 3 levels
      for (let i = 0; i < 3; i++) {
        if (isInteractive(target)) {
          if (!isActive.current) {
            cursor.classList.add('active');
            isActive.current = true;
          }
          return;
        }
        target = target?.parentElement || null;
      }

      // Not interactive - remove active
      if (isActive.current) {
        cursor.classList.remove('active');
        isActive.current = false;
      }
    };

    // Start animation loop
    animate();
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
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
