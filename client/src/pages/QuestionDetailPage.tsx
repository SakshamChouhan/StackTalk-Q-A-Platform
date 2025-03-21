import { useParams, Link, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Question, Answer } from '@shared/schema';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from 'date-fns';
import AnswerCard from '@/components/AnswerCard';
import { useUser } from '@/context/UserContext';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface QuestionDetail {
  question: Question;
  answers: Answer[];
}

const answerSchema = z.object({
  answer: z.string().min(10, "Answer must be at least 10 characters"),
});

type AnswerFormValues = z.infer<typeof answerSchema>;

const QuestionDetailSkeleton = () => (
  <>
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <Skeleton className="h-8 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-4" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    <div className="mb-6">
      <h2 className="text-xl font-bold text-textPrimary mb-4">Answers</h2>
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white shadow-sm rounded-lg p-6">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);

const QuestionDetailPage = () => {
  const params = useParams<{ id: string }>();
  const questionId = parseInt(params.id);
  const { username } = useUser();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data, isLoading, error, refetch } = useQuery<QuestionDetail>({
    queryKey: ['/api/questions', questionId],
  });

  const form = useForm<AnswerFormValues>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      answer: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: AnswerFormValues) => {
      if (!username) {
        throw new Error("You must be logged in to answer a question");
      }
      
      return apiRequest('POST', `/api/questions/${questionId}/answers`, {
        username,
        body: values.answer,
      });
    },
    onSuccess: () => {
      form.reset();
      toast({
        title: "Success",
        description: "Your answer has been posted",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post your answer",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (values: AnswerFormValues) => {
    mutation.mutate(values);
  };

  if (!questionId) {
    return <div>Invalid question ID</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/questions">
          <a className="inline-flex items-center text-primary hover:underline">
            <span className="material-icons text-sm mr-1">arrow_back</span>
            Back to Questions
          </a>
        </Link>
      </div>

      {isLoading ? (
        <QuestionDetailSkeleton />
      ) : error ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-error">Failed to load the question. Please try again.</p>
          <Button 
            onClick={() => refetch()} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition"
          >
            Retry
          </Button>
        </div>
      ) : data ? (
        <>
          {/* Question */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-textPrimary mb-4">{data.question.title}</h1>
            <p className="text-textPrimary mb-6">{data.question.body}</p>
            <div className="flex items-center text-sm text-textSecondary">
              <span className="flex items-center mr-4">
                <span className="material-icons text-sm mr-1">person</span>
                <span>{data.question.username}</span>
              </span>
              <span className="flex items-center">
                <span className="material-icons text-sm mr-1">schedule</span>
                <span>{formatDistanceToNow(new Date(data.question.createdAt), { addSuffix: true })}</span>
              </span>
            </div>
          </div>

          {/* Answers */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-textPrimary mb-4">
              Answers ({data.answers.length})
            </h2>
            
            {data.answers.length > 0 ? (
              <div className="space-y-4">
                {data.answers.map(answer => (
                  <AnswerCard key={answer.id} answer={answer} />
                ))}
              </div>
            ) : (
              <div className="bg-white shadow-sm rounded-lg p-6 text-center">
                <p className="text-textSecondary">No answers yet. Be the first to answer!</p>
              </div>
            )}
          </div>

          {/* Answer Form */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-textPrimary mb-4">Your Answer</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          placeholder="Write your answer here..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button 
                    type="submit"
                    disabled={mutation.isPending}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition"
                  >
                    {mutation.isPending ? 'Posting...' : 'Post Answer'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default QuestionDetailPage;
