let AWS = require("aws-sdk"); //import aws sdk
let ws = require('websocket'); //import websocket file
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' }); //Import dynamoDB


let domainName = "14817e7iv6.execute-api.us-east-1.amazonaws.com";
let stage = "prod";


let params = {
    TableName: 'crypto_data',
    IndexName: 'Currency-PriceTimeStamp-index',
    KeyConditionExpression: 'primeTimeStamp= :primeTimeStamp',
    ScanIndexForward: false
}

let paramsPredictions = {
    TableName: 'Numerical_Data_Predictions',
    ScanIndexForward: false
}
//convert unix price stamp into real time and date
function convert(unix_price_stamp) {
    let xValues = [];
    let currentTimeStamp = unix_price_stamp * 1000;
    let msInADay = 86400 * 1000;
    for (let index = 0; index < 50; index++) {
        const date = new Date(currentTimeStamp);
        xValues[index] = date;
        currentTimeStamp += msInADay;
    }
    console.log(xValues);
}

exports.handler = async (event) => {

    try {
        let connectionId = event.requestContext.connectionId;
        let lines = [];

        let xValues = [];

        let yValuesZEC = [];
        let yValuesBTC = [];
        let yValuesETH = [];
        let yValuesBNB = [];
        let yValuesBCH = [];

        let cryptoData = await dynamoDB.scan(params).promise();
        let count = 0;
        let timeStamps = Math.ceil(cryptoData.Items.length / 5);

        cryptoData.Items.forEach(function(crypto) {

            if (count < timeStamps) {
                let dateInSeconds = crypto.PriceTimeStamp;
                let date = new Date(dateInSeconds * 1000);
                let splitDate = date.toISOString().split('T');
                let time = splitDate[1].split('.')[0];
                let dateString = splitDate[0] + " " + time;
                xValues.push(dateString);
                count++;
            }
            let currency = crypto.Currency;
            if (currency.includes("BTC"))
                yValuesBTC.push(crypto.Price);
            else if (currency.includes("ZEC"))
                yValuesZEC.push(crypto.Price);
            else if (currency.includes("ETH"))
                yValuesETH.push(crypto.Price);
            else if (currency.includes("BNB"))
                yValuesBNB.push(crypto.Price);
            else if (currency.includes("BCH"))
                yValuesBCH.push(crypto.Price)
        });


        let btcLine = {
            x: xValues,
            y: yValuesBTC,
            name: 'BITCOIN',
            mode: 'lines',
            type: 'numerical'
        };

        let zecLine = {
            x: xValues,
            y: yValuesZEC,
            name: 'ZCASH',
            mode: 'lines',
            type: 'numerical'

        };

        let ethLine = {
            x: xValues,
            y: yValuesETH,
            name: 'ETHEREUM',
            mode: 'lines',
            type: 'numerical'
        };

        let bnbLine = {
            x: xValues,
            y: yValuesBNB,
            name: 'BINANCE',
            mode: 'lines',
            type: 'numerical'
        };

        let bchLine = {
            x: xValues,
            y: yValuesBCH,
            name: 'BITCOIN CASH',
            mode: 'lines',
            type: 'numerical'
        };
        lines.push(btcLine);
        lines.push(zecLine);
        lines.push(ethLine);
        lines.push(bnbLine);
        lines.push(bchLine);


        let xValuesPredictions = [];
        let startTimeInSeconds = cryptoData.Items[0].PriceTimeStamp;
        let endTimeInSeconds = cryptoData.Items[cryptoData.Items.length - 1].PriceTimeStamp;
        let cryptoDataPredictions = await dynamoDB.scan(paramsPredictions).promise();
        // let timeStampsPredictions = cryptoDataPredictions.Items[1].Mean.length;


        let currentEndTime = endTimeInSeconds;
        for (let index = 0; index < 50; index++) {
            let dateAndTime = convertSecondsToDateAndTime(currentEndTime);
            xValuesPredictions[index] = dateAndTime;
            currentEndTime = currentEndTime + 86400;
        }
        cryptoDataPredictions.Items.forEach(function(predict) {
            let currency = predict.Currency;
            if (currency.includes("BTC")) {
                let btcMean = predict.Mean;
                let btcMeanArray = convertStringToNumbersArray(btcMean);
                let btcLowerQuantile = predict.LowerQuantiles;
                let btcLowerQuantileArray = convertStringToNumbersArray(btcLowerQuantile);
                let btcUpperQuantile = predict.UpperQuantiles;
                let btcUpperQuantileArray = convertStringToNumbersArray(btcUpperQuantile);
                let btcSamples = predict.Samples;
                let btcSamplesArray = convertStringToNumbersArray(btcSamples);


                let btcPredictionsMeanLine = {
                    x: xValuesPredictions,
                    y: btcMeanArray,
                    mode: 'lines',
                    name: 'BITCOIN MEAN',
                    type: 'numerical'

                }
                let btcPredictionsLowerQuantileLine = {
                    x: xValuesPredictions,
                    y: btcLowerQuantileArray,
                    mode: 'lines',
                    name: 'BITCOIN LOWER-QUANTILE',
                    type: 'numerical'
                }

                let btcPredictionsUpperQuantileLine = {
                    x: xValuesPredictions,
                    y: btcUpperQuantileArray,
                    mode: 'lines',
                    name: 'BITCOIN UPPER-QUANTILE',
                    type: 'numerical'
                }

                let btcPredictionsSamplesLine = {
                    x: xValuesPredictions,
                    y: btcSamplesArray,
                    mode: 'lines',
                    name: 'BITCOIN SAMPLES',
                    type: 'numerical'
                }

                lines.push(btcPredictionsMeanLine);
                lines.push(btcPredictionsLowerQuantileLine);
                lines.push(btcPredictionsUpperQuantileLine);
                lines.push(btcPredictionsSamplesLine);
            }

            if (currency.includes("ZEC")) {
                let zecMean = predict.Mean;
                let zecMeanArray = convertStringToNumbersArray(zecMean);
                let zecLowerQuantile = predict.LowerQuantiles;
                let zecLowerQuantileArray = convertStringToNumbersArray(zecLowerQuantile);
                let zecUpperQuantile = predict.UpperQuantiles;
                let zecUpperQuantileArray = convertStringToNumbersArray(zecUpperQuantile);
                let zecSamples = predict.Samples;
                let zecSamplesArray = convertStringToNumbersArray(zecSamples);


                let zecPredictionsMeanLine = {
                    x: xValuesPredictions,
                    y: zecMeanArray,
                    mode: 'lines',
                    name: 'ZCASH MEAN',
                    type: 'numerical'

                }
                let zecPredictionsLowerQuantileLine = {
                    x: xValuesPredictions,
                    y: zecLowerQuantileArray,
                    mode: 'lines',
                    name: 'ZCASH LOWER-QUANTILE',
                    type: 'numerical'
                }

                let zecPredictionsUpperQuantileLine = {
                    x: xValuesPredictions,
                    y: zecUpperQuantileArray,
                    mode: 'lines',
                    name: 'ZCASH UPPER-QUANTILE',
                    type: 'numerical'
                }

                let zecPredictionsSamplesLine = {
                    x: xValuesPredictions,
                    y: zecSamplesArray,
                    mode: 'lines',
                    name: 'ZCASH SAMPLES',
                    type: 'numerical'
                }

                lines.push(zecPredictionsMeanLine);
                lines.push(zecPredictionsLowerQuantileLine);
                lines.push(zecPredictionsUpperQuantileLine);
                lines.push(zecPredictionsSamplesLine);
            }
            if (currency.includes("ETH")) {
                let ethMean = predict.Mean;
                let ethMeanArray = convertStringToNumbersArray(ethMean);
                let ethLowerQuantile = predict.LowerQuantiles;
                let ethLowerQuantileArray = convertStringToNumbersArray(ethLowerQuantile);
                let ethUpperQuantile = predict.UpperQuantiles;
                let ethUpperQuantileArray = convertStringToNumbersArray(ethUpperQuantile);
                let ethSamples = predict.Samples;
                let ethSamplesArray = convertStringToNumbersArray(ethSamples);


                let ethPredictionsMeanLine = {
                    x: xValuesPredictions,
                    y: ethMeanArray,
                    mode: 'lines',
                    name: 'ETHEREUM MEAN',
                    type: 'numerical'

                }
                let ethPredictionsLowerQuantileLine = {
                    x: xValuesPredictions,
                    y: ethLowerQuantileArray,
                    mode: 'lines',
                    name: 'ETHEREUM LOWER-QUANTILE',
                    type: 'numerical'
                }

                let ethPredictionsUpperQuantileLine = {
                    x: xValuesPredictions,
                    y: ethUpperQuantileArray,
                    mode: 'lines',
                    name: 'ETHEREUM UPPER-QUANTILE',
                    type: 'numerical'
                }

                let ethPredictionsSamplesLine = {
                    x: xValuesPredictions,
                    y: ethSamplesArray,
                    mode: 'lines',
                    name: 'ETHEREUM SAMPLES',
                    type: 'numerical'
                }

                lines.push(ethPredictionsMeanLine);
                lines.push(ethPredictionsLowerQuantileLine);
                lines.push(ethPredictionsUpperQuantileLine);
                lines.push(ethPredictionsSamplesLine);
            }

            if (currency.includes("BNB")) {
                let bnbMean = predict.Mean;
                let bnbMeanArray = convertStringToNumbersArray(bnbMean);
                let bnbLowerQuantile = predict.LowerQuantiles;
                let bnbLowerQuantileArray = convertStringToNumbersArray(bnbLowerQuantile);
                let bnbUpperQuantile = predict.UpperQuantiles;
                let bnbUpperQuantileArray = convertStringToNumbersArray(bnbUpperQuantile);
                let bnbSamples = predict.Samples;
                let bnbSamplesArray = convertStringToNumbersArray(bnbSamples);


                let bnbPredictionsMeanLine = {
                    x: xValuesPredictions,
                    y: bnbMeanArray,
                    mode: 'lines',
                    name: 'BINANCE MEAN',
                    type: 'numerical'

                }
                let bnbPredictionsLowerQuantileLine = {
                    x: xValuesPredictions,
                    y: bnbLowerQuantileArray,
                    mode: 'lines',
                    name: 'BINANCE LOWER-QUANTILE',
                    type: 'numerical'
                }

                let bnbPredictionsUpperQuantileLine = {
                    x: xValuesPredictions,
                    y: bnbUpperQuantileArray,
                    mode: 'lines',
                    name: 'BINANCE UPPER-QUANTILE',
                    type: 'numerical'
                }

                let bnbPredictionsSamplesLine = {
                    x: xValuesPredictions,
                    y: bnbSamplesArray,
                    mode: 'lines',
                    name: 'BINANCE SAMPLES',
                    type: 'numerical'
                }

                lines.push(bnbPredictionsMeanLine);
                lines.push(bnbPredictionsLowerQuantileLine);
                lines.push(bnbPredictionsUpperQuantileLine);
                lines.push(bnbPredictionsSamplesLine);
            }

            if (currency.includes("BCH")) {
                let bchMean = predict.Mean;
                let bchMeanArray = convertStringToNumbersArray(bchMean);
                let bchLowerQuantile = predict.LowerQuantiles;
                let bchLowerQuantileArray = convertStringToNumbersArray(bchLowerQuantile);
                let bchUpperQuantile = predict.UpperQuantiles;
                let bchUpperQuantileArray = convertStringToNumbersArray(bchUpperQuantile);
                let bchSamples = predict.Samples;
                let bchSamplesArray = convertStringToNumbersArray(bchSamples);


                let bchPredictionsMeanLine = {
                    x: xValuesPredictions,
                    y: bchMeanArray,
                    mode: 'lines',
                    name: 'BITCOIN CASH MEAN',
                    type: 'numerical'

                }
                let bchPredictionsLowerQuantileLine = {
                    x: xValuesPredictions,
                    y: bchLowerQuantileArray,
                    mode: 'lines',
                    name: 'BITCOIN CASH LOWER-QUANTILE',
                    type: 'numerical'
                }

                let bchPredictionsUpperQuantileLine = {
                    x: xValuesPredictions,
                    y: bchUpperQuantileArray,
                    mode: 'lines',
                    name: 'BITCOIN CASH UPPER-QUANTILE',
                    type: 'numerical'
                }

                let bchPredictionsSamplesLine = {
                    x: xValuesPredictions,
                    y: bchSamplesArray,
                    mode: 'lines',
                    name: 'BITCOIN CASH SAMPLES',
                    type: 'numerical'
                }

                lines.push(bchPredictionsMeanLine);
                lines.push(bchPredictionsLowerQuantileLine);
                lines.push(bchPredictionsUpperQuantileLine);
                lines.push(bchPredictionsSamplesLine);
            }


        });


        let msg = {
            data: lines,
            type: 'numerical'
        }



        let msgString = JSON.stringify(msg);

        // Get promises to send messages to connected clients
        let sendMsgPromises = await ws.getSendMessagePromises(msgString, domainName, stage, connectionId);
        // Execute promises
        await Promise.all(sendMsgPromises);
    }
    catch (error) {
        console.log("ERROR " + JSON.stringify(error));
    }

    let response = {
        statusCode: 200,
        body: "Data Sent Successfully",
        isBase64Encoded: false
    }
    return response;
};

function convertStringToNumbersArray(dataString) {
    dataString = dataString.replace('[', '');
    dataString = dataString.replace(']', '');
    let splitData = dataString.split(',');

    let dataToNumbers = [];

    for (let splitDataIndex = 0; splitDataIndex < splitData.length; splitDataIndex++) {
        let data = splitData[splitDataIndex];
        dataToNumbers[splitDataIndex] = parseFloat(data);
    }
    return dataToNumbers;
}

//    assigns seconds and date
function convertSecondsToDateAndTime(secondsSinceEpoch) {
    let date = new Date(secondsSinceEpoch * 1000).toISOString().split('T');
    return date[0] + " " + ""; // to beginning of day
}


