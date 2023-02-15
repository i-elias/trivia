import React, { useState, useEffect } from 'react';
import StartGame from './components/StartGame';
import QuizContent from './components/QuizContent';

import { nanoid } from 'nanoid';
export default function App() {
  const [quizData, setQuizData] = useState([]);
  const [quiz, setQuiz] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [checkAnswers, setCheckAnswers] = useState(false);
  const [playAgain, setPlayAgain] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //Fetch API
  useEffect(() => {
    if (!checkAnswers) {
      async function fetchApi() {
        try {
          const res = await fetch(
            'https://opentdb.com/api.php?amount=10&category=22&type=multiple'
          );
          const data = await res.json();
          return data;
        } catch (err) {
          throw Error('Something went wrong:', err);
        }
      }
      fetchApi()
        .then(data => {
          //update quizData' state varaible
          answersArray(data.results);

          //shuffle answers array
          shuffleAnswersArray();

          //update quiz state varaible
          quizObj(data.results);

          //start the game immediately
          if (playAgain) {
            setPlayAgain(false);
            startQuiz();
            setTimeout(() => {
              setIsLoading(false);
            }, 2300);
          }
        })
        .catch(err => console.error(err));
    }
  }, [checkAnswers]);

  useEffect(() => {
    if (quiz.isPlaying) {
      document.body.classList.add('body__bg');
    } else {
      document.body.classList.remove('body__bg');
    }
  }, [quiz.isPlaying]);

  useEffect(() => {
    if (quiz.selections) {
      const questionsComplete = quiz.selections.every(
        selected => selected.isSelected
      );

      setQuiz(prevState =>
        questionsComplete ? { ...prevState, allAnswered: true } : prevState
      );
    }
  }, [quiz.selections]);

  function answersArray(array) {
    setQuizData(() => {
      return array.map(arr => {
        return {
          ...arr,
          answers: [arr.correct_answer, ...arr.incorrect_answers],
        };
      });
    });
  }

  //generate object
  function quizObj(data) {
    let obj = {
      selections: [],
      allAnswered: false,
      isPlaying: false,
    };
    for (let i = 0; i < data.length; i++) {
      obj.selections.push({
        [`selection_${i + 1}`]: '',
        isSelected: false,
      });
    }
    setQuiz(obj);
  }

  const shuffleAnswersArray = () => {
    setQuizData(oldQuiz => {
      const newArray = [];
      for (let i = 0; i < oldQuiz.length; i++) {
        const answerArr = oldQuiz[i].answers;
        const shuffledAnswers = answerArr.sort((a, b) => 0.5 - Math.random());
        newArray.push({ ...oldQuiz[i], answers: shuffledAnswers });
      }
      return newArray;
    });
  };

  function startQuiz() {
    setQuiz(oldSelections => ({ ...oldSelections, isPlaying: true }));
  }

  function handleSubmit() {
    event.preventDefault();
    if (checkAnswers) {
      //reset states variables
      setCheckAnswers(false);
      setCorrectAnswers([]);
      setPlayAgain(true);
      setIsLoading(true);
    } else if (quiz.allAnswered) {
      const correctAnswersArray = [];
      for (let i = 0; i < quizData.length; i++) {
        const selection = quiz.selections[i];
        const qData = quizData[i];
        if (selection[`selection_${i + 1}`] === qData.correct_answer) {
          correctAnswersArray.push(selection[`selection_${i + 1}`]);
        }
      }
      setCheckAnswers(true);
      setCorrectAnswers(correctAnswersArray);
    }
  }

  function handleChange(event, index) {
    const { name, value } = event.target;
    setQuiz(oldSelections => {
      const selections = [...oldSelections.selections];
      selections[index] = {
        ...selections[index],
        [name]: value,
        isSelected: !selections[index].isSelected,
      };
      return { ...oldSelections, selections };
    });
  }

  //generate html elements
  function formElements() {
    const quizElement = quizData.map((arr, index) => {
      return (
        <div className="content__card" key={nanoid()}>
          {isLoading ? (
            <>
              <div className="skeleton skeleton__header"></div>
              <span className="skeleton skeleton__text"></span>
              <span className="skeleton skeleton__text"></span>
              <span className="skeleton skeleton__text"></span>
              <span className="skeleton skeleton__text"></span>
            </>
          ) : (
            <>
              <h3>{arr.question}</h3>
              <div className="input__grp" key={nanoid()}>
                {arr.answers.map(answer => {
                  return (
                    <QuizContent
                      key={nanoid()}
                      checkAnswers={checkAnswers}
                      selections={quiz.selections}
                      index={index}
                      correctAnswer={arr.correct_answer}
                      currentSelection={`selection_${index + 1}`}
                      answerId={nanoid()}
                      answer={answer}
                      isChecked={
                        quiz?.selections[index][
                          `selection_${index + 1}`
                        ].toString() === answer.toString()
                      }
                      handleChange={handleChange}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      );
    });

    return quizElement;
  }

  const quizBtn = [];
  if (!checkAnswers && !isLoading) {
    quizBtn.push(
      <button key={nanoid()} className="btn check__answers--btn">
        Check Answers
      </button>
    );
  } else if (isLoading) {
    quizBtn.push(
      <button key={nanoid()} className="btn check__answers--btn">
        Loading <span className="btn__load">...</span>
      </button>
    );
  } else {
    quizBtn.push(
      <button key={nanoid()} className="btn check__answers--btn">
        Play Again
      </button>
    );
  }

  return (
    <div>
      {quiz?.isPlaying ? (
        <div className="quiz__container">
          <div className="container">
            <h1 className="quiz__title quiz__page-title">Quizzical</h1>

            <p
              className="quiz__body"
              style={{ visibility: isLoading ? 'hidden' : 'visible' }}
            >
              Please answer all questions.
            </p>

            <form className="form" onSubmit={handleSubmit}>
              {formElements()}
              <div
                style={{ alignItems: checkAnswers ? 'center' : 'none' }}
                className="form__btn--container"
              >
                {checkAnswers && (
                  <p className="check__answers--body">
                    You scored {`${correctAnswers.length}/${quizData.length}`}{' '}
                    correct answers
                  </p>
                )}
                {quizBtn}
              </div>
            </form>
          </div>
        </div>
      ) : (
        <StartGame startQuiz={startQuiz} />
      )}
    </div>
  );
}
