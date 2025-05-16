import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import MyPage from "./pages/MyPage";
import LoginPage from "./pages/LoginPage";
import CollectionPage from "./pages/CollectionPage";
import Header from "./layout/Header"; // 헤더 컴포넌트 추가
import TargetCollectionPage from "./pages/TargetCollectionPage";
import ErrorPage from "./pages/ErrorPage";
import QuizShowEntryPersonalPage from "./pages/QuizShowEntryPersonalPage";
import QuizShowPersonalPage from "./pages/QuizShowPersonalPage";
import QuizShowSharedPage from "./pages/QuizShowSharedPage";
import QuizShowResultPersonalPage from "./pages/QuizShowResultPersonalPage";
import ErrorModal from "./components/ErrorModal"; // ErrorModal 컴포넌트 추가

function App() {
  return (
    <BrowserRouter>
      <ErrorModal /> {/* 전역 에러 모달 추가 */}
      <Routes>
        <Route
          element={
            <>
              <Header />
              <Outlet />
            </>
          }
        >
          <Route path="/" element={<LoginPage />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/collection/:collectionId" element={<TargetCollectionPage />} />
          <Route
            path="/quiz-entry/personal/:collectionId"
            element={<QuizShowEntryPersonalPage />}
          />
          <Route
            path="/quiz-show/personal/:collectionId/:quizSessionId"
            element={<QuizShowPersonalPage />}
          />
          <Route
            path="/quiz-result/personal/:collectionId/:quizSessionId"
            element={<QuizShowResultPersonalPage />}
          />
          <Route path="/quiz/show/:showId" element={<QuizShowSharedPage />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
