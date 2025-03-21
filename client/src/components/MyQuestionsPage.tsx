import { Link } from "wouter";
import { useUserQuestions } from "@/hooks/useQuestions";
import { useUser } from "@/context/UserContext";
import { formatDistanceToNow } from "date-fns";

export function MyQuestionsPage() {
  const { user } = useUser();
  const { 
    data: myQuestions, 
    isLoading, 
    error 
  } = useUserQuestions(user?.username || null);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Questions</h1>
          <Link href="/ask">
            <a className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Ask Question
            </a>
          </Link>
        </div>

        {isLoading && (
          <div className="flex justify-center py-10">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Failed to load your questions</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error instanceof Error ? error.message : "Unknown error"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && myQuestions && myQuestions.length === 0 && (
          <div className="bg-white shadow overflow-hidden rounded-md px-6 py-10 text-center">
            <svg className="h-12 w-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-2 text-gray-500">You haven't asked any questions yet</p>
            <div className="mt-4">
              <Link href="/ask">
                <a className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Ask Your First Question
                </a>
              </Link>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {myQuestions && myQuestions.map((question) => (
            <div key={question.id} className="bg-white shadow overflow-hidden sm:rounded-md transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-md">
              <div className="px-4 py-5 sm:px-6">
                <div className="flex justify-between">
                  <Link href={`/questions/${question.id}`}>
                    <a className="text-lg font-medium text-blue-600 hover:text-blue-800">
                      {question.title}
                    </a>
                  </Link>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {question.answerCount} {question.answerCount === 1 ? "answer" : "answers"}
                  </span>
                </div>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 line-clamp-2">
                  {question.body}
                </p>
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <span>Asked by </span>
                    <span className="font-medium text-gray-900 ml-1">{question.username}</span>
                    <span className="mx-1">•</span>
                    <time>{formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</time>
                  </div>
                  <Link href={`/questions/${question.id}`}>
                    <a className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      View question
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
