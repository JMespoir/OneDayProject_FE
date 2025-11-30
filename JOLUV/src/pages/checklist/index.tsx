// ChecklistPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../contexts/AuthContext'; // 로그인 상태 확인용

// ----------------------------------------------------------------------
// 1. 타입 정의
// ----------------------------------------------------------------------

interface ApiCheckItem {
    category: string;
    current: number;
    required: number;
    passed: boolean;
    message: string;
}

interface GraduationResponse {
    majorType: string;
    studentId: number;
    graduationPossible: boolean;
    checkList: ApiCheckItem[];
    missingCourses: string[];
}

interface RequirementRowProps {
    title: string;
    progress: string;
    status: '완료' | '미완료';
    percentage: number;
    message: string;
}

// ----------------------------------------------------------------------
// 📋 목업 데이터 정의 (로그아웃 상태용)
// ----------------------------------------------------------------------
const MOCK_CHECKLIST_DATA: GraduationResponse = {
    studentId: 2025000000!,
    majorType: "심화컴퓨팅전공트랙 (예시)",
    graduationPossible: false,
    checkList: [
        { category: "총 학점", current: 120, required: 130, passed: false, message: "총 학점이 10학점 부족합니다." },
        { category: "전공 학점", current: 65, required: 70, passed: false, message: "전공 학점이 부족합니다." },
        { category: "교양 학점", current: 30, required: 30, passed: true, message: "이수 완료" },
        { category: "영어 성적", current: 850, required: 700, passed: true, message: "기준 점수 충족 (토익)" },
        { category: "현장 실습", current: 1, required: 1, passed: true, message: "인턴십 이수 완료" },
    ],
    missingCourses: ["캡스톤디자인", "소프트웨어공학", "운영체제"]
};

// ----------------------------------------------------------------------
// 2. RequirementRow 컴포넌트
// ----------------------------------------------------------------------
const RequirementRow: React.FC<RequirementRowProps> = ({
                                                           title,
                                                           progress,
                                                           status,
                                                           percentage,
                                                           message
                                                       }) => {
    const getStatusBadge = () => {
        return status === '완료'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700';
    };

    return (
        <div className="p-4 border-b hover:bg-gray-50 transition-colors">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <div className="flex-1 mb-4 sm:mb-0 mr-4">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-lg font-semibold text-gray-800">{title}</span>
                        <span className="text-sm text-gray-500">{progress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className={`h-2.5 rounded-full ${status === '완료' ? 'bg-green-500' : 'bg-pink-400'}`}
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{message}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge()}`}>
                    {status}
                  </span>
                </div>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// 3. 메인 페이지 컴포넌트
// ----------------------------------------------------------------------
const ChecklistPage: React.FC = () => {
    const { userId } = useAuth(); // 로그인 상태 가져오기
    const navigate = useNavigate();

    const [data, setData] = useState<GraduationResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            // ⭐️ 1. 로그인 안 되어 있으면 목업 데이터 사용
            if (!userId) {
                setData(MOCK_CHECKLIST_DATA);
                setLoading(false);
                return;
            }

            // ⭐️ 2. 로그인 되어 있으면 실제 API 호출
            try {
                setLoading(true);
                const response = await axios.get<GraduationResponse>(`/api/graduation/my-status`);
                setData(response.data);
            } catch (err) {
                console.error(err);
                setError("데이터를 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]); // userId 변경 시 재실행

    if (loading) return <div className="p-8 text-center">로딩 중...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!data) return null;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* ⭐️ 안내 배너 (로그아웃 상태일 때만 표시) */}
            {!userId && (
                <div className="flex justify-between items-center bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">👀</span>
                        <div>
                            <p className="text-gray-800 font-bold text-sm sm:text-base">
                                현재는 예시 데이터가 표시되고 있습니다.
                            </p>
                            <p className="text-gray-600 text-xs sm:text-sm">
                                내 진짜 졸업 요건을 확인하려면 로그인해주세요.
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/login')}
                        className="bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-blue-700 transition-colors whitespace-nowrap ml-4"
                    >
                        로그인 하기
                    </button>
                </div>
            )}

            {/* 1. 프로필 섹션 */}
            <section className="flex items-center p-6 bg-white rounded-lg shadow-md mb-8 border-l-4 border-pink-500">
                <div className="w-16 h-16 bg-gray-200 rounded-full mr-6 flex items-center justify-center text-2xl">
                    🎓
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{data.studentId} 님</h2>
                    <p className="text-gray-600">
                        판정된 전공 트랙: <span className="font-bold text-indigo-600">{data.majorType}</span>
                    </p>
                    <p className={`font-semibold mt-1 ${data.graduationPossible ? 'text-green-600' : 'text-red-500'}`}>
                        {data.graduationPossible ? "🎉 졸업 가능합니다!" : "⚠️ 아직 부족한 요건이 있습니다."}
                    </p>
                </div>
            </section>

            {/* 2. 요건 리스트 섹션 */}
            <h1 className="text-2xl font-bold text-gray-800 mb-4">졸업 요건 상세 점검</h1>
            <section className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
                    <span className="text-xs font-medium text-gray-500 uppercase">체크 항목</span>
                    <span className="text-xs font-medium text-gray-500 uppercase">상태</span>
                </div>
                <div>
                    {data.checkList.map((item, index) => {
                        const percent = item.required > 0
                            ? Math.min((item.current / item.required) * 100, 100)
                            : (item.passed ? 100 : 0);

                        return (
                            <RequirementRow
                                key={index}
                                title={item.category}
                                progress={`${item.current} / ${item.required}`}
                                status={item.passed ? '완료' : '미완료'}
                                percentage={percent}
                                message={item.message}
                            />
                        );
                    })}
                </div>
            </section>

            {/* 3. 미이수 필수 과목 경고창 */}
            {data.missingCourses && data.missingCourses.length > 0 && (
                <section className="bg-red-50 border border-red-200 rounded-lg p-4 mt-8">
                    <h3 className="text-red-700 font-bold text-lg mb-2">🚨 미이수 필수 과목</h3>
                    <ul className="list-disc list-inside text-red-600 space-y-1">
                        {data.missingCourses.map((course, idx) => (
                            <li key={idx}>{course}</li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
};

export default ChecklistPage;