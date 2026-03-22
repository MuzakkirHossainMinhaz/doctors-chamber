import { useEffect, useState } from "react";
import SEOHead from "../../components/SEOHead";
import { fetchServicesFromFirestore } from "../../utils/serviceData";
import Banner from "./Banner.jsx";
import Services from "./Services.jsx";

const Home = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const loadStructuredServices = async () => {
      try {
        const firestoreServices = await fetchServicesFromFirestore({
          activeOnly: true,
        });
        setServices(firestoreServices);
      } catch (error) {
        console.error("Error loading home SEO services:", error);
      }
    };

    loadStructuredServices();
  }, []);

  const serviceOffers = services.map((service) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "MedicalProcedure",
      name: service.name,
      description: service.description,
    },
    price: String(service.price ?? ""),
    priceCurrency: "USD",
  }));

  return (
    <div>
      <SEOHead
        title="Doctor's Chamber - Professional Healthcare Services"
        description="Comprehensive healthcare services including medical check-ups, nutrition advice, surgery, emergency care, counselling, and diagnosis. Book appointments online with Dr. Abdullah."
        keywords="healthcare, medical services, doctor consultation, health check-up, nutrition advice, surgery, emergency care, counselling, diagnosis, medical appointment, Dr. Abdullah"
        structuredData={{
          "@type": "MedicalClinic",
          name: "Doctor's Chamber",
          description:
            "Professional healthcare services and medical consultations",
          openingHours: "Mo-Fr 09:00-17:00",
          acceptsReservations: "true",
          priceRange: "$$",
          currenciesAccepted: "USD",
          paymentAccepted: "Credit Card, Cash, Insurance",
          ...(serviceOffers.length > 0
            ? {
                hasOfferCatalog: {
                  "@type": "OfferCatalog",
                  name: "Healthcare Services",
                  itemListElement: serviceOffers,
                },
              }
            : {}),
        }}
      />
      <Banner services={services} />
      <Services />
    </div>
  );
};

export default Home;
