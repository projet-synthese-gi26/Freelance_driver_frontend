import { useState } from 'react';
import {faqData} from '@/data/Structure'

const FAQPage = () => {
  const [activeRubrique, setActiveRubrique] = useState<number | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  const toggleRubrique = (rubriqueid: number) => {
    setActiveRubrique(activeRubrique === rubriqueid ? null : rubriqueid);
    setActiveQuestion(null);
  };

  const toggleQuestion = (questionId: number) => {
    setActiveQuestion(activeQuestion === questionId ? null : questionId);
  };

  return (
    <div className=" mx-auto p-6 text">
      {faqData.map((rubrique) => (
        <div key={rubrique.id} className="mb-2">
          <h2 
            onClick={() => toggleRubrique(rubrique.id)} 
            className="bg-gray-100 p-2 rounded-lg font-bold cursor-pointer hover:bg-gray-200 transition-colors duration-200"
          >
            {rubrique.id+'.  '+rubrique.title}
          </h2>
          {activeRubrique === rubrique.id && (
            <div className="mt-4 pl-4">
              {rubrique.questions.map((q) => (
                <div key={q.id} className="mb-4">
                  <h3 
                    onClick={() => toggleQuestion(q.id)} 
                    className="text-blue-600 cursor-pointer hover:text-blue-800 transition-colors duration-200"
                  >
                    {q.question}
                  </h3>
                  {activeQuestion === q.id && (
                    <p className="mt-2 pl-4 text-gray-700">{q.answer}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQPage;