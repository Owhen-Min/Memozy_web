import AnalysisReport from "../features/myPage/AnalysisReport";
import WrongAnswerNote from "../features/myPage/WrongAnswerNote";
function MyPage() {
  return (
    <div className="content">
      <AnalysisReport />
      <WrongAnswerNote />
    </div>
  );
}

export default MyPage;
