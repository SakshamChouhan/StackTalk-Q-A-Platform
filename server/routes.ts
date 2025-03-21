import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertQuestionSchema, 
  insertAnswerSchema,
  Question 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const userRouter = express.Router();
  const qnaRouter = express.Router();
  
  // User Service APIs
  
  // Create or fetch a user
  userRouter.post("/user", async (req: Request, res: Response) => {
    try {
      const parsedBody = insertUserSchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ 
          message: "Invalid request body", 
          errors: parsedBody.error.errors 
        });
      }
      
      const { username } = parsedBody.data;
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      
      if (existingUser) {
        // Return the existing user instead of an error
        return res.status(200).json(existingUser);
      }
      
      // Create new user
      const newUser = await storage.createUser({ username });
      
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Server error while creating user" });
    }
  });
  
  // Get all questions by a user
  userRouter.get("/user/:username/questions", async (req: Request, res: Response) => {
    try {
      const { username } = req.params;
      
      // Check if user exists
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get user's questions with answer counts
      const questions = await storage.getQuestionsByUsername(username);
      
      // Get answer counts for each question
      const questionsWithCounts = await Promise.all(questions.map(async (question: Question) => {
        const answerCount = await storage.getAnswersCountByQuestionId(question.id);
        return { ...question, answerCount };
      }));
      
      res.status(200).json(questionsWithCounts);
    } catch (error) {
      console.error("Error fetching user questions:", error);
      res.status(500).json({ message: "Server error while fetching user questions" });
    }
  });
  
  // QnA Service APIs
  
  // Ask a new question
  qnaRouter.post("/questions", async (req: Request, res: Response) => {
    try {
      const parsedBody = insertQuestionSchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ 
          message: "Invalid request body", 
          errors: parsedBody.error.errors 
        });
      }
      
      const question = parsedBody.data;
      
      // Check if user exists
      const user = await storage.getUserByUsername(question.username);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Create new question
      const newQuestion = await storage.createQuestion(question);
      
      res.status(201).json(newQuestion);
    } catch (error) {
      console.error("Error creating question:", error);
      res.status(500).json({ message: "Server error while creating question" });
    }
  });
  
  // Get all questions with answer counts
  qnaRouter.get("/questions", async (_req: Request, res: Response) => {
    try {
      const questions = await storage.getQuestions();
      
      // Get answer counts for each question
      const questionsWithCounts = await Promise.all(questions.map(async (question: Question) => {
        const answerCount = await storage.getAnswersCountByQuestionId(question.id);
        return { ...question, answerCount };
      }));
      
      res.status(200).json(questionsWithCounts);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Server error while fetching questions" });
    }
  });
  
  // Get a question and its answers
  qnaRouter.get("/questions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid question ID" });
      }
      
      const question = await storage.getQuestionById(id);
      
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      const answers = await storage.getAnswersByQuestionId(id);
      
      res.status(200).json({ question, answers });
    } catch (error) {
      console.error("Error fetching question details:", error);
      res.status(500).json({ message: "Server error while fetching question details" });
    }
  });
  
  // Add an answer
  qnaRouter.post("/questions/:id/answers", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid question ID" });
      }
      
      const question = await storage.getQuestionById(id);
      
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      const parsedBody = z.object({
        username: z.string(),
        body: z.string(),
      }).safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ 
          message: "Invalid request body", 
          errors: parsedBody.error.errors 
        });
      }
      
      const { username, body } = parsedBody.data;
      
      // Check if user exists
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Create new answer
      const newAnswer = await storage.createAnswer({
        questionId: id,
        username,
        body,
      });
      
      res.status(201).json(newAnswer);
    } catch (error) {
      console.error("Error creating answer:", error);
      res.status(500).json({ message: "Server error while creating answer" });
    }
  });
  
  // Register routers
  app.use("/api", userRouter);
  app.use("/api", qnaRouter);
  
  const httpServer = createServer(app);

  return httpServer;
}
