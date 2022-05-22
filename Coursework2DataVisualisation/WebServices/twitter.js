var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
//Module that reads keys from .env file
var dotenv = require('dotenv');
//Node Twitter library
var Twitter = require('twitter');
//AWS library
var AWS = require("aws-sdk");
AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com",
    accessKeyId: 'ASIA2VKIZ7PJNDY44VZL',
    secretAccessKey: 'BD8j+FEeCzxJs9iC9uG2xzSDIAjnoxSeaE6WHYLh',
    sessionToken: 'FwoGZXIvYXdzEAwaDGSNshBhd9xbUsTpGCK8AVq8WWPvoxPBsD2A4T4RYhfJ9bydsCP+TSIOsKQM3752n0uYZagBdx5kgpeFSoO4W/Y6JaPBy0Gw+7YXV8VdZar9EzRze2zo0FbA7SJ9LCoUP7TX0OLN2zygi3PUhYzyvN7N38DeDDLlguoV2PAGXIIIcq0ih/5jZYwvBxUs1yKzSefyjzhLkplogIdoOL83iNxn1/ryA3wz3pFOhXpCJEK1Np+ZW47aORSLaL6jIC8ZTYePuEMvrX5f6MjDKIS16pIGMi30G2dABQSH5lzVWk+xm9QsMtM3/TsFavOGlLie7rUEd8J/UnGaHUYC7me0ods='
});
//Copy variables in the file into environment variables
dotenv.config();
var currencyName = ["BTC", "ETH", "ZEC", "BNB", "BCH"];
//Set up the Twitter client with the credentials
var client = new Twitter({
    consumer_key: "WQlk2KouqzcOTpMnyYyMedPfL",
    consumer_secret: "x80LCtbfosizJz6xQrSqx3L8GsUMZcc89fAWwDoL5GPXmS3ATf",
    access_token_key: "615346502-R7bC0VOZ4pyTDJNqfkBUAOxktHUFZrLkMNr6AkhP",
    access_token_secret: "NI9xPUy0l8VVN7rXfE2w436qewMiFtKdsdX6rDfx6vHIb",
    bearer_token: "AAAAAAAAAAAAAAAAAAAAAKVKYAEAAAAA5kQcELz%2Bf7oWlRrXizCDSMXfM1U%3DH0Fr74C1386dTtBouFnPux2sHaDU3IvjR7z21JtVxMbrKlxGiM"
});
//Downloads and outputs tweet text
function searchTweets(keyword) {
    return __awaiter(this, void 0, void 0, function () {
        var _loop_1, currencyIndex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _loop_1 = function (currencyIndex) {
                        var searchParams, result;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    searchParams = {
                                        q: keyword,
                                        count: 10000,
                                        lang: "en"
                                    };
                                    return [4 /*yield*/, client.get('search/tweets', searchParams)];
                                case 1:
                                    result = _b.sent();
                                    // console.log(JSON.stringify(result));
                                    //Output the result
                                    result.statuses.forEach(function (tweet) {
                                        var count = 0;
                                        console.log("Tweet id: " + tweet.id + ". Tweet text: " + tweet.text + " Time - " + tweet.created_at);
                                        // Create new DocumentClient
                                        var documentClient = new AWS.DynamoDB.DocumentClient();
                                        //Table name and data for table
                                        var params = {
                                            TableName: "Twitter_tweet_Data",
                                            Item: {
                                                Id: tweet.id,
                                                Time: tweet.created_at,
                                                Text: tweet.text,
                                                Currency: currencyName[currencyIndex]
                                            }
                                        };
                                        // Store data in DynamoDB and handle errors
                                        documentClient.put(params, function (error, data) {
                                            if (error) {
                                                console.error("Unable to add item" + params.Item.Id);
                                                console.error("Error JSON:" + JSON.stringify(error));
                                            }
                                            else {
                                                console.log("Details added to table:" + params.Item);
                                            }
                                        });
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    };
                    currencyIndex = 0;
                    _a.label = 1;
                case 1:
                    if (!(currencyIndex < currencyName.length)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(currencyIndex)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    currencyIndex++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
;
//Call function to search for tweets with specified subject
searchTweets("BTC");
searchTweets("ETH");
searchTweets("ZEC");
searchTweets("BNB");
searchTweets("BCH");
