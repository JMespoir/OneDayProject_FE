import React from 'react';

interface TotalCreditsProps {
  total: number;
  completed: number;
  percentage: number;
}

const TotalCredits: React.FC<TotalCreditsProps> = ({ total, completed, percentage }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-full">
      <h2 className="text-lg font-bold text-gray-800 mb-4">졸업 학점 이수 현황</h2>
      
      {/* 학점 숫자 */}
      <div className="mb-4">
        <span className="text-3xl font-bold text-pink-400">{completed}학점</span>
        <span className="text-xl text-gray-500"> / {total}학점</span>
      </div>

      {/* 프로그레스 바 */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div
          className="bg-pink-500 h-2.5 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* 퍼센트 */}
      <p className="text-right text-gray-700 font-semibold">{percentage.toFixed(1)}% 이수</p>
    </div>
  );
};

export default TotalCredits;