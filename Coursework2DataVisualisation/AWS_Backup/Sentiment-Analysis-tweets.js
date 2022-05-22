let AWS = require("aws-sdk"); //import library
const dynamodb = new AWS.DynamoDB.DocumentClient();//import dynamoDB
let comprehend = new AWS.Comprehend();//Create instance of Comprehend

//Parameters to read data from dynaomoDb table
let params = {
    TableName: "Twitter_tweet_Data" // table name
}

exports.handler = async (event) => {
    try {
        //scan data from table
        let tweetsData = await dynamodb.scan(params).promise();
        let tweetsItems = tweetsData.Items;
        for (let index = 0; index < tweetsItems.length; index++) {
            let id = tweetsItems[index].Id;//get id
            let currency = tweetsItems[index].Currency;//get currency
            let text = tweetsItems[index].Text;//get text
            let date = tweetsItems[index].Time;//get time

            //parameters to get sentiment analysis on tweets
            let sentimentParams = {
                LanguageCode: "en",
                Text: text
            };
            //call comprehend to detect sentiments on text
            await comprehend.detectSentiment(sentimentParams, (error, data) => {
                //if data then get the sentiment analysis and send it to dynamodb
                if (data) {
                    console.log("SUCCESSFULL CALL TO COMPREHEND - " + data.SentimentScore.Positive);
                    //parameters to save the data into dynamodb with sentiment analysis
                    let saveDataParams = {
                        TableName: "sentimentAnalysisOnTweetsData",
                        LanguageCode: "en",
                        Item: {
                            Date: date,
                            tweetMessage: text,
                            Currency: currency,
                            Id: id,
                            PositiveScore: data.SentimentScore.Positive,
                            NeutralScore: data.SentimentScore.Neutral,
                            NegativeScore: data.SentimentScore.Negative,
                            MixedScore: data.SentimentScore.Mixed
                        },
                    };
                    //put the data into dynamodb
                    dynamodb.put(saveDataParams, (error, data) => {
                        if (error) {
                            console.log("ERROR - " + JSON.stringify(error));
                        } else {
                            console.log("SENTIMENT ANALYSIS ADDED TO TABLE");
                        }
                    });

                }
                // else throw an exception
                else {
                    console.log("ERROR WITH  CALL TO COMPREHEND: " + JSON.stringify(error));
                }
            }).promise(); //return promise
        }
    }
        //catch the error
    catch (error) {
        console.log(JSON.stringify(error));
    }

};


