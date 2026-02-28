import SEOHead from "../../components/SEOHead";
import Banner from "./Banner.jsx";
import Services from "./Services.jsx";

const Home = () => {
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
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Healthcare Services",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "MedicalProcedure",
                  name: "Medical and Health Check-ups",
                  description: "Comprehensive health examination and screening",
                },
                price: "12",
                priceCurrency: "USD",
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "MedicalProcedure",
                  name: "Health and Nutrition Advice",
                  description: "Personalized nutrition guidance and counseling",
                },
                price: "9",
                priceCurrency: "USD",
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "MedicalProcedure",
                  name: "Surgery",
                  description: "Surgical procedures and consultations",
                },
                price: "40",
                priceCurrency: "USD",
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "MedicalProcedure",
                  name: "Emergency Services",
                  description: "Emergency medical care and treatment",
                },
                price: "10",
                priceCurrency: "USD",
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "MedicalProcedure",
                  name: "Counselling",
                  description: "Mental health and counseling services",
                },
                price: "17",
                priceCurrency: "USD",
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "MedicalProcedure",
                  name: "Diagnosis and Treatment",
                  description: "Medical diagnosis and treatment plans",
                },
                price: "25",
                priceCurrency: "USD",
              },
            ],
          },
        }}
      />
      <Banner />
      <Services />
    </div>
  );
};

export default Home;
