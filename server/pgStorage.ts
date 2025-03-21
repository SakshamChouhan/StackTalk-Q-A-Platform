import { db } from './db';
import { IStorage } from './storage';
import { User, InsertUser, Question, InsertQuestion, Answer, InsertAnswer } from '../shared/schema';
import { users, questions, answers } from '../shared/schema';
import { eq } from 'drizzle-orm';

class PgStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Question methods
  async getQuestions(): Promise<Question[]> {
    return await db.select().from(questions).orderBy(questions.createdAt);
  }

  async getQuestionById(id: number): Promise<Question | undefined> {
    const result = await db.select().from(questions).where(eq(questions.id, id));
    return result[0];
  }

  async getQuestionsByUsername(username: string): Promise<Question[]> {
    return await db.select()
      .from(questions)
      .where(eq(questions.username, username))
      .orderBy(questions.createdAt);
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const result = await db.insert(questions).values(insertQuestion).returning();
    return result[0];
  }

  // Answer methods
  async getAnswersByQuestionId(questionId: number): Promise<Answer[]> {
    return await db.select()
      .from(answers)
      .where(eq(answers.questionId, questionId))
      .orderBy(answers.createdAt);
  }

  async createAnswer(insertAnswer: InsertAnswer): Promise<Answer> {
    const result = await db.insert(answers).values(insertAnswer).returning();
    return result[0];
  }

  async getAnswersCountByQuestionId(questionId: number): Promise<number> {
    const result = await db.select()
      .from(answers)
      .where(eq(answers.questionId, questionId));
    return result.length;
  }
}

// Create and export a single instance of PgStorage
export const pgStorage = new PgStorage();