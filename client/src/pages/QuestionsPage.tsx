import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { QuestionWithAnswerCount } from '@shared/schema';
import QuestionCard from '@/components/QuestionCard';
import { Skeleton } from "@/components/ui/skeleton";

const QuestionsSkeleton = () => (
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

const QuestionsPage = () => {
  const { data: questions, isLoading, error } = useQuery<QuestionWithAnswerCount[]>({
    queryKey: ['/api/questions'],
  });

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-textPrimary mb-4 sm:mb-0">All Questions</h1>
        <Link href="/ask">
          <a className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition">
            <span className="material-icons mr-1 text-sm">add</span>
            Ask Question
          </a>
        </Link>
      </div>

      {isLoading ? (
        <QuestionsSkeleton />
      ) : error ? (
        <div className="bg-white shadow-sm rounded-lg p-6 text-center">
          <p className="text-error">Failed to load questions. Please try again.</p>
        </div>
      ) : questions && questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map(question => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <div className="mb-4 text-gray-400">
            <span className="material-icons text-5xl">help_outline</span>
          </div>
          <h3 className="text-lg font-medium text-textPrimary mb-2">No questions yet</h3>
          <p className="text-textSecondary mb-4">Be the first to ask a question!</p>
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

export default QuestionsPage;
