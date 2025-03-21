import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from '@/context/UserContext';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const questionSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  body: z.string().min(20, "Details must be at least 20 characters"),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

const AskQuestionPage = () => {
  const { username } = useUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: '',
      body: '',
    },
  });

  const onSubmit = async (values: QuestionFormValues) => {
    if (!username) {
      toast({
        title: "Error",
        description: "You must be logged in to ask a question",
        variant: "destructive",
      });
      setLocation('/');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { ...values, username };
      await apiRequest('POST', '/api/questions', payload);
      
      // Invalidate queries to refresh the questions list
      queryClient.invalidateQueries({ queryKey: ['/api/questions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user', username, 'questions'] });

      toast({
        title: "Success",
        description: "Your question has been posted",
      });

      setLocation('/questions');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-textPrimary">Ask a Question</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-textPrimary">Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="What's your question? Be specific." 
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-textPrimary">Details</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide details to help others understand your question better."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary h-40"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation('/questions')}
                className="px-4 py-2 border border-gray-300 rounded-md text-textSecondary hover:bg-gray-50 transition"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition"
              >
                {isSubmitting ? 'Posting...' : 'Post Question'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AskQuestionPage;
