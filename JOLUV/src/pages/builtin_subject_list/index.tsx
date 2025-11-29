import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SubjectCard from './components/SubjectCard';

// 스타일은 Tailwind CSS 클래스를 사용하여 버튼을 꾸밉니다.
// 별도 CSS 파일이 있다면 거기서 스타일을 관리해도 됩니다.
import './index.css';

type SortType = 'name' | 'grade' | 'credit';
type SemesterLabel = '1학기' | '2학기' | '계절학기';
type FilterCategory = '전공' | '교양'; // 필터 카테고리 타입 정의

interface Subject {
  id: number;
  name: string;
  credit: number;
  grade: number;        // 성적 (4.5 만점 기준 점수)
  category: string;     // 이수 구분 (전공기반, 전공핵심, 일반선택 등)
  needsRetake: boolean;
  year: number;         // 학년
  semester: SemesterLabel;
}

interface HistoryApiItem {
  lecid: string;
  lectureName: string;
  credit: number;
  received_grade: number;
  lecType: string;
  grade: number;        // 학년
  semester: number;     // 학기
}

const toSemesterLabel = (sem: number): SemesterLabel => {
  if (sem === 1) return '1학기';
  if (sem === 2) return '2학기';
  return '계절학기';
};

const Builtin: React.FC = () => {
  // 1. 학년/학기 상태 제거 -> 전공/교양 필터 상태 추가
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('전공');
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortType, setSortType] = useState<SortType>('name');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 2. 데이터 가져오기 (전체 내역 조회)
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        // 파라미터 없이 요청하여 전체 수강 이력을 가져옵니다.
        // (백엔드 API가 전체 조회를 지원해야 합니다. 만약 학번/학기 필수라면 백엔드 수정 필요)
        const res = await axios.get<HistoryApiItem[]>('/api/course/history', {
            withCredentials: true 
        });

        const mapped: Subject[] = res.data.map((item, idx) => {
          const point = item.received_grade;
          // B- (2.7) 이하 재이수 필요로 간주
          const needsRetake = (point <= 2.7);
          return {
            id: idx,
            name: item.lectureName,
            credit: item.credit,
            grade: item.received_grade,
            category: item.lecType,
            needsRetake,
            year: item.grade,
            semester: toSemesterLabel(item.semester),
          };
        });

        setSubjects(mapped);
      } catch (e) {
        console.error(e);
        setError('수강 이력 불러오기 실패');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSort = () => {
    setSubjects(prev => {
      const copied = [...prev];
      if (sortType === 'name') {
        copied.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortType === 'grade') {
        copied.sort((a, b) => b.grade - a.grade); // 높은 성적순
      } else if (sortType === 'credit') {
        copied.sort((a, b) => b.credit - a.credit); // 높은 학점순
      }
      return copied;
    });
  };

  // 3. 필터링 로직 수정 (검색어 + 카테고리)
  const filteredSubjects = subjects.filter(subject => {
    // (1) 검색어 필터
    const matchesSearch = subject.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // (2) 카테고리 필터 (전공 vs 교양)
    let matchesCategory = false;
    if (selectedCategory === '전공') {
      // '전공'이 포함된 모든 타입 (전공기반, 전공핵심, 전공선택 등)
      matchesCategory = subject.category.includes('전공');
    } else {
      // '전공'이 아닌 것들은 모두 교양(또는 일반선택)으로 간주
      matchesCategory = !subject.category.includes('전공');
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container w-full">
      <header className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        
        {/* 4. 전공 / 교양 선택 버튼 (Tabs) */}
        <div className="flex bg-gray-100 p-1 rounded-full">
            <button
                onClick={() => setSelectedCategory('전공')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                    selectedCategory === '전공'
                        ? 'bg-pink-500 text-white shadow-md'
                        : 'text-gray-500 hover:bg-gray-200'
                }`}
            >
                전공
            </button>
            <button
                onClick={() => setSelectedCategory('교양')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                    selectedCategory === '교양'
                        ? 'bg-pink-500 text-white shadow-md'
                        : 'text-gray-500 hover:bg-gray-200'
                }`}
            >
                교양
            </button>
        </div>

        {/* 우측 컨트롤 영역 (검색 & 정렬) */}
        <div className="flex gap-3 w-full md:w-auto">
            {/* 과목명 검색 */}
            <input
            type="text"
            placeholder="과목명 검색..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-400 flex-grow"
            />

            {/* 정렬 기준 선택 */}
            <select
            value={sortType}
            onChange={e => setSortType(e.target.value as SortType)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-400 bg-white"
            >
            <option value="name">이름순</option>
            <option value="grade">성적순</option>
            <option value="credit">학점순</option>
            </select>

            <button 
                onClick={handleSort}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm whitespace-nowrap"
            >
            정렬
            </button>
        </div>
      </header>

      {/* 로딩 및 에러 메시지 */}
      {loading && <div className="text-center py-10 text-gray-500">데이터를 불러오는 중...</div>}
      {error && <div className="text-center py-10 text-red-500 font-bold">{error}</div>}

      {/* 리스트 출력 */}
      <div className="cards-container grid grid-cols-1 gap-4">
        {filteredSubjects.length === 0 && !loading && !error ? (
            <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                해당하는 과목이 없습니다.
            </div>
        ) : (
            filteredSubjects.map(subject => (
                <SubjectCard key={subject.id} subject={subject} />
            ))
        )}
      </div>
    </div>
  );
};

export default Builtin;