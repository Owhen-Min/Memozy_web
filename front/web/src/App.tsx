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
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <ErrorModal /> {/* 전역 에러 모달 추가 */}
      <Routes>
        <Route
          element={
            <>
              <Header />
              <div className="pt-14">
                <Outlet />
              </div>
            </>
          }
        >
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/my"
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/collection"
            element={
              <ProtectedRoute>
                <CollectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/collection/:collectionId"
            element={
              <ProtectedRoute>
                <TargetCollectionPage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="/quiz-entry/personal/:collectionId"
          element={
            <ProtectedRoute>
              <QuizShowEntryPersonalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz-show/personal/:collectionId/:quizSessionId"
          element={
            <ProtectedRoute>
              <QuizShowPersonalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz-result/personal/:collectionId/:quizSessionId"
          element={
            <ProtectedRoute>
              <QuizShowResultPersonalPage />
            </ProtectedRoute>
          }
        />

        <Route path="/quiz/show/:showId" element={<QuizShowSharedPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
