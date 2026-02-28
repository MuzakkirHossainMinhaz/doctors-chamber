import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from '../Home/Home';

// Mock child components
jest.mock('../Home/Banner/Banner', () => {
    return function MockBanner() {
        return <div data-testid="banner">Banner Component</div>;
    };
});

jest.mock('../Home/Services/Services', () => {
    return function MockServices() {
        return <div data-testid="services">Services Component</div>;
    };
});

jest.mock('../Home/Contact/Contact', () => {
    return function MockContact() {
        return <div data-testid="contact">Contact Component</div>;
    };
});

const renderWithProviders = (component) => {
    return render(
        <HelmetProvider>
            <BrowserRouter>
                {component}
            </BrowserRouter>
        </HelmetProvider>
    );
};

describe('Home Component', () => {
    beforeEach(() => {
        // Clear helmet state before each test
        document.head.innerHTML = '';
    });

    test('renders home page with all components', () => {
        renderWithProviders(<Home />);
        
        expect(screen.getByTestId('banner')).toBeInTheDocument();
        expect(screen.getByTestId('services')).toBeInTheDocument();
        expect(screen.getByTestId('contact')).toBeInTheDocument();
    });

    test('renders correct SEO meta tags', () => {
        renderWithProviders(<Home />);
        
        expect(document.title).toBe("Abdullah's Chamber - Professional Healthcare Services");
        
        const description = document.querySelector('meta[name="description"]');
        expect(description).toBeInTheDocument();
        expect(description.getAttribute('content')).toContain('Comprehensive healthcare services');
        
        const keywords = document.querySelector('meta[name="keywords"]');
        expect(keywords).toBeInTheDocument();
        expect(keywords.getAttribute('content')).toContain('healthcare, medical services');
    });

    test('renders structured data for medical clinic', () => {
        renderWithProviders(<Home />);
        
        const structuredData = document.querySelector('script[type="application/ld+json"]');
        expect(structuredData).toBeInTheDocument();
        
        const data = JSON.parse(structuredData.textContent);
        expect(data['@type']).toBe('MedicalClinic');
        expect(data.name).toBe("Abdullah's Chamber");
        expect(data.acceptsReservations).toBe('true');
        expect(data.hasOfferCatalog).toBeDefined();
    });

    test('includes service offerings in structured data', () => {
        renderWithProviders(<Home />);
        
        const structuredData = document.querySelector('script[type="application/ld+json"]');
        const data = JSON.parse(structuredData.textContent);
        
        expect(data.hasOfferCatalog.itemListElement).toHaveLength(6);
        expect(data.hasOfferCatalog.itemListElement[0].itemOffered.name).toBe('Medical and Health Check-ups');
        expect(data.hasOfferCatalog.itemListElement[0].price).toBe('12');
    });

    test('renders Open Graph tags', () => {
        renderWithProviders(<Home />);
        
        const ogTitle = document.querySelector('meta[property="og:title"]');
        expect(ogTitle).toBeInTheDocument();
        expect(ogTitle.getAttribute('content')).toBe("Abdullah's Chamber - Professional Healthcare Services");
        
        const ogType = document.querySelector('meta[property="og:type"]');
        expect(ogType).toBeInTheDocument();
        expect(ogType.getAttribute('content')).toBe('website');
    });

    test('renders Twitter Card tags', () => {
        renderWithProviders(<Home />);
        
        const twitterCard = document.querySelector('meta[name="twitter:card"]');
        expect(twitterCard).toBeInTheDocument();
        expect(twitterCard.getAttribute('content')).toBe('summary_large_image');
        
        const twitterSite = document.querySelector('meta[name="twitter:site"]');
        expect(twitterSite).toBeInTheDocument();
        expect(twitterSite.getAttribute('content')).toBe('@doctorschamber');
    });

    test('renders canonical URL', () => {
        renderWithProviders(<Home />);
        
        const canonical = document.querySelector('link[rel="canonical"]');
        expect(canonical).toBeInTheDocument();
        expect(canonical.getAttribute('href')).toContain('https://doctors-chamber.web.app');
    });

    test('renders favicon and app icons', () => {
        renderWithProviders(<Home />);
        
        const favicon = document.querySelector('link[rel="icon"]');
        expect(favicon).toBeInTheDocument();
        
        const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
        expect(appleTouchIcon).toBeInTheDocument();
        expect(appleTouchIcon.getAttribute('sizes')).toBe('180x180');
    });

    test('renders preconnect links for performance', () => {
        renderWithProviders(<Home />);
        
        const preconnect = document.querySelector('link[rel="preconnect"]');
        expect(preconnect).toBeInTheDocument();
        expect(preconnect.getAttribute('href')).toContain('fonts.googleapis.com');
        
        const dnsPrefetch = document.querySelector('link[rel="dns-prefetch"]');
        expect(dnsPrefetch).toBeInTheDocument();
        expect(dnsPrefetch.getAttribute('href')).toContain('www.google-analytics.com');
    });
});
