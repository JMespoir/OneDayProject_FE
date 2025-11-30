// Mainpage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // 1. AuthContext 필수

import TotalCredits from '../../displayCredits/totalCredits';
import EachCredits from '../../displayCredits/eachCredits';
// 이미지 import (경로는 그대로 유지)
import sugangLogo from '../../assets/sugang_logo.jpg';
import checkLogo from '../../assets/check_logo.jpg';
import hakjomLogo from '../../assets/hakjom_logo.jpg';
import mypageLogo from '../../assets/mypage_logo.jpg';
import titleLogo from '../../assets/knu_joluv_logo.jpg'; 

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useAuth(); // 2. 로그인 상태 가져오기

  // 카드 클릭 시 로그인 체크 핸들러
const handleCardClick = (path: string) => {
  navigate(path);
};

  return (
    <>
      <div className="p-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <img 
            src={titleLogo} 
            alt="KNU JOLUV" 
            className="h-16 mx-auto mb-4 object-contain" 
          />
          <p className="text-xl text-gray-700 font-['Gowun_Batang'] font-bold">
            "성공적인 졸업을 위한 길라잡이입니다."
          </p>
          <p className="text-md text-gray-500 mt-2 font-['Gowun_Batang']">
            "Your Roadmap to a Successful Graduation."
          </p>
        </div>

        {/* Icon Button Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center mb-12 max-w-7xl mx-auto">
          {/* 카드 1: 수강과목정리 */}
          <div onClick={() => handleCardClick('/score-management')} className="card-hover-effect bg-white p-4 rounded-full aspect-square flex flex-col justify-center items-center w-60 mx-auto shadow-xl border-4 border-gray-100 cursor-pointer transition-all hover:border-pink-200 hover:-translate-y-1">
            <img src={sugangLogo} alt="수강과목정리" className="h-24 w-auto mb-2 object-contain" />
            <h2 className="text-xl font-semibold text-gray-700">수강과목정리</h2>
          </div>

          {/* 카드 2: 졸업요건 check */}
          <div onClick={() => handleCardClick('/checklist')} className="card-hover-effect bg-white p-4 rounded-full aspect-square flex flex-col justify-center items-center w-60 mx-auto shadow-xl border-4 border-gray-100 cursor-pointer transition-all hover:border-pink-200 hover:-translate-y-1">
            <img src={checkLogo} alt="졸업요건 checklist" className="h-24 w-auto mb-2 object-contain" />
            <h2 className="text-xl font-semibold text-gray-700">졸업요건 check</h2>
          </div>

          {/* 카드 3: 학점기록 */}
          <div onClick={() => handleCardClick('/summary')} className="card-hover-effect bg-white p-4 rounded-full aspect-square flex flex-col justify-center items-center w-60 mx-auto shadow-xl border-4 border-gray-100 cursor-pointer transition-all hover:border-pink-200 hover:-translate-y-1">
            <img src={hakjomLogo} alt="학점기록" className="h-24 w-auto mb-2 object-contain" />
            <h2 className="text-xl font-semibold text-gray-700">학점기록</h2>
          </div>

          {/* 카드 4: 마이페이지 */}
          <div onClick={() => handleCardClick('/mypage')} className="card-hover-effect bg-white p-4 rounded-full aspect-square flex flex-col justify-center items-center w-60 mx-auto shadow-xl border-4 border-gray-100 cursor-pointer transition-all hover:border-pink-200 hover:-translate-y-1">
            <img src={mypageLogo} alt="마이페이지" className="h-24 w-auto mb-2 object-contain" />
            <h2 className="text-xl font-semibold text-gray-700">마이페이지</h2>
          </div>
        </div>

        {/* ⭐️ 여기가 핵심입니다! 
            userId가 있으면(True) -> 그래프를 보여주고
            userId가 없으면(False) -> 안내 문구를 보여줍니다.
        */}
        <div className="max-w-7xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 pl-2 border-l-4 border-pink-400">
            📊 나의 이수 현황
          </h3>
        
          {userId ? (
            // ✅ 로그인 상태일 때: 그래프 컴포넌트 렌더링
           <div className="flex flex-col md:flex-row items-stretch max-w-[1360px] mx-auto mt-12 gap-8">
        <div className='flex-1'>
            {/* ⭐️ 수정됨: data 속성 제거 */}
            <TotalCredits />
        </div>
        <div className='flex-1'>
            {/* ⭐️ 수정됨: data 속성 제거 */}
            <EachCredits />
        </div>
            </div>
          ) : (
            // 🔒 로그아웃 상태일 때: 안내 문구 박스 표시 (기존 데이터 절대 안 보임)
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-lg text-gray-500 font-bold mb-4">
                    로그인 후 내 졸업 요건 진행률을 확인해보세요!
                </p>
                <button 
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-600 transition-colors shadow-md"
                >
                    로그인 하러 가기
                </button>
            </div>
          )}
        </div>
        
      </div>
    </>
  );
};
export default MainPage;