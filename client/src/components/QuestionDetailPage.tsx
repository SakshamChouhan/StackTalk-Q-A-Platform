import { useState } from "react";
import { Link } from "wouter";
import { useQuestionDetails, useSubmitAnswer } from "@/hooks/useQuestions";
import { useUser } from "@/context/UserContext";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export function QuestionDetailPage({ id }: { id: string }) {
  const [answer, setAnswer] = useState("");
  const { user } = useUser();
  const { toast } = useToast();
  const { 
    data, 
    isLoading, 
    error 
  } = useQuestionDetails(id);
  
  const { 
    mutate: submitAnswer, 
    isPending: isSubmitting 
  } = useSubmitAnswer();

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!answer.trim()) {
      toast({
        title: "Answer required",
        description: "Please write an answer before submitting",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to answer a question",
        variant: "destructive",
      });
      return;
    }
    
    submitAnswer(
      {
        questionId: parseInt(id),
        answerData: {
          username: user.username,
          body: answer.trim(),
        },
      },
      {
        onSuccess: () => {
          setAnswer("");
        },
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-4">
          <Link href="/questions">
            <a className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to all questions
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
                <h3 className="text-sm font-medium text-red-800">Failed to load question</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error instanceof Error ? error.message : "Unknown error"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && data && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h1 className="text-xl font-semibold text-gray-900">{data.question.title}</h1>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span>Asked by </span>
                <span className="font-medium text-gray-900 ml-1">{data.question.username}</span>
                <span className="mx-1">•</span>
                <time>{formatDistanceToNow(new Date(data.question.createdAt), { addSuffix: true })}</time>
              </div>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                  {data.question.body}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">
                {data.answers.length} {data.answers.length === 1 ? "Answer" : "Answers"}
              </h2>
              {data.answers.length > 0 ? (
                <div className="mt-6 space-y-6">
                  {data.answers.map((answer) => (
                    <div key={answer.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                        {answer.body}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span className="font-medium text-gray-900">{answer.username}</span>
                        <span className="mx-1">•</span>
                        <time>{formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}</time>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 text-center text-gray-500">
                  <p>No answers yet. Be the first to answer this question!</p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">Your Answer</h3>
              <form onSubmit={handleSubmitAnswer} className="mt-4">
                <div>
                  <textarea
                    id="answer"
                    name="answer"
                    rows={4}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                    placeholder="Write your answer here..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Posting...
                      </span>
                    ) : (
                      "Post Your Answer"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
