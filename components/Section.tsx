import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  title?: string;
  subtitle?: string;
  centered?: boolean;
}

const Section: React.FC<SectionProps> = ({ 
  children, 
  className = "", 
  id, 
  title, 
  subtitle,
  centered = false 
}) => {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className={`mb-12 ${centered ? 'text-center max-w-3xl mx-auto' : ''}`}>
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-slate-600">
                {subtitle}
              </p>
            )}
            <div className={`h-1.5 w-20 bg-brand-600 mt-6 rounded-full ${centered ? 'mx-auto' : ''}`} />
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;