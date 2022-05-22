let AWS = require("aws-sdk");//aws-sdk will be used to get DynamoDB
let db = require('database');//Import functions for database
let ws = require('websocket');//Import external library with websocket functions
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
let domainName = "14817e7iv6.execute-api.us-east-1.amazonaws.com";//domain name
let stage = "prod";//stage
let comprehend = new AWS.Comprehend();//Create instance of Comprehend

exports.handler = async (event) => {
    event.Records.forEach(async (record) => {
//if the name of the event is Insert then get this data from event
        if(record.eventName == 'INSERT'){
            let message = record.dynamoDB.NewImage.Text.S;
            let time = record.dynamoDB.NewImage.Time.S;
            let currency = record.dynamoDB.NewImage.Currency.S;
            let id = record.dynamoDB.NewImage.Id.N;

            //parameters to send to Comprehend
            let params = {
                LanguageCode: "en",
                Text: message
            }
            //get sentiment Analysis and send it to dynamoDB table
            let data = await comprehend.detectSentiment(params).promise();
            try{
                if(data){
                    let saveDataParams = {
                        TableName: "sentimentAnalysisOnTweetsData",
                        LanguageCode: "en",
                        Item: {
                            Date: time,
                            tweetMessage: message,
                            Currency: currency,
                            Id: id,
                            PositiveScore: data.SentimentScore.Positive,
                            NeutralScore: data.SentimentScore.Neutral,
                            NegativeScore: data.SentimentScore.Negative,
                            MixedScore: data.SentimentScore.Mixed
                        },
                    };

                    //put objects to dynamoDB table
                    dynamoDB.put(saveDataParams,(error,data) => {
                        if(data){
                            console.log("ADDED SENTIMENT ANALYSIS INTO DYNAMODB TABLE");
                        }else {
                            console.log("ERROR ADDING SENTIMENT ANALYSIS INTO TABLE " + JSON.stringify(error));
                        }
                    });

                }
            }catch(error){ //if error
                console.log("ERROR - "  + JSON.stringify(error));
            }
        }
    });
    let record = event.Records[0];
    if(record.eventName === "INSERT") {
        let dateAndTime = record.dynamoDB.NewImage.Time.S;
        let message = record.dynamoDB.NewImage.Text.S;
        let msg = "ADDED Time - " + dateAndTime + " MESSAGE - " + message;
        let sendMsgPromises = await ws.getSendMessagePromises(msg, domainName, stage);//send data to all clients
        //Execute promises
        await Promise.all(sendMsgPromises);

        const response = {
            statusCode: 200,
            body: JSON.stringify('Hello from Lambda!'),
        };
        return response;
    }
};
