import { Button } from '@mui/material';
import { useQuestionsStore } from './store/questions';

const LIMIT_QUESTIONS = 5;
export const Start = () => {
  const fetchQuestions = useQuestionsStore((state) => state.fetchQuestion);
  const handleClick = () => {
    fetchQuestions(LIMIT_QUESTIONS);
  };
  return (
    <Button onClick={handleClick} variant='contained'>
      !Empezar
    </Button>
  );
};
