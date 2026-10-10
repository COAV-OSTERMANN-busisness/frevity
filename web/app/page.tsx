import { HomeContent } from "@/components/landing/home";

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://frevity.app/#website",
  name: "Frevity",
  url: "https://frevity.app/",
  description:
    "Estimate freight, shipping, import, and landed costs with Frevity for road, air, and maritime shipments.",
  inLanguage: "en",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />
      <HomeContent />
    </>
  );
}
