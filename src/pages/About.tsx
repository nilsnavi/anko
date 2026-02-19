import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from '../components/Section';
import { useData } from '../context/DataContext';
import {
   TextReveal,
   RevealOnScroll,
   StaggerReveal,
   AnimatedCircles,
   ScaleReveal,
} from '../components/animations';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
   const { team } = useData();
   const headerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const ctx = gsap.context(() => {
         // Header animation
         gsap.fromTo(
            '.about-header-content',
            { opacity: 0, y: 50 },
            {
               opacity: 1,
               y: 0,
               duration: 0.8,
               stagger: 0.2,
               ease: 'power3.out',
            }
         );
      }, headerRef);

      return () => ctx.revert();
   }, []);

   return (
      <div className="pt-8">
         {/* Header with GSAP */}
         <div ref={headerRef} className="bg-slate-900 text-white py-20 relative overflow-hidden">
            <AnimatedCircles count={3} />
            <div className="container mx-auto px-4 relative z-10">
               <div className="text-center max-w-4xl mx-auto">
                  <h1 className="about-header-content text-4xl md:text-5xl font-bold mb-6">
                     <TextReveal>О нас</TextReveal>
                  </h1>
                  <p className="about-header-content text-xl text-slate-300 leading-relaxed">
                     АНО ПБС «Экосистема учёта» — это команда профессионалов, объединенных целью развития честного и эффективного бизнеса в России.
                  </p>
               </div>
            </div>
         </div>

         <Section centered>
            <div className="prose prose-lg mx-auto text-slate-600">
               <p>
                  Автономная некоммерческая организация профессионального бухгалтерского сопровождения «Экосистема учёта» была создана для оказания всесторонней поддержки предпринимателям Новороссийска и Краснодарского края.
               </p>
               <p>
                  Наша миссия — содействие социально-экономической адаптации граждан и развитию предпринимательской инициативы. Мы не просто ведем бухгалтерию, мы создаем среду, в которой бизнес может расти безопасно и законно.
               </p>
            </div>
         </Section>

         {/* Values Grid with GSAP */}
         <div className="bg-white py-16 border-y border-slate-100">
            <div className="container mx-auto px-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <RevealOnScroll direction="left">
                     <div>
                        <img src="https://picsum.photos/id/20/800/600" alt="Team meeting" className="rounded-lg shadow-lg" />
                     </div>
                  </RevealOnScroll>
                  <RevealOnScroll direction="right" delay={0.2}>
                     <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">
                           <TextReveal>Наши принципы</TextReveal>
                        </h3>
                        <StaggerReveal staggerDelay={0.15} childClassName="value-item">
                           <ul className="space-y-6">
                              <li className="value-item flex gap-4">
                                 <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shrink-0 font-bold text-xl">1</div>
                                 <div>
                                    <h4 className="font-bold text-lg text-slate-900">Профессионализм</h4>
                                    <p className="text-slate-600">Наши специалисты регулярно проходят повышение квалификации и следят за всеми изменениями в законодательстве.</p>
                                 </div>
                              </li>
                              <li className="value-item flex gap-4">
                                 <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shrink-0 font-bold text-xl">2</div>
                                 <div>
                                    <h4 className="font-bold text-lg text-slate-900">Социальная ответственность</h4>
                                    <p className="text-slate-600">Мы активно поддерживаем социально уязвимые категории граждан и ветеранов, помогая им интегрироваться в бизнес-среду.</p>
                                 </div>
                              </li>
                              <li className="value-item flex gap-4">
                                 <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shrink-0 font-bold text-xl">3</div>
                                 <div>
                                    <h4 className="font-bold text-lg text-slate-900">Прозрачность</h4>
                                    <p className="text-slate-600">Честные цены, понятные договоры и полная отчетность перед клиентами.</p>
                                 </div>
                              </li>
                           </ul>
                        </StaggerReveal>
                     </div>
                  </RevealOnScroll>
               </div>
            </div>
         </div>

         {/* Team with GSAP */}
         <Section>
            <RevealOnScroll className="text-center mb-12">
               <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  <TextReveal>Наша команда</TextReveal>
               </h2>
               <p className="text-slate-600 max-w-2xl mx-auto">
                  Люди, которые обеспечивают успех вашего бизнеса
               </p>
            </RevealOnScroll>

            <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1} childClassName="team-member">
               {team.map((member) => (
                  <ScaleReveal key={member.id}>
                     <div className="team-member bg-white p-6 rounded-xl border border-slate-100 text-center hover:shadow-lg transition-shadow">
                        <img
                           src={member.imageUrl}
                           alt={member.name}
                           className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-brand-50"
                        />
                        <h4 className="font-bold text-lg text-slate-900 mb-1">{member.name}</h4>
                        <p className="text-brand-600 text-sm mb-4">{member.role}</p>
                     </div>
                  </ScaleReveal>
               ))}
            </StaggerReveal>
         </Section>

         {/* Documents with GSAP */}
         <div className="bg-slate-50 py-16 relative overflow-hidden">
            <AnimatedCircles count={3} />
            <div className="container mx-auto px-4 text-center relative z-10">
               <RevealOnScroll>
                  <h2 className="text-2xl font-bold mb-8">
                     <TextReveal>Официальные документы</TextReveal>
                  </h2>
               </RevealOnScroll>
               <StaggerReveal className="flex flex-wrap justify-center gap-4" staggerDelay={0.1} childClassName="doc-button">
                  {['Устав организации', 'Свидетельство ОГРН', 'Лицензия на образовательную деятельность'].map((doc, i) => (
                     <button key={i} className="doc-button flex items-center gap-2 bg-white px-6 py-4 rounded-lg border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all text-slate-700">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                           <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                           <polyline points="14 2 14 8 20 8"></polyline>
                           <line x1="16" y1="13" x2="8" y2="13"></line>
                           <line x1="16" y1="17" x2="8" y2="17"></line>
                           <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        <span>{doc} (PDF)</span>
                     </button>
                  ))}
               </StaggerReveal>
            </div>
         </div>
      </div>
   );
};

export default About;