# 👨‍🎓 JOLUV

## 기여자
<table>
<tr>
<td>

|                 Sion Jang                  |
| :---------------------------: |
| <img width="240px" src="https://avatars.githubusercontent.com/Sionjang23" /> |
|     [@sionjang23](https://github.com/jangsion23)       |
|          National - 🇰🇷 Republic Of Korea           |

</td>
<td>

|                  Dohyeon Kim                    |
| :------------------------------------------------: |
| <img width="240px" src="https://avatars.githubusercontent.com/rlaehgus06" /> |
|     [@rlaehgus06](https://github.com/rlaehgus06) |
|          National - 🇰🇷 Republic Of Korea            |

</td>
</tr>
</table>

## Title
JOLUV  - 경북대학교 졸업 관리 플랫폼 "성공적인 졸업을 위한 길라잡이"

경북대학교 컴퓨터학부의 **복잡한 졸업 요건을 한눈에 파악하고, 체계적으로 학점과 커리어를 관리**할 수 있는 경북대학교 컴퓨터학부생의 맞춤형 웹 서비스입니다.

## 프로젝트 개요
컴퓨터학부 내부에 필요한 졸업 요건들에 대해서 기존에는 확인이 어려워 직접 수기로 적거나 입력해서 관리하는 방식을 택해야 했습니다. 이러한 불편함을 인지하고 졸업에 필요한 요소들을 미리 파악해 졸업을 하는데 부족한 점과 현재 나의 상태를 보다 편리하게 알고싶다는 니즈가 강하다는 것을 주변 학우들을 통해 알게 되었고, 이러한 고민이 발단이 되어 졸업 요건을 확인할 수 있는 길라잡이를 만들고자 JOLUV라는 서비스를 기획하게 되었습니다.

### 대상
경북대학교 컴퓨터학부 소속 학생
### 목표
복잡한 졸업 요건을 편리한 UI로 쉽게 확인할 수 있는 서비스 제공.

##  주요 기능

### 1. 스마트 대시보드 & 학점 시각화

* TotalCredits / EachCredits 컴포넌트를 통한 학점 시각화
* Tailwind 기반 커스텀 Progress Bar로 달성률(%) 표시
* Loading / Error / Empty 상태 처리로 명확한 피드백 제공

---

### 2. 인증 시스템 

* Context API + AuthContext로 전역 로그인 상태 관리
* ProtectedRoute로 로그인 필요 페이지 보호
* localStorage 기반 자동 로그인 유지 기능

---


### 3. 수강 과목 관리

* 과목명 검색 + 전공/교양 필터 기능
* 재수강 필요 과목 자동 태그 표시
* 과목 목록 추가·삭제 기능 제공

---

### 4. 졸업 요건 check

* 졸업 요건에 맞는 Progress Bar 달성률(%) 표시
* 트랙에 따라 미이수 필수 과목 표시

---

### 5. 마이페이지 & 커리어 관리

* 전공/트랙 설정 및 수정 기능
* 어학/자격증/대외활동 CRUD 관리
* 개인 포트폴리오 기록 및 정리
* 수강 정리과목을 통한 성적 표시

---

##  기술 스택

| Category    | Technology   | Version | Description       |
| ----------- | ------------ | ------- | ----------------- |
| Frontend    | React        | ^19.1.1 | 컴포넌트 기반 프론트엔드 개발  |
| Language    | TypeScript   | ~5.8.3  | 정적 타입 기반 코드 안정성   |
| Build Tool  | Vite         | ^7.2.2  | 빠른 개발 환경 + HMR    |
| Styling     | Tailwind CSS | ^3.4.14 | Utility-first CSS |
| Routing     | React Router | ^7.9.3  | SPA 라우팅           |
| HTTP Client | Axios        | ^1.13.2 | REST API 통신       |

---

배포 링크

**JOLUV 서비스 바로가기 : (https://one-day-project-fe-4z4t.vercel.app/)**

---

##  주요 구현 로직

### ✔ Authentication Flow

* 앱 실행 시 localStorage 기반 로그인 상태 자동 복구
* `login(id)` → 상태 업데이트 및 스토리지 저장
* `logout()` → userId·accessToken 삭제 및 상태 초기화

---

### ✔ Protected Routes

```tsx
<Route 
  path="mypage" 
  element={
    <ProtectedRoute>
      <MyPage />
    </ProtectedRoute>
  }
/>
```

로그인하지 않은 경우 자동으로 로그인 페이지로 리다이렉트됩니다.

---

## Frontend Developers

### **장시온 (Frontend Developer)**

* UI/UX 설계 및 구현
* API 연동 / 데이터 시각화
* 마이페이지 구축
* 로그인 및 회원가입 구현

### **김도현 (Frontend Developer)**

* API 연동 / 데이터 시각화
* 수강 과목 관리 기능 구축
* 학점 계산/관리 로직 개발
* 졸업 요건 체크리스트 구현


