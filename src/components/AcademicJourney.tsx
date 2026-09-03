import { useState } from 'react';

type Tab = 'pre' | 'fund1' | 'fund2';

export default function AcademicJourney() {
  const [activeTab, setActiveTab] = useState<Tab>('pre');

  return (
    <section id='academico' className='py-24 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center max-w-3xl mx-auto mb-16'>
          <h2 className='font-serif text-4xl md:text-5xl font-bold mb-6 text-foreground'>
            Uma educação para cada etapa do desenvolvimento
          </h2>
          <p className='text-gray-600 text-lg'>
            Acompanhamos o desenvolvimento do seu filho em cada etapa crucial da vida, com metodologias específicas para cada faixa etária.
          </p>
        </div>

        {/* Tab Selectors */}
        <div className='flex flex-col md:flex-row justify-center gap-4 mb-12'>
          {([
            { id: 'pre', label: 'EDUCAÇÃO INFANTIL' },
            { id: 'fund1', label: 'ENSINO FUNDAMENTAL – ANOS INICIAIS' },
            { id: 'fund2', label: 'ENSINO FUNDAMENTAL – ANOS FINAIS' },
          ] as { id: Tab; label: string }[]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-bold text-xs md:text-sm tracking-widest rounded transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id
                ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className='bg-gray-50 rounded-2xl overflow-hidden shadow-lg border border-gray-100'>
          {activeTab === 'pre' && (
            <div className='grid grid-cols-1 lg:grid-cols-2 animate-in fade-in zoom-in-95 duration-500'>
              <div className='h-100 relative'>
                <img
                  src='interacoes.webp'
                  alt='Crianças pequenas em atividade lúdica de alfabetização na sala de Pré-Escola'
                  loading='lazy'
                  width='800'
                  height='400'
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='p-10 lg:p-16 flex flex-col justify-center bg-white'>
                <h3 className='font-serif text-3xl font-bold text-foreground mb-4'>
                  Educação Infantil
                </h3>
                <p className='text-gray-600 text-lg mb-8 leading-relaxed'>
                  Aprender brincando, explorando e descobrindo o mundo com afeto e segurança.
                </p>
                <ul className='space-y-4'>
                  {[
                    'Alfabetização lúdica e gradual',
                    'Musicalização e artes integradas',
                  ].map((item, i) => (
                    <li key={i} className='flex items-start'>
                      <div className='w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mr-3 mt-1'>✓</div>
                      <span className='text-gray-700 font-medium'>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'fund1' && (
            <div className='grid grid-cols-1 lg:grid-cols-2 animate-in fade-in zoom-in-95 duration-500'>
              <div className='h-100 lg:h-auto relative'>
                <img
                  src='https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80'
                  alt='Alunos do Ensino Fundamental I em atividade de robótica educacional em laboratório'
                  loading='lazy'
                  width='800'
                  height='400'
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='p-10 lg:p-16 flex flex-col justify-center bg-white'>
                <h3 className='font-serif text-3xl font-bold text-foreground mb-4'>
                  Ensino Fundamental – Anos Iniciais
                </h3>
                <p className='text-gray-600 text-lg mb-8 leading-relaxed'>
                  Construção de conhecimentos, autonomia e hábitos de estudo.
                </p>
                <ul className='space-y-4'>
                  {[
                    'Projeto Maker e Robótica Educacional',
                    'Educação Financeira e Empreendedorismo',
                    'Projetos esportivos e culturais',
                  ].map((item, i) => (
                    <li key={i} className='flex items-start'>
                      <div className='w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mr-3 mt-1'>✓</div>
                      <span className='text-gray-700 font-medium'>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'fund2' && (
            <div className='grid grid-cols-1 lg:grid-cols-2 animate-in fade-in zoom-in-95 duration-500'>
              <div className='h-100 lg:h-auto relative'>
                <img
                  src='https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80'
                  alt='Adolescentes do Ensino Fundamental II em apresentação de projeto científico em grupo'
                  loading='lazy'
                  width='800'
                  height='400'
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='p-10 lg:p-16 flex flex-col justify-center bg-white'>
                <h3 className='font-serif text-3xl font-bold text-foreground mb-4'>
                  Ensino Fundamental – Anos Finais
                </h3>
                <p className='text-gray-600 text-lg mb-8 leading-relaxed'>
                  Desenvolvimento do pensamento crítico, responsabilidade e preparação para novos desafios.
                </p>
                <ul className='space-y-4'>
                  {[
                    'Professores especialistas por disciplina',
                    'Iniciação Científica e Feiras Tecnológicas',
                  ].map((item, i) => (
                    <li key={i} className='flex items-start'>
                      <div className='w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mr-3 mt-1'>✓</div>
                      <span className='text-gray-700 font-medium'>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
