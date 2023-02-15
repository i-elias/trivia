import React from 'react';

export default function StartGame(props) {
  return (
    <main className="start__page">
      <h1 className="quiz__title">Quizzical</h1>
      <p className="quiz__description">the only trivia game you’ll need</p>
      <button className="btn btn__start--quiz" onClick={props.startQuiz}>
        Start quiz
      </button>
    </main>
  );
}
