import React from 'react';

interface EachCreditsProps {
  title: string;
  score: number;
}

const EachCredits: React.FC<EachCreditsProps> = ({ title, score }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-full text-center">
      <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
      
      <span className="text-5xl font-bold text-pink-400">{score}학점</span>
    </div>
  );
};

export default EachCredits;