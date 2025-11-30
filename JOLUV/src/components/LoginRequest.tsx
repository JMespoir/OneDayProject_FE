import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginRequest: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
      <div className="bg-gray-100 p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-200">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">로그인이 필요합니다</h2>
        <p className="text-gray-500 mb-6">
          개인 맞춤형 정보(학점, 졸업요건 등)를<br />
          확인하려면 로그인이 필요해요.
        </p>
        <div className="flex gap-3 justify-center">
            <button
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-600 transition-colors shadow-md"
            >
            로그인 하기
            </button>
            <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-400 transition-colors"
            >
            뒤로 가기
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRequest;