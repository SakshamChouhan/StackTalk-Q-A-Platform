import { Link } from 'wouter';
import { QuestionWithAnswerCount } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';

interface QuestionCardProps {
  question: QuestionWithAnswerCount;
  showUsername?: boolean;
}

const QuestionCard = ({ question, showUsername = true }: QuestionCardProps) => {
  const { id, title, body, username, createdAt, answerCount } = question;
  
  return (
    <div className="card bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition">
      <Link href={`/questions/${id}`}>
        <a className="block">
          <h2 className="text-xl font-medium text-primary hover:underline">{title}</h2>
          <p className="text-textSecondary mt-2 line-clamp-2">{body}</p>
          <div className="flex items-center mt-4 text-sm text-textSecondary">
            {showUsername && (
              <span className="flex items-center mr-4">
                <span className="material-icons text-sm mr-1">person</span>
                <span>{username}</span>
              </span>
            )}
            <span className="flex items-center mr-4">
              <span className="material-icons text-sm mr-1">forum</span>
              <span>{answerCount} {answerCount === 1 ? 'answer' : 'answers'}</span>
            </span>
            <span className="flex items-center">
              <span className="material-icons text-sm mr-1">schedule</span>
              <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
            </span>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default QuestionCard;
