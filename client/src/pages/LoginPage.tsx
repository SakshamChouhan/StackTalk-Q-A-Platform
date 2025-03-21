import { useState } from 'react';
import { useLocation } from 'wouter';
import { useUser } from '@/context/UserContext';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { login, isLoading } = useUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [usernameError, setUsernameError] = useState<string>('');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setUsernameError('');
    const success = await login(values.username);
    
    if (success) {
      setLocation('/questions');
    } else {
      toast({
        title: "Error",
        description: "Failed to login. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">StackTalk</h1>
          <p className="text-textSecondary mt-2">A platform to ask and answer questions</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-textPrimary">Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter a unique username" 
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                  {usernameError && <p className="text-xs text-error mt-1">{usernameError}</p>}
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition"
            >
              {isLoading ? 'Loading...' : 'Get Started'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
