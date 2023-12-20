class GameHandler{

    constructor(topics){
        this.topics = topics;
        this.api_url = "http://localhost:9000/get_question?topic_id=";
    }

    // To check a player answered correctly or incorrectly 
    static questionStatus(question_data, answer){
        if(answer == question_data[6]){
            return true;
        }
        else{
            return false;
        }
    }

}