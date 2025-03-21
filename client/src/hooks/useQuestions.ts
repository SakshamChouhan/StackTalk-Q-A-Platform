import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Question, Answer } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Fetch all questions
export function useQuestions() {
  return useQuery<(Question & { answerCount: number })[]>({
    queryKey: ["/api/questions"],
  });
}

// Fetch questions by username
export function useUserQuestions(username: string | null) {
  return useQuery<(Question & { answerCount: number })[]>({
    queryKey: ["/api/user", username, "questions"],
    enabled: !!username,
    queryFn: async () => {
      if (!username) return [];
      const res = await fetch(`/api/user/${username}/questions`);
      if (!res.ok) throw new Error("Failed to fetch user questions");
      return res.json();
    },
  });
}

// Fetch a single question with its answers
export function useQuestionDetails(id: string | number) {
  return useQuery<{ question: Question; answers: Answer[] }>({
    queryKey: ["/api/questions", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("Question ID is required");
      const res = await fetch(`/api/questions/${id}`);
      if (!res.ok) throw new Error("Failed to fetch question");
      return res.json();
    },
  });
}

// Submit a new question
export function useSubmitQuestion() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (questionData: { username: string; title: string; body: string }) => {
      const res = await apiRequest("POST", "/api/questions", questionData);
      return res.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate the general questions list
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      
      // Also invalidate the user's questions list
      queryClient.invalidateQueries({ 
        queryKey: ["/api/user", variables.username, "questions"] 
      });
      
      toast({
        title: "Success!",
        description: "Your question has been posted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to post question",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });
}

// Submit a new answer
export function useSubmitAnswer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      questionId, 
      answerData 
    }: { 
      questionId: number; 
      answerData: { username: string; body: string } 
    }) => {
      const res = await apiRequest("POST", `/api/questions/${questionId}/answers`, answerData);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions", variables.questionId] });
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      toast({
        title: "Success!",
        description: "Your answer has been posted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to post answer",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });
}
