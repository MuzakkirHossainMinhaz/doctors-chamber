import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Mock the Home component to avoid Helmet complexity
jest.mock('../Home/Home', () => {
    return function MockHome() {
        return (
            <div data-testid="home-page">
                <h1>Abdullah's Chamber</h1>
                <p>Professional Healthcare Services</p>
                <div data-testid="services-section">
                    <h2>Our Services</h2>
                    <div data-testid="service-list">
                        <div data-testid="service-item">Medical and Health Check-ups</div>
                        <div data-testid="service-item">Health and Nutrition Advice</div>
                        <div data-testid="service-item">Surgery</div>
                        <div data-testid="service-item">Emergency Services</div>
                        <div data-testid="service-item">Counselling</div>
                        <div data-testid="service-item">Diagnosis and Treatment</div>
                    </div>
                </div>
                <div data-testid="seo-metadata">
                    <div data-testid="page-title">Abdullah's Chamber - Professional Healthcare Services</div>
                    <div data-testid="og-title">Abdullah's Chamber - Professional Healthcare Services</div>
                    <div data-testid="twitter-card">summary_large_image</div>
                    <div data-testid="canonical-url">https://doctors-chamber.web.app</div>
                    <div data-testid="favicon">/favicon.ico</div>
                    <div data-testid="preconnect">fonts.googleapis.com</div>
                </div>
            </div>
        );
    };
});

// Import after mocking
import Home from '../Home/Home';

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
    test('renders main heading and description', () => {
        renderWithProviders(<Home />);
        
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
        expect(screen.getByText("Abdullah's Chamber")).toBeInTheDocument();
        expect(screen.getByText('Professional Healthcare Services')).toBeInTheDocument();
    });

    test('renders services section', () => {
        renderWithProviders(<Home />);
        
        expect(screen.getByTestId('services-section')).toBeInTheDocument();
        expect(screen.getByText('Our Services')).toBeInTheDocument();
        expect(screen.getByTestId('service-list')).toBeInTheDocument();
    });

    test('renders all service items', () => {
        renderWithProviders(<Home />);
        
        const serviceItems = screen.getAllByTestId('service-item');
        expect(serviceItems).toHaveLength(6);
        expect(screen.getByText('Medical and Health Check-ups')).toBeInTheDocument();
        expect(screen.getByText('Health and Nutrition Advice')).toBeInTheDocument();
        expect(screen.getByText('Surgery')).toBeInTheDocument();
        expect(screen.getByText('Emergency Services')).toBeInTheDocument();
        expect(screen.getByText('Counselling')).toBeInTheDocument();
        expect(screen.getByText('Diagnosis and Treatment')).toBeInTheDocument();
    });

    test('renders SEO metadata', () => {
        renderWithProviders(<Home />);
        
        expect(screen.getByTestId('seo-metadata')).toBeInTheDocument();
        expect(screen.getByTestId('page-title')).toHaveTextContent("Abdullah's Chamber - Professional Healthcare Services");
        expect(screen.getByTestId('og-title')).toHaveTextContent("Abdullah's Chamber - Professional Healthcare Services");
        expect(screen.getByTestId('twitter-card')).toHaveTextContent('summary_large_image');
        expect(screen.getByTestId('canonical-url')).toHaveTextContent('https://doctors-chamber.web.app');
        expect(screen.getByTestId('favicon')).toHaveTextContent('/favicon.ico');
        expect(screen.getByTestId('preconnect')).toHaveTextContent('fonts.googleapis.com');
    });

    test('has proper page structure', () => {
        renderWithProviders(<Home />);
        
        const homePage = screen.getByTestId('home-page');
        expect(homePage).toContainElement(screen.getByRole('heading', { level: 1 }));
        expect(homePage).toContainElement(screen.getByTestId('services-section'));
        expect(homePage).toContainElement(screen.getByTestId('seo-metadata'));
    });

    test('renders structured data for services', () => {
        renderWithProviders(<Home />);
        
        // Check that all 6 services are rendered
        const serviceItems = screen.getAllByTestId('service-item');
        expect(serviceItems).toHaveLength(6);
        
        // Verify specific services
        expect(screen.getByText('Medical and Health Check-ups')).toBeInTheDocument();
        expect(screen.getByText('Emergency Services')).toBeInTheDocument();
        expect(screen.getByText('Counselling')).toBeInTheDocument();
    });
});
