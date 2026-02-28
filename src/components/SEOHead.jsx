import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SEOHead = ({
  title,
  description,
  keywords,
  ogImage,
  ogType = "website",
  canonicalUrl,
  structuredData,
  noIndex = false,
}) => {
  const location = useLocation();
  const baseUrl = "https://doctors-chamber.web.app";
  const currentUrl = canonicalUrl || `${baseUrl}${location.pathname}`;

  const defaultTitle = "Doctor's Chamber - Professional Healthcare Services";
  const defaultDescription =
    "Comprehensive healthcare services including medical check-ups, nutrition advice, surgery, emergency care, counselling, and diagnosis. Book appointments online with our experienced medical team.";
  const defaultKeywords =
    "healthcare, medical services, doctor consultation, health check-up, nutrition advice, surgery, emergency care, counselling, diagnosis, medical appointment, Doctor's Chamber";
  const defaultImage = `${baseUrl}/images/og-default.jpg`;

  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords || defaultKeywords;
  const finalImage = ogImage || defaultImage;

  const generateStructuredData = () => {
    const baseStructuredData = {
      "@context": "https://schema.org",
      "@type": "MedicalOrganization",
      name: "Doctor's Chamber",
      url: baseUrl,
      logo: `${baseUrl}/images/logo.png`,
      description: finalDescription,
      address: {
        "@type": "PostalAddress",
        streetAddress: "123 Healthcare Avenue",
        addressLocality: "Medical City",
        addressRegion: "HC",
        postalCode: "12345",
        addressCountry: "US",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-234-567-8900",
        contactType: "customer service",
        availableLanguage: ["English"],
      },
      sameAs: [
        "https://www.facebook.com/doctorschamber",
        "https://www.twitter.com/doctorschamber",
      ],
    };

    if (structuredData) {
      return { ...baseStructuredData, ...structuredData };
    }

    return baseStructuredData;
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content="Doctor's Chamber" />
      <meta
        name="robots"
        content={noIndex ? "noindex,nofollow" : "index,follow"}
      />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Doctor's Chamber" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:site" content="@doctorschamber" />
      <meta name="twitter:creator" content="@drschamber" />

      {/* Additional Meta Tags */}
      <meta name="language" content="English" />
      <meta name="geo.region" content="US-HC" />
      <meta name="geo.placename" content="Medical City" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="theme-color" content="#198754" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>

      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link rel="preconnect" href="https://firebase.googleapis.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
    </Helmet>
  );
};

export default SEOHead;
