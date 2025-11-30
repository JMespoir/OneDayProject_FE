// ScoreManagementPage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import Builtin from '../builtin_subject_list'; 
import TotalCredits from '../../displayCredits/totalCredits';
import EachCredits from '../../displayCredits/eachCredits';

// ----------------------------------------------------------------------
// 📋 목업 데이터 정의 (로그아웃 상태용 가짜 데이터)
// ----------------------------------------------------------------------
const MOCK_SUBJECT_LIST = [
  { id: 1, name: "자료구조", credit: 3, grade: "A+", category: "전공기초", year: 2023, semester: "1학기", needsRetake: false, score: 4.3 },
  { id: 2, name: "컴퓨터구조", credit: 3, grade: "B+", category: "전공필수", year: 2023, semester: "2학기", needsRetake: false, score: 3.3 },
  { id: 3, name: "오픈소스SW실습", credit: 3, grade: "A0", category: "전공선택", year: 2024, semester: "1학기", needsRetake: false, score: 4.0 },
  { id: 4, name: "일반교양영어", credit: 2, grade: "P", category: "교양", year: 2023, semester: "1학기", needsRetake: false, score: 0 },
  { id: 5, name: "글쓰기기초", credit: 2, grade: "B0", category: "교양", year: 2023, semester: "2학기", needsRetake: false, score: 3.0 },
  { id: 6, name: "웹프로그래밍", credit: 3, grade: "A+", category: "전공선택", year: 2024, semester: "2학기", needsRetake: false, score: 4.3 },
];

export default function ScoreManagementPage() {
  const { userId } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      {/* -------------------------------------------------------------
        1. 상단 섹션 (학점 그래프 vs 안내창)
        -------------------------------------------------------------
      */}
      <div className="max-w-[1360px] mx-auto mt-12">
        {userId ? (
            // ✅ 로그인 상태: 실제 그래프 (높이 h-80 유지)
            <div className="flex flex-col md:flex-row items-stretch gap-8 h-80">
                <div className='flex-1 h-full'>
                    <TotalCredits />
                </div>
                <div className='flex-1 h-full'>
                    <EachCredits />
                </div>
            </div>
        ) : (
            // 🔒 로그아웃 상태: 안내 박스 (메인페이지와 동일한 h-64 사이즈)
            // ⭐️ h-80 -> h-64 (256px)로 수정하여 더 슬림하게 만듦
            <div className="w-full h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center">
                <p className="text-xl text-gray-500 font-bold mb-6">
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

      {/* -------------------------------------------------------------
        2. 하단 섹션 (수강 목록)
        -------------------------------------------------------------
      */}
      <div className="score-management-container w-full max-w-[1360px] mx-auto mt-14 mb-20">
        
        {/* 안내 배너 (로그아웃 상태일 때만 표시) */}
        {!userId && (
            <div className="flex justify-end mb-2">
                <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full border border-gray-200 font-medium">
                     현재는 예시 데이터가 표시되고 있습니다.
                </span>
            </div>
        )}

        <div className="border-2 border-black-400 rounded-xl p-8 bg-white h-[500px] overflow-y-auto custom-scrollbar">
          {/* 로그인 안 되어 있으면 MOCK 데이터 전달 */}
          <Builtin mockData={!userId ? MOCK_SUBJECT_LIST : undefined} />
        </div>
      </div>
    </div>
  );
}