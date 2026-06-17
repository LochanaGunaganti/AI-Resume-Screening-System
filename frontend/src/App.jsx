import { Switch, Route, Router as WouterRouter } from "wouter";
import Navbar from "./components/Navbar";
import UploadResume from "./pages/UploadResume";
import JobDescription from "./pages/JobDescription";
import AnalysisResult from "./pages/AnalysisResult";
import InterviewQuestions from "./pages/InterviewQuestions";

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Navbar />
      <Switch>
        <Route path="/" component={UploadResume} />
        <Route path="/job-description" component={JobDescription} />
        <Route path="/analysis" component={AnalysisResult} />
        <Route path="/interview-questions" component={InterviewQuestions} />
      </Switch>
    </WouterRouter>
  );
}

export default App;
