import { useState } from "react";

type Tab = "pre" | "fund1" | "fund2";

export default function AcademicJourney() {
  const [activeTab, setActiveTab] = useState<Tab>("pre");

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold mb-6 text-foreground">
            JORNADA <span className="text-primary">ACADÊMICA</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Acompanhamos o desenvolvimento do seu filho em cada etapa crucial da vida, com metodologias específicas para cada faixa etária.
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
          {([
            { id: "pre", label: "PRÉ-ESCOLA" },
            { id: "fund1", label: "FUNDAMENTAL I" },
            { id: "fund2", label: "FUNDAMENTAL II" },
          ] as { id: Tab; label: string }[]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-4 font-bold text-sm tracking-widest rounded transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          {activeTab === "pre" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 animate-in fade-in zoom-in-95 duration-500">
              <div className="h-[400px] lg:h-auto relative">
                <img
                  src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80"
                  alt="Crianças pequenas em atividade lúdica de alfabetização na sala de Pré-Escola"
                  loading="lazy"
                  width="800"
                  height="400"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6 bg-secondary text-primary font-bold px-4 py-2 rounded shadow">
                  Idade: 2 a 5 anos
                </div>
              </div>
              <div className="p-10 lg:p-16 flex flex-col justify-center bg-white">
                <h3 className="font-['Playfair_Display'] text-3xl font-bold text-foreground mb-4">
                  Pré-Escola: O Despertar
                </h3>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  É nos primeiros anos que construímos as bases para toda a vida. Por isso, cuidamos de cada detalhe com afeto, intencionalidade e responsabilidade.
                </p>
                <ul className="space-y-4">
                  {[
                    "Alfabetização lúdica e gradual",
                    "Iniciação ao programa bilíngue diário",
                    "Musicalização e artes integradas",
                    "Acompanhamento nutricional e psicológico",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mr-3 mt-1">✓</div>
                      <span className="text-gray-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "fund1" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 animate-in fade-in zoom-in-95 duration-500">
              <div className="h-[400px] lg:h-auto relative">
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80"
                  alt="Alunos do Ensino Fundamental I em atividade de robótica educacional em laboratório"
                  loading="lazy"
                  width="800"
                  height="400"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6 bg-secondary text-primary font-bold px-4 py-2 rounded shadow">
                  Idade: 6 a 10 anos
                </div>
              </div>
              <div className="p-10 lg:p-16 flex flex-col justify-center bg-white">
                <h3 className="font-['Playfair_Display'] text-3xl font-bold text-foreground mb-4">
                  Fundamental I: A Consolidação
                </h3>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Consolidação da leitura, escrita e raciocínio lógico com acompanhamento próximo.
                </p>
                <ul className="space-y-4">
                  {[
                    "Projeto Maker e Robótica Educacional",
                    "Educação Financeira e Empreendedorismo",
                    "Programa Bilíngue com vivências práticas",
                    "Projetos esportivos e culturais",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mr-3 mt-1">✓</div>
                      <span className="text-gray-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "fund2" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 animate-in fade-in zoom-in-95 duration-500">
              <div className="h-[400px] lg:h-auto relative">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                  alt="Adolescentes do Ensino Fundamental II em apresentação de projeto científico em grupo"
                  loading="lazy"
                  width="800"
                  height="400"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6 bg-secondary text-primary font-bold px-4 py-2 rounded shadow">
                  Idade: 11 a 14 anos
                </div>
              </div>
              <div className="p-10 lg:p-16 flex flex-col justify-center bg-white">
                <h3 className="font-['Playfair_Display'] text-3xl font-bold text-foreground mb-4">
                  Fundamental II: A Expansão
                </h3>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Formação acadêmica sólida, pensamento crítico e preparação para os desafios futuros.
                </p>
                <ul className="space-y-4">
                  {[
                    "Professores especialistas por disciplina",
                    "Iniciação Científica e Feiras Tecnológicas",
                    "Preparação para Certificações Cambridge",
                    "Orientação vocacional inicial e Mentoria",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mr-3 mt-1">✓</div>
                      <span className="text-gray-700 font-medium">{item}</span>
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
