export default function StructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
    {
      '@type': 'Organization',
      name: 'BillAm',
      url: 'https://billam.io',
      logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1a7765235-1775797023975.png",
      description: 'AI-powered client intake and quotation agent for service businesses.'
    },
    {
      '@type': 'WebPage',
      name: 'BillAm — Turn Client Conversations into Quotes',
      description: 'BillAm handles client intake, clarification, and quote generation automatically for service businesses.',
      url: 'https://billam.io'
    },
    {
      '@type': 'SoftwareApplication',
      name: 'BillAm',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'AI-powered client intake and quotation agent for service businesses.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    }]

  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />);


}