export interface User {
  id: number;
  username: string;
}

export interface Question {
  id: number;
  title: string;
  body: string;
  username: string;
  createdAt: Date | string;
  answerCount?: number;
}

export interface Answer {
  id: number;
  questionId: number;
  body: string;
  username: string;
  createdAt: Date | string;
}

export interface QuestionWithAnswers {
  question: Question;
  answers: Answer[];
}
