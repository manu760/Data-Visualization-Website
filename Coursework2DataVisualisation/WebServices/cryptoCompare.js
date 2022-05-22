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
var PutData;
(function (PutData) {
    var moment = require('moment'); //Time library that is used to increment dates.
    var axios = require('axios'); // Axios will handle HTTP requests to web service
    var dotenv = require('dotenv'); //Reads keys from .env file
    var AWS = require('aws-sdk'); //AWS Library to send data to dynamo DB
    var fs = require('fs'); // To write the data to json file
    var currencyName = ["BTC", "ETH", "ZEC", "BNB", "BCH"];
    dotenv.config(); //Copy variables in file into environment variables
    //fileSystem class to save the data to the json file
    var fileSystem = /** @class */ (function () {
        function fileSystem() {
        }
        return fileSystem;
    }());
    //Class that wraps cryptoCompare web service
    var Crypto = /** @class */ (function () {
        function Crypto() {
            //Base URL of crypto compare API
            //baseURL: string = "https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=1000";
            this.baseURL = "https://min-api.cryptocompare.com/data/v2/histoday";
            this.accessKey = "0ad87feb8506922f7d97577db0063087f14d064439cdc39b32a39dd285bdc6666"; // api key
        }
        //Returns a Promise that will get the exchange rates for the specified date
        Crypto.prototype.getExchangeRates = function (currency) {
            //Build URL for API call
            var url = this.baseURL + "?";
            url += "fsym=" + currency + "&tsym=USD&limit=500";
            // add the api key to the url
            url += "&api_key=" + this.accessKey;
            //Output URL and return Promise
            console.log("Building cryptoCompare Promise with URL: " + url);
            return axios.get(url);
        };
        return Crypto;
    }());
    PutData.Crypto = Crypto;
    function convertSecondsToDateAndTime(secondsSinceEpoch) {
        var date = new Date(secondsSinceEpoch * 1000).toISOString().split('T');
        //console.log(date[0] + " " + date[1].split('.')[0]);
        return date[0] + " " + date[1].split('.')[0];
    }
    convertSecondsToDateAndTime(1604534400);
    //Gets the historical data for a range of dates.
    function getHistoricalData() {
        return __awaiter(this, void 0, void 0, function () {
            var currencyIndex, _loop_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currencyIndex = 0;
                        _loop_1 = function () {
                            var cryptoCompare, promiseArray, trainingData_1, testingData_1, trainTarget_1, testingTaregt_1, trainTargetIndex_1, trainLimit_1, resultArray_1, error_1;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        cryptoCompare = new Crypto();
                                        promiseArray = [];
                                        //Work forward from start date
                                        promiseArray.push(cryptoCompare.getExchangeRates(currencyName[currencyIndex]));
                                        _b.label = 1;
                                    case 1:
                                        _b.trys.push([1, 3, , 4]);
                                        trainingData_1 = new fileSystem();
                                        testingData_1 = new fileSystem();
                                        trainTarget_1 = [];
                                        testingTaregt_1 = [];
                                        trainTargetIndex_1 = 0;
                                        trainLimit_1 = Math.ceil(800 * 0.5);
                                        return [4 /*yield*/, Promise.all(promiseArray)];
                                    case 2:
                                        resultArray_1 = _b.sent();
                                        //Output the data
                                        resultArray_1.forEach(function (result) {
                                            //data contains the body of the web service response
                                            var data = resultArray_1[0]['data'];
                                            //Check that API call not succeeded.
                                            if (data.Response != 'Success') {
                                                console.log(" ERROR: " + JSON.stringify(data.error)); //Print the error
                                                //Check that API call succeeded.
                                            }
                                            else if (data.Response == 'Success') {
                                                var cryptoData = data.Data.Data;
                                                var testingIndex = trainLimit_1;
                                                var trainEpoch = cryptoData[trainTargetIndex_1].time;
                                                var testingEpoch = cryptoData[testingIndex].time;
                                                var trainStart = convertSecondsToDateAndTime(trainEpoch);
                                                var testStart = convertSecondsToDateAndTime(testingEpoch);
                                                trainingData_1.start = trainStart;
                                                testingData_1.start = testStart;
                                                cryptoData.forEach(function (crypto, index) {
                                                    //Create new DocumentClient
                                                    var documentClient = new AWS.DynamoDB.DocumentClient();
                                                    // //Table name and data for table
                                                    var params = {
                                                        TableName: "crypto_data",
                                                        Item: {
                                                            PriceTimeStamp: crypto.time,
                                                            Currency: currencyName[currencyIndex],
                                                            LowPrice: crypto.low,
                                                            HighPrice: crypto.high,
                                                            Price: crypto.open
                                                        }
                                                    };
                                                    if (trainTargetIndex_1++ < trainLimit_1)
                                                        trainTarget_1.push(crypto.open);
                                                    else
                                                        testingTaregt_1.push(crypto.open);
                                                    //target.push(crypto.open); // push the prices to the target
                                                    AWS.config.update({
                                                        region: 'us-east-1',
                                                        endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
                                                        accessKeyId: 'ASIA2VKIZ7PJDMUTKLA7',
                                                        secretAccessKey: 'aqf4J6n5h4mJQZwun64EASiEjSN7fuzWJpUKE4qx',
                                                        sessionToken: 'FwoGZXIvYXdzEDMaDO8hlVu5XDGqnvp80CK8AVT1BzYFthjjww9oyDfDhkvB1HLGWI60G/iW9lt7D7cm3taA8W/ChqTUnn/AGoLyEF1KnF94OsGKR0pRhov7IWJuKnUlTLy5rsbO61oKuJ+0s21PuOGq+POF/ih/SeykUd8u9NGaml0YVfngogCW0ow0n+LeQoi9TSndFz+PvBfMVsKbYFM+UXkGzQzvGEb6x3DcDufzspWxb6P7VT6Jva1ycQViJPa8JdTVgglXOlWquAoTO61TVB79/dapKIXgupIGMi0i86MwTz+WgrlyNLWttO2w7VZKBJ4f17KzAxDHCom8U62y3h/Bk0O6LF6SsHw='
                                                    });
                                                    //Store data in DynamoDB and handle errors
                                                    documentClient.put(params, function (err, data) {
                                                        if (err) {
                                                            console.error("Unable to add item", params.Item.Currency);
                                                            console.error("Error JSON:", JSON.stringify(err));
                                                        }
                                                        else {
                                                            console.log("Details added to table:", params.Item);
                                                        }
                                                    });
                                                });
                                                trainingData_1.target = trainTarget_1;
                                                testingData_1.target = testingTaregt_1;
                                                fs.writeFile('./TrainingAndTestingFiles/numerical_data_' + currencyName[currencyIndex] + '.json', JSON.stringify(trainingData_1), function (err) {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                    console.log("JSON DATA IS SAVED");
                                                });
                                                //fileSystemList.target = target;
                                                fs.writeFile('./TrainingAndTestingFiles/numerical_data_' + currencyName[currencyIndex] + '_train.json', JSON.stringify(testingData_1), function (err) {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                    console.log("JSON DATA IS SAVED");
                                                });
                                            }
                                        });
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_1 = _b.sent();
                                        console.log("Error: " + JSON.stringify(error_1));
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        };
                        currencyIndex = 0;
                        _a.label = 1;
                    case 1:
                        if (!(currencyIndex < currencyName.length)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1()];
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
    //Call function to get historical data
    getHistoricalData();
})(PutData || (PutData = {}));
