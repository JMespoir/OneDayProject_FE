import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupPage: React.FC = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [major, setMajor] = useState('');
  
  // ⭐️ 아이디 중복 에러를 표시하기 위한 State 추가
  const [idError, setIdError] = useState('');

  const navigate = useNavigate();

  // 아이디 입력 시 에러 메시지 초기화 (사용자가 다시 입력하면 빨간줄 사라짐)
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
    if (idError) setIdError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIdError(''); // 제출 시 에러 초기화

    if (!major) {
      alert('전공을 선택해주세요.');
      return;
    }

    const signupData = {
      userId: id,
      password: password,
      name: name,
      studentId: parseInt(studentId) || 0,
      major: major,
    };

    try {
      const response = await axios.post('/api/auth/signup', signupData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 200) {
        alert('회원가입이 완료되었습니다! 🎉 로그인해주세요.');
        navigate('/login'); 
      }

    } catch (error: any) {
      console.error('회원가입 실패:', error);
      let errorMessage = '회원가입 중 오류가 발생했습니다.';
      
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        const status = error.response?.status;
        
        // ⭐️ [수정] 아이디 중복 체크 -> 화면에 예쁘게 표시
        if (typeof errorData === 'string') {
             if (errorData.includes('duplicate') || errorData.includes('unique constraint')) {
                 // alert 대신 state 업데이트 -> 화면에 빨간 글씨 표시
                 setIdError('이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.');
                 return;
             }
             if (!errorData.includes('<html')) errorMessage = errorData;
        } else if (errorData?.message) {
            errorMessage = errorData.message;
        }

        if (status === 409) {
             setIdError('이미 존재하는 계정입니다.'); // 이것도 화면에 표시
        } else {
             alert(`회원가입 실패: ${errorMessage}`);
        }
      } else {
        alert('서버와 연결할 수 없습니다.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl border border-white/50 backdrop-blur-sm">
        
        <div className="text-center">
          {/* ✅ 기존 색 유지 (회원가입 타이틀) */}
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-black">
            회원가입
          </h2>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          
          {/* 1. 아이디 입력 */}
          <div className="relative">
            <label htmlFor="id" className="sr-only">아이디</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className={`h-5 w-5 ${idError ? 'text-red-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              id="id"
              name="id"
              type="text"
              required
              // ⭐️ 에러 발생 시 테두리 색상 빨간색으로 변경 (ring-red-500)
              className={`appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border 
                ${idError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-pink-400'}
                placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 sm:text-sm bg-gray-50 hover:bg-white`}
              placeholder="아이디"
              value={id}
              onChange={handleIdChange}
            />
          </div>
          
          {/* ⭐️ 아이디 중복 에러 메시지 표시 영역 */}
          {idError && (
            <div className="flex items-center text-red-500 text-sm mt-1 ml-1 animate-pulse">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {idError}
            </div>
          )}

          {/* 2. 비밀번호 입력 */}
          <div className="relative">
            <label htmlFor="password" className="sr-only">비밀번호</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 sm:text-sm bg-gray-50 hover:bg-white"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* 3. 이름 입력 */}
          <div className="relative">
            <label htmlFor="name" className="sr-only">이름</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .883-.393 1.63-1.022 2.152-.473.39-1.09.648-1.78.648h-1.6c-1.38 0-2.5 1.12-2.5 2.5" />
              </svg>
            </div>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 sm:text-sm bg-gray-50 hover:bg-white"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* 4. 학번 입력 */}
          <div className="relative">
            <label htmlFor="studentId" className="sr-only">학번</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </div>
            <input
              id="studentId"
              name="studentId"
              type="number"
              required
              className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 sm:text-sm bg-gray-50 hover:bg-white"
              placeholder="학번 (예: 2024123456)"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>

          {/* 5. 전공 선택 */}
          <div className="relative">
            <label htmlFor="major" className="sr-only">전공</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <select
              id="major"
              name="major"
              required
              className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 sm:text-sm bg-gray-50 hover:bg-white cursor-pointer"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
            >
              <option value="" disabled>전공을 선택하세요</option>
              <option value="플랫폼SW융합전공">플랫폼SW융합전공</option>
              <option value="글로벌SW융합전공">글로벌SW융합전공</option>
              <option value="인공지능컴퓨팅전공">인공지능컴퓨팅전공</option>
              <option value="심화컴퓨팅전공">심화컴퓨팅전공</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* ✅ 버튼 색상 고정 (from-pink-500 to-pink-600) */}
          <div className="pt-2">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 shadow-lg shadow-pink-200 hover:shadow-xl hover:-translate-y-0.5"
            >
              회원가입 완료
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="font-bold text-pink-500 hover:text-pink-600 hover:underline transition-colors">
                로그인하기
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SignupPage;