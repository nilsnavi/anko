import React from 'react';
import Section from '../components/Section';
import { COMPANY_INFO } from '../constants';
import { useData } from '../context/DataContext';

const About: React.FC = () => {
  const { team } = useData();
  
  return (
    <div className="pt-8">
      {/* Header */}
      <Section centered title="О нас" subtitle="АНО ПБС «Экосистема учёта» — это команда профессионалов, объединенных целью развития честного и эффективного бизнеса в России.">
         <div className="prose prose-lg mx-auto text-slate-600">
            <p>
               Автономная некоммерческая организация профессионального бухгалтерского сопровождения «Экосистема учёта» была создана для оказания всесторонней поддержки предпринимателям Новороссийска и Краснодарского края.
            </p>
            <p>
               Наша миссия — содействие социально-экономической адаптации граждан и развитию предпринимательской инициативы. Мы не просто ведем бухгалтерию, мы создаем среду, в которой бизнес может расти безопасно и законно.
            </p>
         </div>
      </Section>

      {/* Values Grid */}
      <div className="bg-white py-16 border-y border-slate-100">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
               <div>
                  <img src="https://picsum.photos/id/20/800/600" alt="Team meeting" className="rounded-lg shadow-lg" />
               </div>
               <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">Наши принципы</h3>
                  <ul className="space-y-6">
                     <li className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shrink-0 font-bold text-xl">1</div>
                        <div>
                           <h4 className="font-bold text-lg text-slate-900">Профессионализм</h4>
                           <p className="text-slate-600">Наши специалисты регулярно проходят повышение квалификации и следят за всеми изменениями в законодательстве.</p>
                        </div>
                     </li>
                     <li className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shrink-0 font-bold text-xl">2</div>
                        <div>
                           <h4 className="font-bold text-lg text-slate-900">Социальная ответственность</h4>
                           <p className="text-slate-600">Мы активно поддерживаем социально уязвимые категории граждан и ветеранов, помогая им интегрироваться в бизнес-среду.</p>
                        </div>
                     </li>
                     <li className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shrink-0 font-bold text-xl">3</div>
                        <div>
                           <h4 className="font-bold text-lg text-slate-900">Прозрачность</h4>
                           <p className="text-slate-600">Честные цены, понятные договоры и полная отчетность перед клиентами.</p>
                        </div>
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </div>

      {/* Team */}
      <Section title="Наша команда" subtitle="Люди, которые обеспечивают успех вашего бизнеса">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
               <div key={member.id} className="bg-white p-6 rounded-xl border border-slate-100 text-center hover:shadow-lg transition-shadow">
                  <img 
                     src={member.imageUrl} 
                     alt={member.name} 
                     className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-brand-50"
                  />
                  <h4 className="font-bold text-lg text-slate-900 mb-1">{member.name}</h4>
                  <p className="text-brand-600 text-sm mb-4">{member.role}</p>
               </div>
            ))}
         </div>
      </Section>

      {/* Documents */}
      <div className="bg-slate-50 py-16">
         <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-8">Официальные документы</h2>
            <div className="flex flex-wrap justify-center gap-4">
               {['Устав организации', 'Свидетельство ОГРН', 'Лицензия на образовательную деятельность'].map((doc, i) => (
                  <button key={i} className="flex items-center gap-2 bg-white px-6 py-4 rounded-lg border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all text-slate-700">
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
            </div>
         </div>
      </div>
    </div>
  );
};

export default About;