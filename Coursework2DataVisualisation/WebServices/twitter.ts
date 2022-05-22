//Module that reads keys from .env file
const dotenv = require('dotenv');

//Node Twitter library
const Twitter = require('twitter');

//AWS library
let AWS = require("aws-sdk");

//aws keys
AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com",
    accessKeyId: 'ASIA2VKIZ7PJNDY44VZL',
    secretAccessKey: 'BD8j+FEeCzxJs9iC9uG2xzSDIAjnoxSeaE6WHYLh',
    sessionToken: 'FwoGZXIvYXdzEAwaDGSNshBhd9xbUsTpGCK8AVq8WWPvoxPBsD2A4T4RYhfJ9bydsCP+TSIOsKQM3752n0uYZagBdx5kgpeFSoO4W/Y6JaPBy0Gw+7YXV8VdZar9EzRze2zo0FbA7SJ9LCoUP7TX0OLN2zygi3PUhYzyvN7N38DeDDLlguoV2PAGXIIIcq0ih/5jZYwvBxUs1yKzSefyjzhLkplogIdoOL83iNxn1/ryA3wz3pFOhXpCJEK1Np+ZW47aORSLaL6jIC8ZTYePuEMvrX5f6MjDKIS16pIGMi30G2dABQSH5lzVWk+xm9QsMtM3/TsFavOGlLie7rUEd8J/UnGaHUYC7me0ods='
});

//Copy variables in the file into environment variables
dotenv.config();

let currencyName = ["BTC", "ETH", "ZEC", "BNB", "BCH"];//five currencies

//twitter interface
interface twitterObject {
    id: number;
    text: string;
    created_at: string;
    error: twitterError
}
//interface for error
interface twitterError {
    code: number,
    type: string,
    info: string,
}

//Set up the Twitter client with the credentials
let client = new Twitter({
    consumer_key: "WQlk2KouqzcOTpMnyYyMedPfL",
    consumer_secret: "x80LCtbfosizJz6xQrSqx3L8GsUMZcc89fAWwDoL5GPXmS3ATf",
    access_token_key: "615346502-R7bC0VOZ4pyTDJNqfkBUAOxktHUFZrLkMNr6AkhP",
    access_token_secret: "NI9xPUy0l8VVN7rXfE2w436qewMiFtKdsdX6rDfx6vHIb",
    bearer_token: "AAAAAAAAAAAAAAAAAAAAAKVKYAEAAAAA5kQcELz%2Bf7oWlRrXizCDSMXfM1U%3DH0Fr74C1386dTtBouFnPux2sHaDU3IvjR7z21JtVxMbrKlxGiM"
});


//Downloads and outputs tweet text
async function searchTweets(keyword: string) {
    for (let currencyIndex = 0; currencyIndex < currencyName.length; currencyIndex++) {

        //Set up parameters for the search
        let searchParams = {
            q: keyword,
            count: 100,
            lang: "en",
        };

        //Wait for search to execute asynchronously
        let result = await client.get('search/tweets', searchParams);

        //Output the result
        result.statuses.forEach((tweet) => {
            console.log("Tweet id: " + tweet.id + ". Tweet text: " + tweet.text + " Time - " + tweet.created_at);

            // Create new DocumentClient
            let documentClient = new AWS.DynamoDB.DocumentClient();
            //Table name and data for table
            let params = {
                TableName: "Twitter_tweet_Data",
                Item: {
                    Id: tweet.id,  // id of tweets
                    Time: tweet.created_at,
                    Text: tweet.text, // tweets
                    Currency: currencyName[currencyIndex],


                }
            };

            // Store data in DynamoDB and handle errors
            documentClient.put(params, (error, data) => {
                if (error) {
                    console.error("Unable to add item" + params.Item.Id);
                    console.error("Error JSON:" + JSON.stringify(error));
                } else {
                    console.log("Details added to table:" + params.Item);
                }
            });

        });
    }

};

//Call function to search for tweets with specified coins
searchTweets("BTC");
searchTweets("ETH");
searchTweets("ZEC");
searchTweets("BNB");
searchTweets("BCH");


