import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

const PerformanceOptimizer: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [optimizations, setOptimizations] = useState<string[]>([]);

  useEffect(() => {
    // Measure Core Web Vitals
    const measurePerformance = () => {
      if ('performance' in window) {
        // Get navigation timing
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        // Calculate TTFB
        const ttfb = navigation.responseStart - navigation.requestStart;
        
        // Get paint timing
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
        
        // Simulate other metrics (in real app, use web-vitals library)
        const currentMetrics: PerformanceMetrics = {
          fcp: fcp,
          lcp: fcp + Math.random() * 1000, // Simulate LCP
          fid: Math.random() * 100, // Simulate FID
          cls: Math.random() * 0.1, // Simulate CLS
          ttfb: ttfb
        };
        
        setMetrics(currentMetrics);
        
        // Generate optimization suggestions
        const suggestions = generateOptimizations(currentMetrics);
        setOptimizations(suggestions);
        
        // Apply automatic optimizations
        applyOptimizations(currentMetrics);
      }
    };

    // Measure after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    return () => {
      window.removeEventListener('load', measurePerformance);
    };
  }, []);

  const generateOptimizations = (metrics: PerformanceMetrics): string[] => {
    const suggestions: string[] = [];
    
    if (metrics.fcp > 2500) {
      suggestions.push('Optimize First Contentful Paint by reducing render-blocking resources');
    }
    
    if (metrics.lcp > 4000) {
      suggestions.push('Improve Largest Contentful Paint by optimizing images and critical resources');
    }
    
    if (metrics.fid > 300) {
      suggestions.push('Reduce First Input Delay by optimizing JavaScript execution');
    }
    
    if (metrics.cls > 0.25) {
      suggestions.push('Minimize Cumulative Layout Shift by setting image dimensions');
    }
    
    if (metrics.ttfb > 800) {
      suggestions.push('Improve Time to First Byte by optimizing server response time');
    }
    
    return suggestions;
  };

  const applyOptimizations = (metrics: PerformanceMetrics) => {
    // Lazy load images below the fold
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Preload critical resources
    if (metrics.lcp > 2500) {
      const criticalResources = [
        '/Axiestudiologo.jpg',
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
      ];
      
      criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.includes('.jpg') ? 'image' : 'style';
        document.head.appendChild(link);
      });
    }
    
    // Optimize third-party scripts
    const scripts = document.querySelectorAll('script[src*="google"]');
    scripts.forEach(script => {
      script.setAttribute('loading', 'lazy');
    });
    
    // Enable compression hints
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection && connection.effectiveType === 'slow-2g') {
        // Reduce quality for slow connections
        document.body.classList.add('low-bandwidth');
      }
    }
  };

  // Only show in development
  if (!metrics) {
    return null;
  }

  // Performance optimization runs silently in background
  return null;
};

export default PerformanceOptimizer;