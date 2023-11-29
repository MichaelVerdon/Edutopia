import React from 'react';

function Question ({questionJson, close}) {
    //question_id, topic_id, question_text, option_one, option_two, option_three, option four, correct
    let question = JSON.parse(questionJson);

    //TODO timer, totally dont steal from here https://stackoverflow.com/questions/40885923/countdown-timer-in-react

    const onAnswerClick = (button) => {
        if (Number(button.id) == question.correct){
            button.style.backgroundColor = "#AED581";
            delay(1000);
            close;
        } else{
            button.style.backgroundColor = "#FF4443";
            delay(1000);
            close;
        }
    }

 
    return(
        <div className='QuestionField'>
            <small>Timer:</small>
            <h1>Question:</h1>
            <h2>{question.Question_text}</h2>
            <div>
                <button className='btn' id='1' onClick={onAnswerClick(this)}>{question.Option_one}</button>
                <button className='btn' id='2' onClick={onAnswerClick(this)}>{question.Option_two}</button>
                <button className='btn' id='3' onClick={onAnswerClick(this)}>{question.Option_three}</button>
                <button className='btn' id='4' onClick={onAnswerClick(this)}>{question.Option_four}</button>
            </div>
        </div>

    );
}
export default Question;