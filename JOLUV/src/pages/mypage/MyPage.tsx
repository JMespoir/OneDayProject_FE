import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import './MyPage.css';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------
// ⭐️ [설정] Axios 전역 설정 (CSRF 토큰)
// ----------------------------------------------------------------------
axios.defaults.withCredentials = true; 
axios.defaults.xsrfCookieName = 'XSRF-TOKEN'; 
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

// ----------------------------------------------------------------------
// 1. 타입 정의
// ----------------------------------------------------------------------

interface UserInfo {
  name: string;      
  user_id: string;
  major: string;
  track: string;
  profileImage?: string;
  studentId?: string;
  eng_score?: string; 
  totalGpa?: number; 
  majorGpa?: number; 
  internship?: boolean;
}

interface ActivityItem {
  id?: number;
  user_id?: string;
  category: string;
  title : string;
  detail: string;
  year: string;
}

const MyPage: React.FC = () => {
  const { userId } = useAuth(); // 로그인 상태 가져오기
  const navigate = useNavigate();

  // ----------------------------------------------------------------------
  // 2. State 관리
  // ----------------------------------------------------------------------
  const [user, setUser] = useState<UserInfo | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  
  const [form, setForm] = useState<ActivityItem>({
    category: '대회', title : '', detail: '', year: ''
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ActivityItem>({
    category: '', title: '', detail: '', year: ''
  });

  const [engScoreInput, setEngScoreInput] = useState<string>('');
  const [internshipChecked, setInternshipChecked] = useState<boolean>(false);
  const [selectedTrack, setSelectedTrack] = useState<string>('');
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  // ----------------------------------------------------------------------
  // 3. Helper Functions & Logic
  // ----------------------------------------------------------------------
  
  const showToastMessage = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const fetchActivities = async (studentId: number) => {
      try {
          const response = await axios.get('/api/activity', {
              params: { studentId },
              withCredentials: true
          });
          if (Array.isArray(response.data)) {
              setActivities(response.data);
          }
      } catch (error) {
          console.error("활동 목록 갱신 실패:", error);
      }
  };

  const getFixedTrackValue = (majorName: string): string | null => {
      const refinedMajor = majorName.replace(/\s+/g, '');
      if (refinedMajor.includes('심화컴퓨팅전공')) {
          return '심화컴퓨팅전공트랙';
      }
      if (refinedMajor.includes('인공지능컴퓨팅전공')) {
          return '인공지능트랙';
      }
      return null;
  };

  // ----------------------------------------------------------------------
  // 4. 초기 데이터 조회 (useEffect)
  // ----------------------------------------------------------------------
  useEffect(() => {
    // ⭐️ 로그인 안 되어 있으면 데이터 요청 자체를 안 함
    if (!userId) return;

    const fetchData = async () => {
      try {
        const userRes = await axios.get('/api/auth/mypage', { withCredentials: true });
        const data = userRes.data;
        console.log("MyPage 사용자 데이터:", data);
        let fetchedUser: UserInfo | null = null;
        let currentUserStudentId = 0;

        if (data && typeof data === 'object') {
            currentUserStudentId = parseInt(data.studentId || '0');

            const rawGpa = data.totalgpa ?? data.gpa; 
            const rawGpaMajor = data.majorgpa ?? data.gpa_major;
            
            const jsonGpa = parseFloat(String(rawGpa)) || 0.0;
            const jsonGpaMajor = parseFloat(String(rawGpaMajor)) || 0.0;
            
            const rawEngScore = data.engscore ?? data.eng_score; 

            fetchedUser = {
                name: data.name || '이름 없음',
                user_id: data.userId || userId || '',
                studentId: data.studentId || '',
                major: data.major || '컴퓨터학부',
                track: data.specific_major || data.track || '다중전공트랙', 
                eng_score: String(rawEngScore || "0"),
                totalGpa: jsonGpa,       
                majorGpa: jsonGpaMajor, 
                internship: Boolean(data.internship),
                profileImage: ''
            };
        }

        if (fetchedUser) {
            setUser(fetchedUser);
            setEngScoreInput(fetchedUser.eng_score || "0");
            setInternshipChecked(fetchedUser.internship || false);

            const fixedTrack = getFixedTrackValue(fetchedUser.major);
            if (fixedTrack) {
                setSelectedTrack(fixedTrack);
            } else {
                setSelectedTrack(fetchedUser.track || '다중전공트랙');
            }
        }

        if (currentUserStudentId !== 0) {
            await fetchActivities(currentUserStudentId);
        }

      } catch (error) {
        console.error('데이터 조회 실패:', error);
      }
    };

    fetchData();
  }, [userId]);

  // ----------------------------------------------------------------------
  // 5. 이벤트 핸들러
  // ----------------------------------------------------------------------
  // ... (기존 핸들러 함수들 - 변경 없음)
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.detail || !form.year) {
        showToastMessage("모든 내용을 입력해주세요 (제목, 내용, 일자).");
        return;
    }
    try {
        const newActivity = {
            category: form.category,
            title: form.title,
            detail: form.detail,
            year: form.year
        };
        const response = await axios.post('/api/activity', newActivity, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        if (response.status === 200 || response.status === 201) {
            showToastMessage('경력이 추가되었습니다! 👍');
            if (user?.studentId) {
                await fetchActivities(parseInt(user.studentId));
            }
            setForm({ category: '대회', title: '', detail: '', year: '' });
        }
    } catch (error) {
        console.error('활동 추가 실패:', error);
        showToastMessage('추가 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id?: number) => {
      if (!id) return;
      if (!window.confirm("정말로 삭제하시겠습니까?")) return;
      try {
          await axios.delete(`/api/activity/${id}`, { withCredentials: true });
          showToastMessage("삭제되었습니다.");
          setActivities(prev => prev.filter(item => item.id !== id));
      } catch (error) {
          console.error("삭제 실패:", error);
          showToastMessage("삭제 중 오류가 발생했습니다.");
      }
  };

  const handleEditClick = (item: ActivityItem) => {
      if (!item.id) return;
      setEditingId(item.id);
      setEditForm({ ...item });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
      if (!editingId) return;
      try {
          const updateData = {
              category: editForm.category,
              title: editForm.title,
              detail: editForm.detail,
              year: editForm.year
          };
          await axios.put(`/api/activity/${editingId}`, updateData, {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true
          });
          showToastMessage("수정되었습니다. ✅");
          setActivities(prev => prev.map(item => 
              item.id === editingId ? { ...item, ...updateData } : item
          ));
          setEditingId(null);
      } catch (error) {
          console.error("수정 실패:", error);
          showToastMessage("수정 중 오류가 발생했습니다.");
      }
  };

  const handleEditCancel = () => {
      setEditingId(null);
  };

  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTrack(e.target.value);
  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => setEngScoreInput(e.target.value);
  const handleInternshipChange = (e: React.ChangeEvent<HTMLInputElement>) => setInternshipChecked(e.target.checked);
  
  const handleUpdateInfo = async () => {
      if (!user) return;
      
      const finalEngScore = engScoreInput && engScoreInput.trim() !== '' 
                            ? parseInt(engScoreInput, 10) 
                            : 0; 

      const updatePayload = {
          specific_major: selectedTrack, 
          major: user.major,
          eng_score: finalEngScore,
          engScore: finalEngScore, 
          internship: internshipChecked
      };
      
      try {
        const response = await axios.post('/api/auth/mypage/update', updatePayload, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });

        if (response.status === 200) {
            showToastMessage('정보가 저장되었습니다! 🎉');
            setUser({ 
                ...user, 
                track: selectedTrack, 
                eng_score: String(finalEngScore), 
                internship: internshipChecked 
            });
        }
      } catch(e: any) { 
          console.error("정보 저장 실패:", e); 
          if (e.response) {
               if (e.response.status === 401) showToastMessage('세션이 만료되었습니다.');
               else if (e.response.status === 400) showToastMessage('입력값이 올바르지 않습니다 (숫자 확인).');
               else showToastMessage('저장 실패 (서버 오류)');
          }
      }
  };
  const isTrackFixed = () => {
      if (!user) return false;
      return getFixedTrackValue(user.major) !== null;
  };

  const renderTrackOptions = () => { 
    if (!user) return <option disabled>로딩 중...</option>;
    const majorName = user.major.replace(/\s+/g, '');
    
    if (majorName.includes('심화컴퓨팅전공')) {
        return <option value="심화컴퓨팅전공트랙">심화컴퓨팅전공트랙</option>;
    }
    else if (majorName.includes('인공지능컴퓨팅전공')) {
        return <option value="인공지능트랙">인공지능트랙</option>;
    }
    else if (majorName.includes('글로벌SW융합전공') || majorName.includes('글로벌소프트웨어융합전공')) {
        return (
            <>
                <option value="다중전공트랙">다중전공트랙</option>
                <option value="해외복수학위트랙">해외복수학위트랙</option>
                <option value="학-석사연계트랙">학-석사연계트랙</option>
            </>
        );
    }
    return (
        <>
            <option value="일반과정">일반과정</option>
            <option value="심화과정">심화과정</option>
        </>
    );
  };

  // ⭐️⭐️⭐️ [핵심] 로그인 여부 체크 및 안내 화면 리턴 ⭐️⭐️⭐️
  // 이 코드가 실제 마이페이지 UI(return)보다 위에 있어야 합니다.
  if (!userId) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center border border-gray-100">
                {/* 자물쇠 아이콘 */}
                <div className="mx-auto w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
                    <span className="text-4xl">🔒</span>
                </div>
                
                <h2 className="text-2xl font-extrabold text-gray-800 mb-3">
                    로그인이 필요한 서비스입니다
                </h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    마이페이지에서 나의 학점과<br/>
                    다양한 활동 내역을 관리해보세요!
                </p>
                
                <button
                    onClick={() => navigate('/login')}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    로그인 하러 가기
                </button>
            </div>
        </div>
    );
  }

  // ----------------------------------------------------------------------
  // 6. 메인 렌더링 (로그인 된 사용자만 볼 수 있음)
  // ----------------------------------------------------------------------
  return (
    <div className="mypage__layout">
      {toast.show && (
        <div className="toast-notification">
            <span className="toast-icon">✅</span>
            {toast.message}
        </div>
      )}

      <div className="mypage__container box__left">
         <header className="mypage__header">
            <div className="profile__emoji">🎓</div>
            <div>
                <h1 className="user__name"> {user ? `${user.name} 님` : '...'}</h1>
                {user?.studentId && (
                    <p className="user__info" style={{ marginBottom: '5px', fontWeight: 'bold' }}>
                        학번 : {user.studentId}
                    </p>
                )}
                <p className="user__info">{user?.major}</p>
            </div>
         </header>

         {/* ... 나머지 마이페이지 UI 코드 ... */}
         <section className="mypage__track-section">
             <h2>세부 트랙 정보</h2>
             <div className="score__content">
                 <div className="score__item">
                     <label className="score__label track-label">트랙</label>
                     {isTrackFixed() ? (
                        <div className="fixed-track-display">
                            <span className="fixed-track-text">{selectedTrack}</span>
                        </div>
                     ) : (
                        <select 
                           value={selectedTrack} 
                           onChange={handleTrackChange}
                           className="track__select"
                         >
                           {renderTrackOptions()}
                         </select>
                     )}
                 </div>
                 {!isTrackFixed() && (
                    <button onClick={handleUpdateInfo} className="score__save-btn secondary">트랙 저장</button>
                 )}
                 {isTrackFixed() && (
                    <p className="fixed-track-info">
                        ※ 전공에 따라 트랙이 자동 지정되었습니다.
                    </p>
                 )}
             </div>
         </section>

         <section className="mypage__score">
             <h2>공인어학성적 관리</h2>
             <div className="score__content">
                 <div className="score__item">
                     <label htmlFor="engScore" className="score__label">TOEIC</label>
                     <div className="score__input-group">
                         <input type="text" id="engScore" value={engScoreInput} onChange={handleScoreChange} placeholder="0" className="score__input" />
                         <span className="score__unit">점</span>
                     </div>
                 </div>
                 <button onClick={handleUpdateInfo} className="score__save-btn secondary">성적 저장</button>
             </div>
         </section>

         <section className="mypage__internship">
             <h2>현장실습 관리</h2>
             <div className="score__content">
                 <div className="score__checkbox-row">
                     <label htmlFor="internshipCheck" className="checkbox-label">
                         <input type="checkbox" id="internshipCheck" checked={internshipChecked} onChange={handleInternshipChange} className="checkbox-input" />
                         <span className="checkbox-text">현장실습(인턴십) 이수 완료</span>
                     </label>
                 </div>
                 <button onClick={handleUpdateInfo} className="score__save-btn secondary">실습 여부 저장</button>
             </div>
         </section>
      </div>

      <div className="mypage__container box__right">
        {/* 학점 현황 */}
        <section className="mypage__gpa">
          <h2>학점 현황</h2>
          <div className="score__content">
            <div className="gpa__container">
              <div className="gpa__item">
                  <span className="gpa__label">전체 학점</span>
                  <div className="gpa__value-wrapper">
                    <span className="gpa__value">{user?.totalGpa?.toFixed(2) || "0.00"}</span>
                    <span className="gpa__max"> / 4.3</span>
                  </div>
              </div>
              <div className="gpa__divider"></div>
              <div className="gpa__item">
                  <span className="gpa__label">전공 학점</span>
                  <div className="gpa__value-wrapper">
                    <span className="gpa__value highlight">{user?.majorGpa?.toFixed(2) || "0.00"}</span>
                    <span className="gpa__max"> / 4.3</span>
                  </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* 경력 및 활동 섹션 */}
        <section className="career__section">
          <h2>경력 및 활동</h2>
          
          <div className="career__list">
            {activities.length === 0 ? (
                <p className="empty-message">등록된 활동이 없습니다.</p>
            ) : (
                activities.map((item, idx) => {
                    const isEditing = editingId === item.id;
                    
                    return (
                        <div className="career__card" key={item.id || idx}>
                            {isEditing ? (
                                <div className="career__edit-form">
                                    <div className="form-row top-row">
                                        <select name="category" value={editForm.category} onChange={handleEditChange} className="custom-select">
                                            <option value="대회">대회</option>
                                            <option value="인턴십">인턴십</option>
                                            <option value="자격증">자격증</option>
                                            <option value="기타">기타</option>
                                        </select>
                                        <input name="year" value={editForm.year} onChange={handleEditChange} className="custom-input year-input" placeholder="일자 (YYYY-MM-DD)" />
                                    </div>
                                    <input name="title" value={editForm.title} onChange={handleEditChange} className="custom-input title-input" placeholder="제목" />
                                    <input name="detail" value={editForm.detail} onChange={handleEditChange} className="custom-input detail-input" placeholder="상세 내용" />
                                    <div className="edit-actions">
                                        <button onClick={handleEditSave} className="btn-save">저장</button>
                                        <button onClick={handleEditCancel} className="btn-cancel">취소</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="career__view">
                                    <div className="view-header">
                                        <span className={`badge badge--${item.category}`}>{item.category}</span>
                                        <span className="view-year">{item.year}</span>
                                    </div>
                                    <div className="view-body">
                                        <h3 className="view-title">{item.title}</h3>
                                        <p className="view-detail">{item.detail}</p>
                                    </div>
                                    <div className="view-actions flex gap-2">
                                        {/* 수정 버튼 */}
                                        <button 
                                            onClick={() => handleEditClick(item)} 
                                            className="text-gray-400 hover:text-blue-500 transition-colors p-1" 
                                            title="수정"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </button>

                                        {/* 삭제 버튼 */}
                                        <button 
                                            onClick={() => handleDelete(item.id)} 
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1" 
                                            title="삭제"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
          </div>

          <hr className="divider" />

          <h3 className="form-title">새 활동 추가</h3>
          <form className="career__add-form" onSubmit={handleAddActivity}>
            <div className="form-row top-row">
              <select name="category" value={form.category} onChange={handleFormChange} className="custom-select">
                <option value="대회">대회</option>
                <option value="인턴십">인턴십</option>
                <option value="자격증">자격증</option>
                <option value="기타">기타</option>
              </select>
              <input name="year" type="text" value={form.year} onChange={handleFormChange} required className="custom-input year-input" placeholder="일자 (예: 2025-03-01)" />
            </div>
            <div className="form-row">
                <input name="title" type="text" placeholder="활동 제목을 입력하세요" value={form.title} onChange={handleFormChange} required className="custom-input title-input" />              
            </div>
            <div className="form-row">
                <input name="detail" type="text" placeholder="상세 내용을 입력하세요 (예: 대상 수상)" value={form.detail} onChange={handleFormChange} required className="custom-input detail-input" />
            </div>
            <button type="submit" className="btn-submit-full">추가하기</button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default MyPage;