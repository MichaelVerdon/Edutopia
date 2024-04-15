import React, { useState, useEffect } from 'react';

function Question ({questionJson, close, gameHandler}) {
    
    const [question, setQuestion] = useState(questionJson); //question_id, topic_id, question_text, option_one, option_two, option_three, option four, correct
    const [answer, setAnswer] = useState(3) //id of the clicked button, now set to 1 bc otherwise error
    const [color, setColor] = useState('#e9c46a') //yellow, buttons original color
    const [isDisabled, setDisabled] = useState(false); //disables the buttons
    //the timer constants
    const [time, setTime] = useState(+20);
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    //the timer code
    useEffect(() => {
        const timer = setInterval(() => {
        setTime(time - 1);
        }, 1000);

        if (time === 0) {
        clearInterval(timer);
        close()
        }

        return () => {
        clearInterval(timer);
        };
    });

    //shortcut function for delay
    const delay = ms => new Promise(res => setTimeout(res, ms));

    //when button is clicked code
    const onAnswerClick = async (answer) => {
        setDisabled(true);
        setAnswer(answer)
        if (question[answer] === question[7]){
            setColor('#68e868') //green
            gameHandler.questionCorrect();
            
        }else{
            setColor('#e86868') //red
        }
        await delay(2000);
        close();
    }

    //changing color of a button
    useEffect(()=>{
        document.getElementById(answer).style.backgroundColor =color},[color,answer])
        
    //the page html
    return(
        <div className='QuestionField'>
            <small>Timer </small>
            <small>
                {minutes}:{seconds}
            </small>
            <h1>Question:</h1>
            <h2>{question[2]}</h2>
            <div>
                <button className='btn' id='3' disabled={isDisabled} onClick={() => onAnswerClick(3)}>{question[3]}</button>
                <button className='btn' id='4' disabled={isDisabled} onClick={() => onAnswerClick(4)}>{question[4]}</button>
                <button className='btn' id='5' disabled={isDisabled} onClick={() => onAnswerClick(5)}>{question[5]}</button>
                <button className='btn' id='6' disabled={isDisabled} onClick={() => onAnswerClick(6)}>{question[6]}</button>
            </div>
        </div>

    );
}
export default Question;