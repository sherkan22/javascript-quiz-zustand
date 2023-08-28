import { Box, Card, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { IconButton, Stack } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { useQuestionsStore } from './store/questions';
import { type Question as QuestionType } from './types';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { gradientDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

const getBackgroundColor = (info: QuestionType, index: number) => {
  const { seleccionRespuestaUsuario, respuestaCorrecta } = info;
  if (seleccionRespuestaUsuario == null) return 'transparent';

  if (index !== respuestaCorrecta && index !== seleccionRespuestaUsuario) return 'transparent';
  if (index === respuestaCorrecta) return 'green';
  if (index === seleccionRespuestaUsuario) return 'red';
};

const Question = ({ info }: { info: QuestionType }) => {
  const selectAnswer = useQuestionsStore((state) => state.selectAnswer);
  const createHandleClick = (answerIndex: number) => () => {
    selectAnswer(info.id, answerIndex);
  };

  return (
    <Card variant='outlined' sx={{ bgcolor: '#222', p: 2, textAlign: 'left', marginTop: 4 }}>
      <Typography variant='h5'>{info.pregunta}</Typography>
      <SyntaxHighlighter language='javascript' style={gradientDark}>
        {info.codigo}
      </SyntaxHighlighter>
      <List sx={{ bgcolor: '#333' }} disablePadding>
        {info.opciones.map((opcion, index) => (
          <ListItem key={index} disablePadding divider>
            <ListItemButton
              disabled={info.seleccionRespuestaUsuario != null}
              onClick={createHandleClick(index)}
              sx={{ backgroundColor: getBackgroundColor(info, index) }}
            >
              <ListItemText primary={opcion} sx={{ textAlign: 'center' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export const Game = () => {
  const questions = useQuestionsStore((state) => state.questions);
  const currentQuestion = useQuestionsStore((state) => state.currentQuestion);
  const questionInfo = questions[currentQuestion];
  const updateCurrentQuestion = useQuestionsStore((state) => state.updateCurrentQuestion);
  const updateInfoQuestion = useQuestionsStore((state) => state.updateInfoQuestion);

  const handleClickUpdateQuestion = (answerIndex: number) => () => {
    updateCurrentQuestion(answerIndex);
  };
  updateInfoQuestion();
  const correctQuestions = useQuestionsStore((state) => state.correctQuestions);
  const incorrectQuestions = useQuestionsStore((state) => state.incorrectQuestions);
  const pendentQuestions = useQuestionsStore((state) => state.pendentQuestions);

  return (
    <>
      <Stack direction='row' gap={2} alignItems='center' justifyContent='center'>
        <IconButton
          aria-label='delete'
          disabled={currentQuestion == 0}
          onClick={handleClickUpdateQuestion(-1)}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <Typography variant='h5'>
          {currentQuestion + 1}/{questions.length}
        </Typography>
        <IconButton
          aria-label='delete'
          disabled={currentQuestion == questions.length - 1}
          onClick={handleClickUpdateQuestion(1)}
          color='primary'
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Stack>
      <Question info={questionInfo} />
      <Stack direction='row' alignItems='center' justifyContent='center' gap={2}>
        <Box component='div' sx={{ display: 'inline' }} alignItems='center'>
          Correctas:{correctQuestions}
        </Box>
        <CheckBoxOutlinedIcon></CheckBoxOutlinedIcon>
        <Box component='div' sx={{ display: 'inline' }} alignItems='center'>
          Incorrectas:{incorrectQuestions}{' '}
        </Box>
        <BlockOutlinedIcon></BlockOutlinedIcon>
        <Box component='div' sx={{ display: 'inline' }} alignItems='center'>
          Pendientes:{pendentQuestions}
        </Box>
        <ErrorOutlineOutlinedIcon></ErrorOutlineOutlinedIcon>
      </Stack>
    </>
  );
};
