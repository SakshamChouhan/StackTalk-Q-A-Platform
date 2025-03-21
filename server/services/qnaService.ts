import express, { Router } from 'express';
import { storage } from '../storage';
import { insertQuestionSchema, insertAnswerSchema } from '@shared/schema';
import { z } from 'zod';

// Create router for QnA Service
const qnaRouter = Router();

// Ask a new question
qnaRouter.post('/questions', async (req, res) => {
  try {
    // Validate request body
    const validatedData = insertQuestionSchema.parse(req.body);
    
    // Create new question
    const newQuestion = await storage.createQuestion(validatedData);
    return res.status(201).json(newQuestion);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    return res.status(500).json({ message: 'Failed to create question' });
  }
});

// Get all questions
qnaRouter.get('/questions', async (req, res) => {
  try {
    const questions = await storage.getQuestions();
    return res.json(questions);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch questions' });
  }
});

// Get a question and its answers
qnaRouter.get('/questions/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid question ID' });
    }
    
    const question = await storage.getQuestion(id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    const answers = await storage.getAnswersForQuestion(id);
    
    return res.json({
      question,
      answers
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch question' });
  }
});

// Add an answer to a question
qnaRouter.post('/questions/:id/answers', async (req, res) => {
  try {
    const questionId = parseInt(req.params.id);
    
    if (isNaN(questionId)) {
      return res.status(400).json({ message: 'Invalid question ID' });
    }
    
    // Check if question exists
    const question = await storage.getQuestion(questionId);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Validate request body
    const validatedData = insertAnswerSchema.pick({ username: true, body: true }).parse(req.body);
    
    // Create answer
    const newAnswer = await storage.createAnswer({
      questionId,
      username: validatedData.username,
      body: validatedData.body
    });
    
    return res.status(201).json(newAnswer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    return res.status(500).json({ message: 'Failed to create answer' });
  }
});

export default qnaRouter;
