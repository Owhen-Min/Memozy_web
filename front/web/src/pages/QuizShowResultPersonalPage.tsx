import small_logo from "../assets/images/small_logo.png";
import { quizShowData } from "../dummy/quizShowData";
import { useLocation } from "react-router";
interface QuizShowResultPersonalPageProps {
  quizSessionId: string;
}

function QuizShowResultPersonalPage() {
  const location = useLocation();
  const { quizSessionId } = location.state as QuizShowResultPersonalPageProps;
  return (
    <div className="content">
      <h1 className="text-[28px] font-pre-semibold mb-4 text-main200 flex items-center gap-2">
        <img src={small_logo} alt="logo" className="w-10 h-10" />
        Quiz :
        <span className="text-normalactive">
          {quizShowData.data.collectionName}
        </span>
      </h1>
      <div className="w-full h-[70vh] bg-white rounded-xl shadow-xl"></div>
    </div>
  );
}

export default QuizShowResultPersonalPage;
