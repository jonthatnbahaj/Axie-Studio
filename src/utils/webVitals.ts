import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

class WebVitalsTracker {
  private metrics: Map<string, WebVitalsMetric> = new Map();
  private callbacks: ((metric: WebVitalsMetric) => void)[] = [];

  constructor() {
    this.initializeTracking();
  }

  private initializeTracking() {
    // Track Core Web Vitals
    getCLS(this.handleMetric.bind(this));
    getFID(this.handleMetric.bind(this));
    getFCP(this.handleMetric.bind(this));
    getLCP(this.handleMetric.bind(this));
    getTTFB(this.handleMetric.bind(this));
  }

  private handleMetric(metric: any) {
    const webVitalMetric: WebVitalsMetric = {
      name: metric.name,
      value: metric.value,
      rating: this.getRating(metric.name, metric.value),
      delta: metric.delta,
      id: metric.id
    };

    this.metrics.set(metric.name, webVitalMetric);
    
    // Notify callbacks
    this.callbacks.forEach(callback => callback(webVitalMetric));
    
    // Send to analytics (if available)
    this.sendToAnalytics(webVitalMetric);
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Web Vital: ${metric.name}`, {
        value: `${Math.round(metric.value)}${this.getUnit(metric.name)}`,
        rating: webVitalMetric.rating,
        target: this.getTarget(metric.name)
      });
    }
  }

  private getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = {
      CLS: { good: 0.1, poor: 0.25 },
      FID: { good: 100, poor: 300 },
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      TTFB: { good: 800, poor: 1800 }
    };

    const threshold = thresholds[name as keyof typeof thresholds];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  private getUnit(name: string): string {
    return name === 'CLS' ? '' : 'ms';
  }

  private getTarget(name: string): string {
    const targets = {
      CLS: '< 0.1',
      FID: '< 100ms',
      FCP: '< 1.8s',
      LCP: '< 2.5s',
      TTFB: '< 800ms'
    };
    return targets[name as keyof typeof targets] || '';
  }

  private sendToAnalytics(metric: WebVitalsMetric) {
    // Send to Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.value),
        metric_rating: metric.rating,
        custom_parameter_1: metric.id
      });
    }

    // Send to other analytics services
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'web_vital',
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: metric.rating,
        metric_id: metric.id
      });
    }
  }

  public onMetric(callback: (metric: WebVitalsMetric) => void) {
    this.callbacks.push(callback);
  }

  public getMetrics(): Map<string, WebVitalsMetric> {
    return new Map(this.metrics);
  }

  public getMetric(name: string): WebVitalsMetric | undefined {
    return this.metrics.get(name);
  }

  public getOverallScore(): number {
    const metrics = Array.from(this.metrics.values());
    if (metrics.length === 0) return 0;

    const scores = metrics.map(metric => {
      switch (metric.rating) {
        case 'good': return 100;
        case 'needs-improvement': return 50;
        case 'poor': return 0;
        default: return 0;
      }
    });

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  public generateOptimizationSuggestions(): string[] {
    const suggestions: string[] = [];
    const metrics = this.getMetrics();

    const cls = metrics.get('CLS');
    if (cls && cls.rating !== 'good') {
      suggestions.push('Optimize Cumulative Layout Shift by setting explicit dimensions for images and ads');
    }

    const fid = metrics.get('FID');
    if (fid && fid.rating !== 'good') {
      suggestions.push('Improve First Input Delay by reducing JavaScript execution time');
    }

    const fcp = metrics.get('FCP');
    if (fcp && fcp.rating !== 'good') {
      suggestions.push('Optimize First Contentful Paint by reducing render-blocking resources');
    }

    const lcp = metrics.get('LCP');
    if (lcp && lcp.rating !== 'good') {
      suggestions.push('Improve Largest Contentful Paint by optimizing images and critical resources');
    }

    const ttfb = metrics.get('TTFB');
    if (ttfb && ttfb.rating !== 'good') {
      suggestions.push('Reduce Time to First Byte by optimizing server response time');
    }

    return suggestions;
  }
}

// Create singleton instance
export const webVitalsTracker = new WebVitalsTracker();

// Export for use in components
export default webVitalsTracker;