import { 
  User, 
  InsertUser, 
  Question, 
  InsertQuestion, 
  Answer, 
  InsertAnswer 
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Question methods
  getQuestions(): Promise<Question[]>;
  getQuestionById(id: number): Promise<Question | undefined>;
  getQuestionsByUsername(username: string): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  
  // Answer methods
  getAnswersByQuestionId(questionId: number): Promise<Answer[]>;
  createAnswer(answer: InsertAnswer): Promise<Answer>;
  getAnswersCountByQuestionId(questionId: number): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private questions: Map<number, Question>;
  private answers: Map<number, Answer>;
  private userIdCounter: number;
  private questionIdCounter: number;
  private answerIdCounter: number;

  constructor() {
    this.users = new Map();
    this.questions = new Map();
    this.answers = new Map();
    this.userIdCounter = 1;
    this.questionIdCounter = 1;
    this.answerIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Question methods
  async getQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async getQuestionById(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async getQuestionsByUsername(username: string): Promise<Question[]> {
    return Array.from(this.questions.values())
      .filter(question => question.username === username)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = this.questionIdCounter++;
    const question: Question = { 
      ...insertQuestion, 
      id, 
      createdAt: new Date() 
    };
    this.questions.set(id, question);
    return question;
  }

  // Answer methods
  async getAnswersByQuestionId(questionId: number): Promise<Answer[]> {
    return Array.from(this.answers.values())
      .filter(answer => answer.questionId === questionId)
      .sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
  }

  async createAnswer(insertAnswer: InsertAnswer): Promise<Answer> {
    const id = this.answerIdCounter++;
    const answer: Answer = { 
      ...insertAnswer, 
      id, 
      createdAt: new Date() 
    };
    this.answers.set(id, answer);
    return answer;
  }

  async getAnswersCountByQuestionId(questionId: number): Promise<number> {
    return Array.from(this.answers.values())
      .filter(answer => answer.questionId === questionId)
      .length;
  }
}

// Export an instance of the MemStorage 
// (will be replaced with PgStorage in a separate PR)
export const storage = new MemStorage();
