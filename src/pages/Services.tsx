import React from 'react';
import Section from '../components/Section';
import { useData } from '../context/DataContext';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
  const { services } = useData();

  return (
    <div className="pt-8 bg-slate-50 min-h-screen">
      <Section title="Наши услуги" centered subtitle="Профессиональное сопровождение на каждом этапе развития вашего бизнеса">
        <div className="grid gap-12">
          {services.map((service, index) => (
            <div key={service.id} id={service.id} className={`flex flex-col md:flex-row gap-8 items-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
               <div className="w-full md:w-1/3 flex justify-center">
                  <div className="w-full aspect-video md:aspect-square bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600">
                      <service.icon size={80} strokeWidth={1.5} />
                  </div>
               </div>
               <div className="w-full md:w-2/3">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{service.title}</h3>
                  <p className="text-slate-600 text-lg mb-6">{service.description}</p>
                  
                  {service.details && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                       {service.details.map((detail, idx) => (
                         <div key={idx} className="flex items-start gap-2">
                            <div className="bg-green-100 p-1 rounded-full text-green-600 mt-0.5">
                               <Check size={14} />
                            </div>
                            <span className="text-slate-700">{detail}</span>
                         </div>
                       ))}
                    </div>
                  )}

                  <Link 
                    to={`/contacts?subject=${encodeURIComponent(service.title)}`} 
                    className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-brand-600 transition-colors"
                  >
                    Заказать услугу
                  </Link>
               </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default Services;