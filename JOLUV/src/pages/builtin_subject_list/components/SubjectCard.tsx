import React from 'react';
import type { Subject } from '../types';
import './SubjectCard.css';

interface SubjectCardProps {
  subject: Subject;
}

// ❌ [삭제] 이 함수는 필요 없습니다. 
// 부모 컴포넌트(Builtin.tsx)에서 이미 변환해서 보내주고 있기 때문입니다.
/*
function gradeToString(grade: number): string {
  const map: Record<number, string> = {
    ...
  };
  return map[numGrade] ?? 'NP';
}
*/


const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  // grade에는 이미 "A+", "B0" 같은 문자열이 들어있습니다.
  const { name, credit, grade, category, needsRetake } = subject;

  return (
    <div className="subject-card">
      <div className="subject-name">{name}</div>

      <div className="subject-meta">
        <span className="subject-credit-pill">{credit}학점</span>
        
        {/* ⭐️ [수정] 함수 호출을 제거하고 grade 변수를 바로 사용하세요 */}
        <span className="subject-grade-pill">성적 {grade}</span>
      </div>

      <div className="subject-extra">

      </div>

      <div className="button-container">
        <span className="compulsory-btn">{category}</span>
        {needsRetake && <span className="retake-btn">재수강 필요</span>}
      </div>
    </div>
  );
};

export default SubjectCard;