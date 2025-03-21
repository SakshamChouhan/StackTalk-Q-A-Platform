import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { QuestionWithAnswerCount } from '@shared/schema';
import QuestionCard from '@/components/QuestionCard';
import { useUser } from '@/context/UserContext';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const MyQuestionsSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white shadow-sm rounded-lg p-6">
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    ))}
  </div>
);

const MyQuestionsPage = () => {
  const { username } = useUser();

  const { data: questions, isLoading, error, refetch } = useQuery<QuestionWithAnswerCount[]>({
    queryKey: ['/api/user', username, 'questions'],
    enabled: !!username,
  });

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-textPrimary mb-4 sm:mb-0">My Questions</h1>
        <Link href="/ask">
          <a className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition">
            <span className="material-icons mr-1 text-sm">add</span>
            Ask Question
          </a>
        </Link>
      </div>

      {isLoading ? (
        <MyQuestionsSkeleton />
      ) : error ? (
        <div className="bg-white shadow-sm rounded-lg p-6 text-center">
          <p className="text-error">Failed to load your questions</p>
          <Button 
            onClick={() => refetch()} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition"
          >
            Retry
          </Button>
        </div>
      ) : questions && questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map(question => (
            <QuestionCard key={question.id} question={question} showUsername={false} />
          ))}
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center" id="no-questions-message">
          <div className="mb-4 text-gray-400">
            <span className="material-icons text-5xl">help_outline</span>
          </div>
          <h3 className="text-lg font-medium text-textPrimary mb-2">You haven't asked any questions yet</h3>
          <p className="text-textSecondary mb-4">When you ask questions, they will appear here.</p>
          <Link href="/ask">
            <a className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition">
              Ask Your First Question
            </a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyQuestionsPage;
