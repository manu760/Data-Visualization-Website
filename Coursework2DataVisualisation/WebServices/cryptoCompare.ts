namespace PutData {
    const moment = require('moment');   //Time library that is used to increment dates.
    const axios = require('axios');     // Axios will handle HTTP requests to web service
    const dotenv = require('dotenv');   //Reads keys from .env file
    const AWS = require('aws-sdk'); //AWS Library to send data to dynamo DB
    const fs = require('fs'); // To write the data to json file

    let currencyName = ["BTC", "ETH", "ZEC", "BNB", "BCH"];//five currencies


    dotenv.config(); //Copy variables in file into environment variables

    //interface for cryptoCompare Object
    interface CryptoObject {
        Response: string,
        error: CryptoError
        Data: {
            Aggregated: boolean,
            TimeFrom: number,
            TimeTo: number,
            Data: [{
                time: number,
                high: number,
                low: number,
                open: number,
                volumefrom: number,
                volumeto: number,
                close: number,
                conversionType: string,
                conversionSymbol: string
            }
            ]
        }

    }

//The data structure of a cryptoCompare error
    interface CryptoError {
        code: number,
        type: string,
        info: string,
    }

//Class that wraps cryptoCompare web service
    export class Crypto {
        //Base URL of crypto compare API
        baseURL: string = "https://min-api.cryptocompare.com/data/v2/histoday"; //link to get data from cryptoCompare
        accessKey: string = "0ad87feb8506922f7d97577db0063087f14d064439cdc39b32a39dd285bdc6666"; // api key

        //Returns a Promise that will get the exchange rates for the specified date
        getExchangeRates(currency): Promise<object> {

            //Build URL for API call
            let url: string = this.baseURL + "?";
            url += "fsym=" + currency + "&tsym=USD&limit=500";
            // add the api key to the url
            url += "&api_key=" + this.accessKey;
            //Output URL and return Promise
            console.log("Building cryptoCompare Promise with URL: " + url);
            return axios.get(url);
        }
    }
//Gets the historical data for a range of dates.
    async function getHistoricalData() {
        /* You should check that the start date plus the number of days is
        less than the current date*/
        let currencyIndex = 0;

        for(currencyIndex = 0; currencyIndex < currencyName.length;currencyIndex++) {
            //Create instance of Crypto class
            let cryptoCompare: Crypto = new Crypto();

            //Array to hold promises
            let promiseArray: Array<Promise<object>> = [];

            //Work forward from start date
            promiseArray.push(cryptoCompare.getExchangeRates(currencyName[currencyIndex]));

            //Wait for all promises to execute
            try {
                let resultArray: Array<object> = await Promise.all(promiseArray);

                //Output the data
                resultArray.forEach((result) => {
                    //data contains the body of the web service response
                    let data: CryptoObject = resultArray[0]['data'];

                    //Check that API call not succeeded.
                    if (data.Response != 'Success') {
                        console.log(" ERROR: " + JSON.stringify(data.error)); //Print the error

                        //Check that API call succeeded.
                    } else if (data.Response == 'Success') {
                        let cryptoData = data.Data.Data;

                        cryptoData.forEach((crypto, index) => {
                          //Create new DocumentClient
                            let documentClient = new AWS.DynamoDB.DocumentClient();

                            // //Table name and data for table
                            let params = {
                                TableName: "crypto_data",
                                Item: {
                                    PriceTimeStamp: crypto.time,//Current time in milliseconds
                                    Currency: currencyName[currencyIndex],
                                    LowPrice: crypto.low,
                                    HighPrice: crypto.high,
                                    Price: crypto.open
                                }
                            };
                        //aws keys
                            AWS.config.update({
                                region: 'us-east-1',
                                endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
                                accessKeyId: 'ASIA2VKIZ7PJDMUTKLA7',
                                secretAccessKey: 'aqf4J6n5h4mJQZwun64EASiEjSN7fuzWJpUKE4qx',
                                sessionToken: 'FwoGZXIvYXdzEDMaDO8hlVu5XDGqnvp80CK8AVT1BzYFthjjww9oyDfDhkvB1HLGWI60G/iW9lt7D7cm3taA8W/ChqTUnn/AGoLyEF1KnF94OsGKR0pRhov7IWJuKnUlTLy5rsbO61oKuJ+0s21PuOGq+POF/ih/SeykUd8u9NGaml0YVfngogCW0ow0n+LeQoi9TSndFz+PvBfMVsKbYFM+UXkGzQzvGEb6x3DcDufzspWxb6P7VT6Jva1ycQViJPa8JdTVgglXOlWquAoTO61TVB79/dapKIXgupIGMi0i86MwTz+WgrlyNLWttO2w7VZKBJ4f17KzAxDHCom8U62y3h/Bk0O6LF6SsHw='
                            });


                            //Store data in DynamoDB and handle errors
                            documentClient.put(params, (err, data) => {
                                if (err) {
                                    console.error("Unable to add item", params.Item.Currency);
                                    console.error("Error JSON:", JSON.stringify(err));
                                } else {
                                    console.log("Details added to table:", params.Item);
                                }
                            });
                        });

                    }

                });
            } catch (error) {
                console.log("Error: " + JSON.stringify(error));
            }
        }
    }

//Call function to get historical data
    getHistoricalData();

}
