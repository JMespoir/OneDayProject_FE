JOLUV  - 경북대학교 졸업 관리 플랫폼
"성공적인 졸업을 위한 길라잡이, JOLUV"

경북대학교 컴퓨터학부의 복잡한 졸업 요건을 한눈에 파악하고, 체계적으로 학점과 커리어를 관리할 수 있는 경북대학교 컴퓨터학부생의 맞춤형 웹 서비스입니다.

프로젝트 개요
대학생들이 졸업을 위해 확인해야 할 이수 학점, 필수 과목, 졸업 요건(어학, 인턴십 등)은 매우 복잡합니다. JOLUV는 학교 포털의 딱딱한 텍스트 데이터 대신, 직관적인 그래프와 대시보드를 통해 현재 자신의 위치를 시각적으로 보여줍니다.

Target: 경북대학교 컴퓨터학부 학생 (및 확장 가능성 고려)

Goal: 졸업 요건 충족 여부 자동 분석 및 남은 학점 시각화 및 대외활동 관리

주요 기능
1. 스마트 대시보드 & 시각화
실시간 학점 계산: TotalCredits, EachCredits 컴포넌트를 통해 전체 이수 학점과 전공/교양 학점을 시각화합니다.

직관적인 UI: React State와 Tailwind CSS를 활용한 커스텀 프로그레스 바(Progress Bar)로 달성률(%)을 한눈에 보여줍니다.

조건부 렌더링: 데이터 로딩 상태(Loading), 에러 상태(Error), 데이터 없음(Empty)을 구분하여 사용자에게 정확한 피드백을 제공합니다.

2. 강력한 인증 시스템 (Auth System)
전역 상태 관리: AuthContext와 Context API를 사용하여 앱 전체에서 로그인 상태와 유저 정보를 관리합니다.

보안 라우팅 (Protected Routes): ProtectedRoute 컴포넌트를 구현하여, 로그아웃 상태에서는 '마이페이지' 등 민감한 페이지 접근을 차단하고 로그인 페이지로 리다이렉트합니다.

자동 로그인 유지: localStorage를 활용하여 새로고침 후에도 로그인 상태가 유지되도록 구현했습니다.

3.  마이페이지 & 커리어 관리
개인 맞춤 설정: 전공 및 세부 트랙(심화/복수전공 등)을 설정하고 수정할 수 있습니다.

스펙 아카이빙: 어학 성적, 자격증, 대외활동 내역을 추가/수정/삭제(CRUD)하며 포트폴리오를 관리합니다.

4.  수강 과목 관리
검색 및 필터: 수강한 과목을 과목명으로 검색하거나 '전공/교양'으로 필터링하여 조회할 수 있습니다.

재수강 알림: 성적이 낮아 재수강이 필요한 과목을 자동으로 식별하여 태그를 표시합니다.

🛠 기술 스택 (Tech Stack)
Category	Technology	Version	Description
Frontend	React	^19.1.1	 React 19 버전을 사용한 컴포넌트 기반 개발
Language	TypeScript	~5.8.3	정적 타입 지정을 통한 코드 안정성 확보
Build Tool	Vite	^7.2.2	빠른 HMR과 빌드 속도를 위한 개발 환경 구축
Styling	Tailwind CSS	^3.4.14	유틸리티 퍼스트 CSS 프레임워크 사용
Routing	React Router	^7.9.3	SPA(Single Page Application) 라우팅 구현
HTTP Client	Axios	^1.13.2	REST API 통신 및 Interceptor 활용

Sheets로 내보내기

📂 프로젝트 구조 (Directory Structure)
Bash

src
├── assets/                   # 이미지, 로고 등 정적 파일
├── components/               # 재사용 가능한 UI 컴포넌트
│   ├── Layout.tsx            # 헤더와 아웃렛을 포함한 기본 레이아웃
│   ├── Header.tsx            # 네비게이션 바
│   ├── ProtectedRoute.tsx    # 로그인 여부 체크 라우터
│   └── LoginRequest.tsx      # 로그인 요청 체크
├── contexts/                 # 전역 상태 관리
│   └── AuthContext.tsx       # 로그인/로그아웃 로직 및 유저 정보
├── displayCredits/           # 학점 시각화 컴포넌트
│   ├── totalCredits.tsx      # 전체 학점 그래프
│   └── eachCredits.tsx       # 전공/교양 학점 현황
├── pages/                    # 페이지 단위 컴포넌트
│   ├── main/                 # 메인 페이지 (MainPage.tsx)
│   ├── login/                # 로그인 및 회원가입 (index.tsx, signup.tsx)
│   ├── mypage/               # 마이페이지 (MyPage.tsx, Mypage.css)
│   ├── summary/              # 학점 요약 (index.tsx)
│   ├── checklist/            # 졸업 요건 체크 (index.tsx)
│   ├── score_management/     # 수강 과목 관리 (index.tsx)
|   └── bulitin_subject_list/ # 수강 과목 추가 및 삭제(index.tsx,index.css,tpye.ts)
|        └── components/      # 수강 과목 모음(SubjectCard.tsx, SubjectCard.css)    

├── App.tsx                  # 라우팅 설정 (Routes)
├── main.tsx                 # 앱 진입점 (Provider 설정)
└── index.css                # Tailwind CSS 지시어 포함
<!-- 🚀 설치 및 실행 방법 (Getting Started)
이 프로젝트를 로컬 환경에서 실행하려면 다음 단계가 필요합니다.

1. 레포지토리 클론 (Clone)
Bash

git clone 
cd JOLUV-Frontend
2. 패키지 설치 (Install Dependencies)
Bash

npm install
# 또는
yarn install
3. 환경 변수 설정 (Optional)
루트 경로에 .env 파일을 생성하고 백엔드 API 주소를 설정합니다. (Proxy 설정이 되어 있다면 생략 가능)

코드 스니펫

VITE_API_URL=http://localhost:8080
4. 개발 서버 실행 (Run)
Bash

npm run dev
브라우저에서 http://localhost:5173으로 접속하여 확인합니다. -->

⚠️ 주요 구현 로직 상세 (Implementation Details)
🔒 인증 (Authentication) 로직
AuthContext.tsx에서 구현된 인증 흐름은 다음과 같습니다.

초기화: 앱 실행 시 useEffect가 localStorage를 확인하여 로그인 상태를 복구합니다.

로그인: login(id) 함수 호출 시 상태를 업데이트하고 스토리지에 저장합니다.

로그아웃: logout() 호출 시 상태 초기화 및 스토리지(userId, accessToken)와 sessionStorage를 모두 비웁니다.

🛣️ 라우팅 보호 (Route Protection)
App.tsx에서 중요한 페이지(mypage 등)는 <ProtectedRoute>로 감싸져 있습니다.

TypeScript

<Route 
  path="mypage" 
  element={
    <ProtectedRoute>
      <MyPage />
    </ProtectedRoute>
  } 
/>
로그인하지 않은 사용자가 접근 시, ProtectedRoute 내부 로직에 의해 자동으로 로그인 페이지나 안내 페이지로 리다이렉트됩니다.

🤝 참여 개발자 (Authors)
Frontend Developer: 장시온

UI/UX 설계 및 구현

API 연동 및 데이터 시각화

인증 시스템 구축

🤝 참여 개발자 (Authors)
Frontend Developer: 김도현

UI/UX 설계 및 구현

API 연동 및 데이터 시각화

인증 시스템 구축



📝 License
This project is licensed under the MIT License.