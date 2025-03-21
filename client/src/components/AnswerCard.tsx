import { Answer } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';

interface AnswerCardProps {
  answer: Answer;
}

const AnswerCard = ({ answer }: AnswerCardProps) => {
  const { body, username, createdAt } = answer;
  
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <p className="text-textPrimary mb-4">{body}</p>
      <div className="flex items-center text-sm text-textSecondary">
        <span className="flex items-center mr-4">
          <span className="material-icons text-sm mr-1">person</span>
          <span>{username}</span>
        </span>
        <span className="flex items-center">
          <span className="material-icons text-sm mr-1">schedule</span>
          <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
        </span>
      </div>
    </div>
  );
};

export default AnswerCard;
