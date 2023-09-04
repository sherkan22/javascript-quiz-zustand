import { create } from 'zustand';
import { type Question } from '../types';

interface State {
  questions: Question[];
  currentQuestion: number;
  fetchQuestion: (limit: number) => Promise<void>;
  selectAnswer: (questionId: number, answerIndex: number) => void;
  updateCurrentQuestion: (changeQuestion: number) => void;
  updateInfoQuestion: () => void;
  correctQuestions: number;
  incorrectQuestions: number;
  pendentQuestions: number;
}

const API_URL = import.meta.env.PROD ? 'http://sherkan-craven-teeth.surge.sh' : 'http://localhost:5173/'

export const useQuestionsStore = create<State>((set, get) => {
  return {
    questions: [],
    currentQuestion: 0,
    fetchQuestion: async (limit: number) => {
      console.log(API_URL);
      const res = await fetch(`${API_URL}/data.json`);
      const json = await res.json();
      console.log(json);
      const questions = json.sort(() => Math.random() - 0.5).slice(0, limit);
      set({ questions });
    },
    selectAnswer: (questionId: number, answerIndex: number) => {
      const { questions } = get();
      const newQuestions = structuredClone(questions);
      const questionIndex = newQuestions.findIndex((q) => q.id === questionId);
      const questionInfo = newQuestions[questionIndex];
      const isCorrectUserAnswer = questionInfo.respuestaCorrecta === answerIndex;

      newQuestions[questionIndex] = {
        ...questionInfo,
        esRespuestaCorrecta: isCorrectUserAnswer,
        seleccionRespuestaUsuario: answerIndex,
      };
      set({ questions: newQuestions });
    },
    updateCurrentQuestion: (changeQuestion: number) => {
      const { currentQuestion } = get();
      set({ currentQuestion: currentQuestion + changeQuestion });
    },
    updateInfoQuestion: () => {
      let correctQuestions = 0;
      let incorrectQuestions = 0;
      let pendentQuestions = 0;
      const { questions } = get();
      questions.map((question) => {
        if (question.seleccionRespuestaUsuario != null) {
          if (question.respuestaCorrecta == question.seleccionRespuestaUsuario) {
            correctQuestions++;
          } else {
            incorrectQuestions++;
          }
        } else {
          pendentQuestions++;
        }
      });
      set({ correctQuestions: correctQuestions++ });
      set({ incorrectQuestions: incorrectQuestions++ });
      set({ pendentQuestions: pendentQuestions + 1 });
    },
    correctQuestions: 0,
    incorrectQuestions: 0,
    pendentQuestions: 0,
  };
});
