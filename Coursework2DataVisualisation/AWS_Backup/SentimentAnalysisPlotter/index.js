let AWS = require("aws-sdk"); //import library
const dynamodb = new AWS.DynamoDB.DocumentClient();
//Import external library with websocket functions
let ws = require('websocket');

//Hard coded domain name and stage - use when pushing messages from server to client
let domainName = "5k63urp3zi.execute-api.us-east-1.amazonaws.com";
let stage = "prod";

//parameters to read the sentiment values from dynamoDB Table
let params = {
    TableName: "sentimentAnalysisOnTweetsData"
}

//get the values from table
function getTweetsText() {
    let data = dynamodb.scan(params).promise();
    return data;

}

//get the sentiment values
async function getSentimentValues() {
    let values = [];
    const items = await getTweetsText();
    const dataItems = items.Items;
    for (let index = 0; index < dataItems.length; index++) {
        let tweets = dataItems[index];
        values.push(tweets);
    }
    return values;

}

exports.handler = async (event) => {
    let sentiments = [];
    try {
        const tweets = getSentimentValues();//invoke method to get sentiment values

        // get the values if the currency is BNB
        let bnbSentimentAnalysis = await tweets.then((tweets) => {
            let counter = [0, 0, 0, 0]; //count the values positive,negative,Mixed and Neutral

            //get the four values
            for (let index = 0; index < tweets.length; index++) {
                let positiveText = tweets[index].PositiveScore;
                let negativeText = tweets[index].NegativeScore;
                let neutraltext = tweets[index].NeutralScore;
                let mixedText = tweets[index].MixedScore;
                let currency = tweets[index].Currency;

                //if the currency is BNB then get the maximum score of the sentiment values
                if(currency === "BNB"){
                    let sentimentValues = [positiveText, negativeText, neutraltext, mixedText]; //get all values into array
                    let maximumScore = Math.max.apply(null, sentimentValues);//calculate maximum score
                    let maximumIndex = sentimentValues.indexOf(maximumScore);//index of maximum value
                    counter[maximumIndex]++;//increment the count
                }
            }
            return counter;// return the counter of all sentiment values
        });

        //repeat the same step to get data for BTC currency
        let btcSentimentValues = await tweets.then((tweets) => {
            let counter = [0, 0, 0, 0];

            for (let index = 0; index < tweets.length; index++) {
                let positiveText = tweets[index].PositiveScore;
                let negativeText = tweets[index].NegativeScore;
                let neutraltext = tweets[index].NeutralScore;
                let mixedText = tweets[index].MixedScore;
                let currency = tweets[index].Currency;

                if(currency === "BTC"){
                    let sentimentValues = [positiveText, negativeText, neutraltext, mixedText];
                    let maximumScore = Math.max.apply(null, sentimentValues);
                    let maximumIndex = sentimentValues.indexOf(maximumScore);
                    counter[maximumIndex]++;
                }
            }
            return counter;
        });
//repeat the same step to get data for ZEC currency
        let zecSentimentValues = await tweets.then((tweets) => {
            let counter = [0, 0, 0, 0];

            for (let index = 0; index < tweets.length; index++) {
                let positiveText = tweets[index].PositiveScore;
                let negativeText = tweets[index].NegativeScore;
                let neutraltext = tweets[index].NeutralScore;
                let mixedText = tweets[index].MixedScore;
                let currency = tweets[index].Currency;

                if(currency === "ZEC"){
                    let sentimentValues = [positiveText, negativeText, neutraltext, mixedText];
                    let maximumScore = Math.max.apply(null, sentimentValues);
                    let maximumIndex = sentimentValues.indexOf(maximumScore);
                    counter[maximumIndex]++;
                }
            }
            return counter;
        });
//repeat the same step to get data for ETH currency
        let ethSentimentValues = await tweets.then((tweets) => {
            let counter = [0, 0, 0, 0];

            for (let index = 0; index < tweets.length; index++) {
                let positiveText = tweets[index].PositiveScore;
                let negativeText = tweets[index].NegativeScore;
                let neutraltext = tweets[index].NeutralScore;
                let mixedText = tweets[index].MixedScore;
                let currency = tweets[index].Currency;

                if(currency === "ETH"){
                    let sentimentValues = [positiveText, negativeText, neutraltext, mixedText];
                    let maximumScore = Math.max.apply(null, sentimentValues);
                    let maximumIndex = sentimentValues.indexOf(maximumScore);
                    counter[maximumIndex]++;
                }
            }
            return counter;
        });
//repeat the same step to get data for BCH currency
        let bchSentimentValues = await tweets.then((tweets) => {
            let counter = [0, 0, 0, 0];

            for (let index = 0; index < tweets.length; index++) {
                let positiveText = tweets[index].PositiveScore;
                let negativeText = tweets[index].NegativeScore;
                let neutraltext = tweets[index].NeutralScore;
                let mixedText = tweets[index].MixedScore;
                let currency = tweets[index].Currency;

                if(currency === "BCH"){
                    let sentimentValues = [positiveText, negativeText, neutraltext, mixedText];
                    let maximumScore = Math.max.apply(null, sentimentValues);
                    let maximumIndex = sentimentValues.indexOf(maximumScore);
                    counter[maximumIndex]++;
                }
            }
            return counter;
        });

        let msgs = [];
//send the sentiment values into a JSON string
        let msg1 = {
            data: {
                values: btcSentimentValues,
                labels: ['Positive', 'Negative', 'Neutral', 'Mixed'],
                type: 'pie',
                Currency: "BTC"
            },
            layout: {
                height: 500,
                width: 600
            }
        };

        console.log("BITCOIN - " +  JSON.stringify(msg1));
        let msg2 = {
            data: {
                values: bnbSentimentAnalysis,
                labels: ['Positive', 'Negative', 'Neutral', 'Mixed'],
                type: 'pie',
                Currency: "BNB"
            },
            layout: {
                height: 500,
                width: 600
            }
        };

        console.log("BNB - " + JSON.stringify(msg2));

        let msg3 = {
            data: {
                values: zecSentimentValues,
                labels: ['Positive', 'Negative', 'Neutral', 'Mixed'],
                type: 'pie',
                Currency: "ZEC"
            },
            layout: {
                height: 500,
                width: 600
            }
        };


        console.log("ZEC - " +  JSON.stringify(msg3));
        let msg4 = {
            data: {
                values: ethSentimentValues,
                labels: ['Positive', 'Negative', 'Neutral', 'Mixed'],
                type: 'pie',
                Currency: "ETH"
            },
            layout: {
                height: 500,
                width: 600
            }
        };

        console.log("ETH - " +  JSON.stringify(msg4));

        let msg5 = {
            data: {
                values: bchSentimentValues,
                labels: ['Positive', 'Negative', 'Neutral', 'Mixed'],
                type: 'pie',
                Currency: "BCH"
            },
            layout: {
                height: 500,
                width: 600
            }
        };

        console.log("BCH - " +  JSON.stringify(msg5));
//push all the strings into an empty array
        msgs.push(msg1);
        msgs.push(msg2);
        msgs.push(msg3);
        msgs.push(msg4);
        msgs.push(msg5);

//JSON string to send the data to websockets
        let stringMessage = JSON.stringify(msgs);
        console.log(stringMessage);

        let sendMsgPromises = await ws.getSendMessagePromises(stringMessage, domainName, stage);
        console.log(sendMsgPromises);
        await Promise.all(sendMsgPromises);

    }
    catch (error) {
        return { statusCode: 500, body: "Error: " + JSON.stringify(error) };
    }
    return {
        statusCode: 200,
        body: "Data sent sucessfully"
    };

};
