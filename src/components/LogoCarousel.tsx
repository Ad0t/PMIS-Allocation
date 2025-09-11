import React from 'react';

const logos = [
  { src: 'https://placehold.co/150x75/ffffff/000000?text=Reliance', alt: 'Reliance Industries Limited' },
  { src: 'https://placehold.co/150x75/ffffff/000000?text=TCS', alt: 'Tata Consultancy Services' },
  { src: 'https://placehold.co/150x75/ffffff/000000?text=HDFC+Bank', alt: 'HDFC Bank' },
  { src: 'https://placehold.co/150x75/ffffff/000000?text=ONGC', alt: 'ONGC' },
  { src: 'https://placehold.co/150x75/ffffff/000000?text=Infosys', alt: 'Infosys' },
  { src: 'https://placehold.co/150x75/ffffff/000000?text=NTPC', alt: 'NTPC' },
];

const LogoCarousel: React.FC = () => {
  const allLogos = [...logos, ...logos];

  return (
    <div className="w-full overflow-hidden py-8">
      <div className="relative w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10"></div>
        <div className="flex animate-scroll">
          {allLogos.map((logo, index) => (
            <div key={index} className="flex-shrink-0 mx-8" style={{ width: '160px' }}>
              <img src={logo.src} alt={logo.alt} className="h-16 object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoCarousel;