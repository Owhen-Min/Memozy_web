import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import MyPage from "./pages/MyPage";
import LoginPage from "./pages/LoginPage";
import CollectionPage from "./pages/CollectionPage";
import Header from "./layout/Header"; // 헤더 컴포넌트 추가
import TargetCollectionPage from "./pages/TargetCollectionPage";
import ErrorPage from "./pages/ErrorPage";

// 헤더를 조건부로 렌더링할 수 있게 AppLayout 구성
const AppLayout = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/collection/:collectionId" element={<TargetCollectionPage />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </>
  );
};

// 현재 경로에 따라 적절한 컴포넌트를 렌더링하는 컴포넌트
const AppContent = () => {
  const location = useLocation();
  
  return location.pathname === "/error" ? (
    <ErrorPage />
  ) : (
    <AppLayout />
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
