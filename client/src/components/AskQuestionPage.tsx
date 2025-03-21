import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useUser } from "@/context/UserContext";
import { useSubmitQuestion } from "@/hooks/useQuestions";
import { useToast } from "@/hooks/use-toast";

export function AskQuestionPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { user } = useUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { mutate, isPending } = useSubmitQuestion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !body.trim()) {
      toast({
        title: "Missing information",
        description: "Please complete all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to ask a question",
        variant: "destructive",
      });
      return;
    }
    
    mutate(
      {
        username: user.username,
        title: title.trim(),
        body: body.trim(),
      },
      {
        onSuccess: () => {
          setLocation("/questions");
        },
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Ask a Question</h1>
          <p className="mt-1 text-sm text-gray-500">Be specific and imagine you're asking a question to another person.</p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Question Title</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                      placeholder="e.g. How do I implement user authentication in React?"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Be specific and summarize your question</p>
                </div>

                <div>
                  <label htmlFor="body" className="block text-sm font-medium text-gray-700">Question Details</label>
                  <div className="mt-1">
                    <textarea
                      id="body"
                      name="body"
                      rows={6}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                      placeholder="Explain your problem in detail. Include what you've tried and any error messages."
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Include all the information someone would need to answer your question</p>
                </div>

                <div className="flex justify-end">
                  <Link href="/questions">
                    <a className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3">
                      Cancel
                    </a>
                  </Link>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                  >
                    {isPending ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Posting...
                      </span>
                    ) : (
                      "Post Your Question"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
