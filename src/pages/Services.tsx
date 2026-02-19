import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from '../components/Section';
import { useData } from '../context/DataContext';
import { Check, Building2, Calculator, Medal, GraduationCap, Scale, Printer, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StaggerContainer, StaggerItem } from '../components/animations';
import {
  TextReveal,
  AnimatedCircles,
  MagneticButton,
} from '../components/animations';

gsap.registerPlugin(ScrollTrigger);

// Icon mapping for services (from API string to component)
const iconMap: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  Building2,
  Calculator,
  Medal,
  GraduationCap,
  Scale,
  Printer
};

// Helper to get icon component from service icon string
const getServiceIcon = (iconName: unknown) => {
  const name = String(iconName);
  return iconMap[name] || Building2;
};

const Services: React.FC = () => {
  const { services } = useData();
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.services-header-content',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        }
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header with GSAP */}
      <div ref={headerRef} className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <AnimatedCircles count={4} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="services-header-content text-4xl md:text-5xl font-bold mb-6">
              <TextReveal>Наши услуги</TextReveal>
            </h1>
            <p className="services-header-content text-xl text-slate-300 leading-relaxed">
              Профессиональное сопровождение на каждом этапе развития вашего бизнеса
            </p>
          </div>
        </div>
      </div>

      <Section>
        <StaggerContainer className="grid gap-12" staggerDelay={0.15}>
          {services.map((service, index) => {
            const ServiceIcon = getServiceIcon(service.icon);
            return (
              <StaggerItem key={service.id}>
                <motion.div
                  id={service.id}
                  className={`flex flex-col md:flex-row gap-8 items-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''
                    }`}
                  whileHover={{ y: -4, boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.1)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="w-full md:w-1/3 flex justify-center">
                    <motion.div
                      className="w-full aspect-video md:aspect-square bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <ServiceIcon size={80} strokeWidth={1.5} />
                    </motion.div>
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

                    <MagneticButton className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-brand-600 transition-colors group">
                      <Link to={`/contacts?subject=${encodeURIComponent(service.title)}`} className="flex items-center gap-2">
                        Заказать услугу
                        <motion.span
                          className="inline-block"
                          initial={{ x: 0 }}
                          whileHover={{ x: 4 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <ArrowRight size={18} />
                        </motion.span>
                      </Link>
                    </MagneticButton>
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </Section>
    </div>
  );
};

export default Services;