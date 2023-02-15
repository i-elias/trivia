import React from 'react';

export default function QuizContent(props) {
  const {
    currentSelection,
    answerId,
    answer,
    isChecked,
    handleChange,
    correctAnswer,
    selections,
    index,
    checkAnswers,
  } = props;

  /* backgroundColor: 
      correct answer ->  'green' hue value of #86f77c 
      incorrect answer -> 'red' hue value of #ff0000
      unselected answers -> transparent

      opacity: 
      incorrect and unselected answers -> 0.5

      color: 
      correct answer -> #293264
   */
  function renderStyles() {
    const styles = {
      cursor: 'default',
    };

    if (checkAnswers) {
      //display all correct answers regardless if right or wrong
      if (
        selections[index][currentSelection].toString() ===
        correctAnswer.toString()
      ) {
        styles.backgroundColor = '#86f77c'; // green
        styles.color = '#293264';
      }

      if (correctAnswer.toString() !== answer.toString()) {
        if (
          selections[index][currentSelection].toString() ===
          correctAnswer.toString()
        ) {
          styles.backgroundColor = 'transparent';
          styles.opacity = 0.5;
        } else if (
          selections[index][currentSelection].toString() !== answer.toString()
        ) {
          styles.backgroundColor = 'transparent';
          styles.opacity = 0.5;
        } else {
          styles.backgroundColor = '#ff0000'; //red
          styles.opacity = 0.5;
        }
      } else {
        styles.backgroundColor = '#86f77c'; // green
        styles.borderColor = 'transparent';
      }
    } else {
      return;
    }
    return styles;
  }

  const styles = renderStyles();
  return (
    <div>
      <input
        type="radio"
        name={currentSelection}
        value={answer}
        id={answerId}
        checked={isChecked}
        onChange={event => handleChange(event, index)}
        disabled={checkAnswers}
      />
      <label
        style={styles}
        className={`quiz__label ${isChecked ? 'answer__chosen' : ''}`}
        htmlFor={answerId}
      >
        {answer}
      </label>
    </div>
  );
}
