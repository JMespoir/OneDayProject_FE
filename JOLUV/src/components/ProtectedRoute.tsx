import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    // 로그인이 안 되어 있으면 경고창을 띄우고 로그인 페이지로 이동시킵니다.
    // (React 렌더링 도중에 alert를 띄우는 것은 권장되지 않지만, 간단한 구현을 위해 사용합니다.
    //  더 좋은 방법은 useEffect를 사용하거나 별도의 안내 페이지를 보여주는 것입니다.)
    alert("로그인이 필요한 서비스입니다.");
    return <Navigate to="/login" replace />;
  }

  // 로그인이 되어 있으면 원래 보여주려던 페이지(children)를 보여줍니다.
  return <>{children}</>;
};

export default ProtectedRoute;