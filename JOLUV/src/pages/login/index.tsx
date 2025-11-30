import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>(''); 

    const navigate = useNavigate();
    const { isLoggedIn, userId, login, logout } = useAuth();

    // 입력 시 에러 초기화
    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setId(e.target.value);
        if (errorMessage) setErrorMessage('');
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (errorMessage) setErrorMessage('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        const formData = new URLSearchParams();
        formData.append('userId', id);
        formData.append('password', password);

        try {
             const response = await axios.post('/api/auth/login', formData, {
                 headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                 withCredentials: true,
            });

            if (response.status === 200) {
                if (response.request?.responseURL && response.request.responseURL.includes('error')) {
                     setErrorMessage("아이디 또는 비밀번호가 일치하지 않습니다.");
                     return;
                }
                login(id); 
                navigate("/"); 
            }

        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                     setErrorMessage("아이디 또는 비밀번호가 틀렸습니다.");
                } else if (error.code === "ERR_NETWORK") {
                    setErrorMessage("서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
                } else {
                     setErrorMessage("로그인 처리 중 문제가 발생했습니다.");
                }
            } else {
                setErrorMessage("알 수 없는 오류가 발생했습니다.");
            }
        }
    };

    const handleLogout = async () => {
        try { logout(); } catch (error) {}
    };

    // ----------------------------------------------------------------------
    // 1. 이미 로그인 된 상태의 UI
    // ----------------------------------------------------------------------
    if (isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-pink-100">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl border border-white/50 backdrop-blur-sm text-center">
                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <span className="text-4xl">🔓</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">이미 로그인 상태입니다</h2>
                    <p className="text-gray-600 mb-8 mt-2">
                        환영합니다, <span className="font-bold text-pink-500 text-lg">{userId}</span> 님!
                    </p>
                    
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/mypage')}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            마이페이지로 이동
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all border border-gray-200"
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ----------------------------------------------------------------------
    // 2. 로그인 폼 UI
    // ----------------------------------------------------------------------
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl border border-white/50 backdrop-blur-sm">
                
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-black">
                        로그인
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        서비스 이용을 위해 로그인해주세요.
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* 아이디 입력 */}
                        <div className="relative">
                            <label htmlFor="id" className="sr-only">아이디</label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                {/* User Icon */}
                                <svg className={`h-5 w-5 ${errorMessage ? 'text-red-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="id"
                                value={id}
                                onChange={handleIdChange}
                                className={`appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border 
                                    ${errorMessage ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-gray-300 focus:ring-pink-400 bg-gray-50 hover:bg-white'}
                                    placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 sm:text-sm`}
                                placeholder="아이디"
                                required
                            />
                        </div>

                        {/* 비밀번호 입력 */}
                        <div className="relative">
                            <label htmlFor="password" className="sr-only">비밀번호</label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                {/* Lock Icon */}
                                <svg className={`h-5 w-5 ${errorMessage ? 'text-red-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={handlePasswordChange}
                                className={`appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border 
                                    ${errorMessage ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-gray-300 focus:ring-pink-400 bg-gray-50 hover:bg-white'}
                                    placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 sm:text-sm`}
                                placeholder="비밀번호"
                                required
                            />
                        </div>
                    </div>

                    {/* 에러 메시지 표시 영역 */}
                    {errorMessage && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm flex items-center text-red-600 animate-pulse">
                            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-pink-500 hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 shadow-lg shadow-pink-200 hover:shadow-xl hover:-translate-y-0.5"
                    >
                        로그인 하기
                    </button>
                    
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">
                            계정이 없으신가요?{' '}
                            <Link to="/signup" className="font-bold text-pink-500 hover:text-pink-600 hover:underline transition-colors">
                                회원가입하기
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;