



function Question ({questions}) {
    /*
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answerIndex, setAnswerIndex] = useState(null);
    const {question_id, topic_id, question_text, option_one, option_two, option_three, option_four, correct} = questions[currentQuestion]

    const onAnswerClick = (answer, index) => {
        setAnswerIndex(index);
    }
    */
    return(
        <div className='QuestionField'>
            <h1>Question: </h1>
            <div>
                <button className='btn'></button>
                <button className='btn'></button>
                <button className='btn'></button>
                <button className='btn'></button>
            </div>
        </div>

    );
}
export default Question;