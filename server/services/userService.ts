import express, { Router } from 'express';
import { storage } from '../storage';
import { insertUserSchema } from '@shared/schema';
import { z } from 'zod';

// Create router for User Service
const userRouter = Router();

// Create or fetch a user
userRouter.post('/user', async (req, res) => {
  try {
    // Validate request body
    const validatedData = insertUserSchema.parse(req.body);
    const { username } = validatedData;
    
    // Check if user exists
    const existingUser = await storage.getUserByUsername(username);
    
    if (existingUser) {
      return res.json(existingUser);
    }
    
    // Create new user
    const newUser = await storage.createUser({ username });
    return res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    return res.status(500).json({ message: 'Failed to create user' });
  }
});

// Get all questions by a user
userRouter.get('/user/:username/questions', async (req, res) => {
  try {
    const { username } = req.params;
    
    // Check if user exists
    const existingUser = await storage.getUserByUsername(username);
    
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's questions
    const questions = await storage.getUserQuestions(username);
    return res.json(questions);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch user questions' });
  }
});

export default userRouter;
