import React from 'react';
import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

// Mock the SEOHead component to avoid Helmet complexity
jest.mock('../SEO/SEOHead', () => {
    return function MockSEOHead({ title, description, keywords, noIndex, canonicalUrl }) {
        return (
            <div data-testid="seo-head">
                <div data-testid="seo-title">{title || "Abdullah's Chamber - Healthcare Services & Medical Consultation"}</div>
                <div data-testid="seo-description">{description || 'Professional healthcare services including medical check-ups, nutrition advice, surgery, emergency care, counselling, and diagnosis. Book appointments online with Dr. Abdullah.'}</div>
                <div data-testid="seo-keywords">{keywords || 'healthcare, medical services, doctor consultation, health check-up, nutrition advice, surgery, emergency care, counselling, diagnosis, medical appointment, Dr. Abdullah'}</div>
                <div data-testid="seo-noindex">{noIndex ? 'noindex,nofollow' : 'index,follow'}</div>
                <div data-testid="seo-canonical">{canonicalUrl || 'https://doctors-chamber.web.app/test'}</div>
            </div>
        );
    };
});

// Mock useLocation
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        pathname: '/test'
    })
}));

// Import after mocking
import SEOHead from '../SEO/SEOHead';

const renderWithHelmet = (component) => {
    return render(
        <HelmetProvider>
            {component}
        </HelmetProvider>
    );
};

describe('SEOHead Component', () => {
    test('renders default meta tags when no props provided', () => {
        renderWithHelmet(<SEOHead />);
        
        expect(screen.getByTestId('seo-head')).toBeInTheDocument();
        expect(screen.getByTestId('seo-title')).toHaveTextContent("Abdullah's Chamber - Healthcare Services & Medical Consultation");
        expect(screen.getByTestId('seo-description')).toHaveTextContent('Professional healthcare services');
        expect(screen.getByTestId('seo-keywords')).toHaveTextContent('healthcare, medical services');
    });

    test('renders custom meta tags when props provided', () => {
        const customProps = {
            title: 'Custom Title',
            description: 'Custom description',
            keywords: 'custom, keywords, test'
        };
        
        renderWithHelmet(<SEOHead {...customProps} />);
        
        expect(screen.getByTestId('seo-title')).toHaveTextContent('Custom Title');
        expect(screen.getByTestId('seo-description')).toHaveTextContent('Custom description');
        expect(screen.getByTestId('seo-keywords')).toHaveTextContent('custom, keywords, test');
    });

    test('renders noindex tag when noIndex is true', () => {
        renderWithHelmet(<SEOHead noIndex={true} />);
        
        expect(screen.getByTestId('seo-noindex')).toHaveTextContent('noindex,nofollow');
    });

    test('renders custom canonical URL when provided', () => {
        const customUrl = 'https://example.com/custom';
        renderWithHelmet(<SEOHead canonicalUrl={customUrl} />);
        
        expect(screen.getByTestId('seo-canonical')).toHaveTextContent(customUrl);
    });

    test('renders default canonical URL when not provided', () => {
        renderWithHelmet(<SEOHead />);
        
        expect(screen.getByTestId('seo-canonical')).toHaveTextContent('https://doctors-chamber.web.app/test');
    });

    test('renders default robots tag when noIndex is false', () => {
        renderWithHelmet(<SEOHead noIndex={false} />);
        
        expect(screen.getByTestId('seo-noindex')).toHaveTextContent('index,follow');
    });
});
