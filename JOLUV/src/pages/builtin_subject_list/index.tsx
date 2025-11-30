import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SubjectCard from './components/SubjectCard';
import './index.css';

// ----------------------------------------------------------------------
// 1. 타입 정의
// ----------------------------------------------------------------------

type SortType = 'name' | 'grade' | 'credit';
type SemesterLabel = '1학기' | '2학기' | '계절학기';
type FilterCategory = '전체' | '전공' | '교양';

export interface Subject {
  id: number;
  name: string;
  credit: number;
  grade: string;        // 표시용 등급 (A+, B0 ...)
  score: number;        // 정렬용 점수 (4.3, 3.0 ...)
  category: string;
  needsRetake: boolean;
  year: number;
  semester: SemesterLabel | string;
}

interface HistoryApiItem {
  lecid: string;
  lectureName: string;
  credit: number;
  received_grade: number;
  lecType: string;
  grade: number;
  semester: number;
}

interface BuiltinProps {
  mockData?: Subject[];
}

// ----------------------------------------------------------------------
// 2. 헬퍼 함수
// ----------------------------------------------------------------------

const toSemesterLabel = (sem: number): SemesterLabel => {
  if (sem === 1) return '1학기';
  if (sem === 2) return '2학기';
  return '계절학기';
};

const convertScoreToGrade = (score: number): string => {
  if (score >= 4.3) return 'A+';
  if (score >= 4.0) return 'A0';
  if (score >= 3.7) return 'A-';
  if (score >= 3.3) return 'B+';
  if (score >= 3.0) return 'B0';
  if (score >= 2.7) return 'B-';
  if (score >= 2.4) return 'C+';
  if (score >= 2.0) return 'C0';
  if (score >= 1.7) return 'C-';
  if (score >= 1.3) return 'D+';
  if (score >= 1.0) return 'D0';
  return 'F';
};

// ----------------------------------------------------------------------
// 3. 컴포넌트 구현
// ----------------------------------------------------------------------

const Builtin: React.FC<BuiltinProps> = ({ mockData }) => {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortType, setSortType] = useState<SortType>('name');

  const [subjects, setSubjects] = useState<Subject[]>(mockData || []);
  const [loading, setLoading] = useState<boolean>(!mockData);
  const [error, setError] = useState<string | null>(null);

  // 데이터 로딩
  useEffect(() => {
    const fetchHistory = async () => {
      if (mockData) {
        setSubjects(mockData);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await axios.get<HistoryApiItem[]>('/api/course/history', {
          withCredentials: true,
        });

        const mapped: Subject[] = res.data.map((item, idx) => {
          const point = item.received_grade;
          const needsRetake = point <= 2.7; // C+ 이하 재수강
          return {
            id: idx,
            name: item.lectureName,
            credit: item.credit,
            grade: convertScoreToGrade(item.received_grade),
            score: item.received_grade,
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
  }, [mockData]);

  // ----------------------------------------------------------------------
  // 4. 이벤트 핸들러 / 필터링 / 정렬
  // ----------------------------------------------------------------------

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSort = () => {
    setSubjects(prev => {
      const copied = [...prev];
      if (sortType === 'name') {
        copied.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortType === 'grade') {
        copied.sort((a, b) => b.score - a.score);
      } else if (sortType === 'credit') {
        copied.sort((a, b) => b.credit - a.credit);
      }
      return copied;
    });
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    let matchesCategory = true;
    if (selectedCategory === '전공') {
      matchesCategory = subject.category.includes('전공');
    } else if (selectedCategory === '교양') {
      matchesCategory = !subject.category.includes('전공');
    }

    return matchesSearch && matchesCategory;
  });

  // ----------------------------------------------------------------------
  // 5. 레이아웃 (헤더 sticky, 내부 박스만 흰 카드)
  // ----------------------------------------------------------------------

  return (
    <div className="w-full min-h-full bg-[#f7f7fb] px-6 md:px-10 pb-10">
      {/* 배경은 투명, 안쪽 컨트롤만 흰 카드 */}
      <header
        className="
          sticky top-0 z-20
          flex flex-col md:flex-row gap-4 justify-between items-center
          py-3 mb-3
        "
      >
        {/* 필터 버튼 박스 */}
        <div className="flex bg-white shadow-sm rounded-full p-1">
          <button
            onClick={() => setSelectedCategory('전체')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
              selectedCategory === '전체'
                ? 'bg-pink-500 text-white shadow-md'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setSelectedCategory('전공')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
              selectedCategory === '전공'
                ? 'bg-pink-500 text-white shadow-md'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            전공
          </button>
          <button
            onClick={() => setSelectedCategory('교양')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
              selectedCategory === '교양'
                ? 'bg-pink-500 text-white shadow-md'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            교양
          </button>
        </div>

        {/* 검색 + 정렬 박스 */}
        <div className="flex gap-3 w-full md:w-auto bg-white shadow-sm rounded-xl px-3 py-2 items-center">
          <input
            type="text"
            placeholder="과목명 검색..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-400 flex-grow text-sm bg-white"
          />

          <select
            value={sortType}
            onChange={e => setSortType(e.target.value as SortType)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-400 bg-white text-sm"
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

      {loading && (
        <div className="text-center py-10 text-gray-500">
          데이터를 불러오는 중...
        </div>
      )}
      {error && (
        <div className="text-center py-10 text-red-500 font-bold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
        {filteredSubjects.length === 0 && !loading && !error ? (
          <div className="col-span-full text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300 w-full">
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
