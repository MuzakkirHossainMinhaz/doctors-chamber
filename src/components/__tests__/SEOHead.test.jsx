import React from 'react';
import { render, screen } from '@testing-library/react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import SEOHead from '../SEO/SEOHead';

// Mock useLocation
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        pathname: '/test'
    })
}));

const renderWithHelmet = (component) => {
    return render(
        <HelmetProvider>
            {component}
        </HelmetProvider>
    );
};

describe('SEOHead Component', () => {
    beforeEach(() => {
        // Clear helmet state before each test
        document.head.innerHTML = '';
    });

    afterEach(() => {
        // Clean up after each test
        Helmet.clearContext();
    });

    test('renders default meta tags when no props provided', () => {
        renderWithHelmet(<SEOHead />);
        
        // Wait for Helmet to update the DOM
        setTimeout(() => {
            expect(document.title).toBe("Abdullah's Chamber - Healthcare Services & Medical Consultation");
            
            const description = document.querySelector('meta[name="description"]');
            expect(description).toBeInTheDocument();
            expect(description.getAttribute('content')).toContain('Professional healthcare services');
            
            const keywords = document.querySelector('meta[name="keywords"]');
            expect(keywords).toBeInTheDocument();
            expect(keywords.getAttribute('content')).toContain('healthcare, medical services');
        }, 0);
    });

    test('renders custom meta tags when props provided', () => {
        const customProps = {
            title: 'Custom Title',
            description: 'Custom description',
            keywords: 'custom, keywords, test'
        };
        
        renderWithHelmet(<SEOHead {...customProps} />);
        
        setTimeout(() => {
            expect(document.title).toBe('Custom Title');
            
            const description = document.querySelector('meta[name="description"]');
            expect(description.getAttribute('content')).toBe('Custom description');
            
            const keywords = document.querySelector('meta[name="keywords"]');
            expect(keywords.getAttribute('content')).toBe('custom, keywords, test');
        }, 0);
    });

    test('renders Open Graph tags', () => {
        renderWithHelmet(<SEOHead title="Test Title" />);
        
        setTimeout(() => {
            const ogTitle = document.querySelector('meta[property="og:title"]');
            expect(ogTitle).toBeInTheDocument();
            expect(ogTitle.getAttribute('content')).toBe('Test Title');
            
            const ogType = document.querySelector('meta[property="og:type"]');
            expect(ogType).toBeInTheDocument();
            expect(ogType.getAttribute('content')).toBe('website');
            
            const ogSiteName = document.querySelector('meta[property="og:site_name"]');
            expect(ogSiteName).toBeInTheDocument();
            expect(ogSiteName.getAttribute('content')).toBe("Abdullah's Chamber");
        }, 0);
    });

    test('renders Twitter Card tags', () => {
        renderWithHelmet(<SEOHead />);
        
        setTimeout(() => {
            const twitterCard = document.querySelector('meta[name="twitter:card"]');
            expect(twitterCard).toBeInTheDocument();
            expect(twitterCard.getAttribute('content')).toBe('summary_large_image');
            
            const twitterSite = document.querySelector('meta[name="twitter:site"]');
            expect(twitterSite).toBeInTheDocument();
            expect(twitterSite.getAttribute('content')).toBe('@doctorschamber');
        }, 0);
    });

    test('renders structured data', () => {
        renderWithHelmet(<SEOHead />);
        
        setTimeout(() => {
            const structuredData = document.querySelector('script[type="application/ld+json"]');
            expect(structuredData).toBeInTheDocument();
            
            const data = JSON.parse(structuredData.textContent);
            expect(data['@context']).toBe('https://schema.org');
            expect(data['@type']).toBe('MedicalOrganization');
            expect(data.name).toBe("Abdullah's Chamber");
        }, 0);
    });

    test('renders custom structured data when provided', () => {
        const customStructuredData = {
            '@type': 'MedicalClinic',
            'customField': 'custom value'
        };
        
        renderWithHelmet(<SEOHead structuredData={customStructuredData} />);
        
        setTimeout(() => {
            const structuredData = document.querySelector('script[type="application/ld+json"]');
            const data = JSON.parse(structuredData.textContent);
            
            expect(data['@type']).toBe('MedicalClinic');
            expect(data.customField).toBe('custom value');
        }, 0);
    });

    test('renders canonical URL', () => {
        renderWithHelmet(<SEOHead />);
        
        setTimeout(() => {
            const canonical = document.querySelector('link[rel="canonical"]');
            expect(canonical).toBeInTheDocument();
            expect(canonical.getAttribute('href')).toContain('https://doctors-chamber.web.app/test');
        }, 0);
    });

    test('renders custom canonical URL when provided', () => {
        const customUrl = 'https://example.com/custom';
        renderWithHelmet(<SEOHead canonicalUrl={customUrl} />);
        
        setTimeout(() => {
            const canonical = document.querySelector('link[rel="canonical"]');
            expect(canonical.getAttribute('href')).toBe(customUrl);
        }, 0);
    });

    test('renders noindex tag when noIndex is true', () => {
        renderWithHelmet(<SEOHead noIndex={true} />);
        
        setTimeout(() => {
            const robots = document.querySelector('meta[name="robots"]');
            expect(robots).toBeInTheDocument();
            expect(robots.getAttribute('content')).toBe('noindex,nofollow');
        }, 0);
    });

    test('renders favicon links', () => {
        renderWithHelmet(<SEOHead />);
        
        setTimeout(() => {
            const favicon = document.querySelector('link[rel="icon"]');
            expect(favicon).toBeInTheDocument();
            expect(favicon.getAttribute('href')).toBe('/favicon.ico');
            
            const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
            expect(appleTouchIcon).toBeInTheDocument();
            expect(appleTouchIcon.getAttribute('sizes')).toBe('180x180');
        }, 0);
    });

    test('renders preconnect and dns-prefetch links', () => {
        renderWithHelmet(<SEOHead />);
        
        setTimeout(() => {
            const preconnect = document.querySelector('link[rel="preconnect"]');
            expect(preconnect).toBeInTheDocument();
            expect(preconnect.getAttribute('href')).toContain('fonts.googleapis.com');
            
            const dnsPrefetch = document.querySelector('link[rel="dns-prefetch"]');
            expect(dnsPrefetch).toBeInTheDocument();
            expect(dnsPrefetch.getAttribute('href')).toContain('www.google-analytics.com');
        }, 0);
    });
});
