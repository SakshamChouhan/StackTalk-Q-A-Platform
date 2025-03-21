import { useUser } from "@/context/UserContext";
import { AllQuestionsPage } from "./AllQuestionsPage";
import { AskQuestionPage } from "./AskQuestionPage";
import { QuestionDetailPage } from "./QuestionDetailPage";
import { MyQuestionsPage } from "./MyQuestionsPage";
import { Route, Switch } from "wouter";

export function MainContent() {
  const { isLoggedIn } = useUser();

  if (!isLoggedIn) {
    return null;
  }

  return (
    <main className="flex-grow">
      <Switch>
        <Route path="/questions" component={AllQuestionsPage} />
        <Route path="/ask" component={AskQuestionPage} />
        <Route path="/my-questions" component={MyQuestionsPage} />
        <Route path="/questions/:id">
          {(params) => <QuestionDetailPage id={params.id} />}
        </Route>
      </Switch>
    </main>
  );
}
