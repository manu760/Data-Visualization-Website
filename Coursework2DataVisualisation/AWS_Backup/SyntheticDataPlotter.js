//Axios will handle HTTP requests to web service
const axios = require('axios');

//aws-sdk will be used to get DynamoDB
let AWS = require("aws-sdk");

// The database and table are 'in us-east-1'
const documentClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

//The ID of the student's data that I will download
let studentID = 'M00735429';

//URL where student data is available
let url = 'https://kdnuy5xec7.execute-api.us-east-1.amazonaws.com/prod/';

//Authentication details for Plotly
const PLOTLY_USERNAME = 'manubasra96';
const PLOTLY_KEY = 'lWBiO9n9ap7uG2BCoVSg';

//Initialize Plotly with user details.
let plotly = require('plotly')(PLOTLY_USERNAME, PLOTLY_KEY);

//parameters to read predictions
let params = {
    TableName: 'SyntheticDataPredictions', //table name
    ScanIndexForward: false
}

exports.handler = async (event) => {
    try {
        //Get synthetic data
        let yValues = (await axios.get(url + studentID)).data.target;

        //Add basic X values for plot
        let xValues = [];
        for (let i = 0; i < yValues.length; ++i) {
            xValues.push(i);
        }

        let values = [];
        let data = await documentClient.scan(params).promise();
        let items = data.Items[0];
        let predictiontime = [];

        let mean = items.Mean;//read mean values from dynamoDB table
        let meanArray = Array.from(mean.split(','), Number);//convert mean string to number array
        let index = xValues[xValues.length - 1];
        for (let timeIndex = 0; timeIndex < meanArray.length; timeIndex++)
            predictiontime[timeIndex] = index++;


        let lowerQuantile = items.LowerQuantiles;//read lower quantile values from dynamoDB table
        let lowerQuantileArray = Array.from(lowerQuantile.split(','), Number);//convert mean string to number array

        let upperQuantile = items.UpperQuantiles;//read upper quantile values from dynamoDB table
        let upperQuantileArray = Array.from(upperQuantile.split(','), Number);//convert mean string to number array


        let sample = items.Samples;//read samples values from dynamoDB table
        let sampleArray = Array.from(sample.split(','), Number);//convert mean string to number array


        //array of data with x and y values where x is time and y is data values
        //real data line
        let syntheticDataLine = {
            x: xValues,
            y: yValues,
            mode: 'lines',
            name: 'Synthetic Data Line'
        }

        //mean array line
        let meanLine = {
            x: predictiontime,
            y: meanArray,
            mode: 'lines',
            name: 'Mean'
        }

        //lower quantile array line
        let lowerQuantileLine = {
            x: predictiontime,
            y: lowerQuantileArray,
            mode: 'lines',
            name: 'Lower Quantile'
        }

        //upper quantile array line
        let upperQuantileLine = {
            x: predictiontime,
            y: upperQuantileArray,
            mode: 'lines',
            name: 'Upper Quantile'
        }

        //sample array line
        let sampleLine = {
            x: predictiontime,
            y: sampleArray,
            mode: 'lines',
            name: 'Sample'
        }

        //push values into one array
        values.push(syntheticDataLine);
        values.push(meanLine);
        values.push(lowerQuantileLine);
        values.push(upperQuantileLine);
        values.push(sampleLine);

        //Call function to plot data
        let plotResult = await plotData(studentID, values);
        console.log("Plot for student '" + studentID + "' available at: " + plotResult.url);

        return {
            statusCode: 200,
            body: "Ok"
        };
    } catch (err) {
        console.log("ERROR: " + JSON.stringify(err));
        return {
            statusCode: 500,
            body: "Error plotting data for student ID: " + studentID
        };
    }
};

//Plots the specified data
async function plotData(studentID, lines) {
    //layout for plotly graph
    let layout = {
        title: "Synthetic Data",
        font: {
            size: 25
        },
        xaxis: {
            title: 'Time (hours)'
        },
        yaxis: {
            title: 'Value'
        }
    };
    let graphOptions = {
        layout: layout,
        filename: "date-axes",
        fileopt: "overwrite"
    };
    //return promise
    return new Promise((resolve, reject) => {
        plotly.plot(lines, graphOptions, function (err, msg) {
            if (err)
                reject(err);
            else {
                resolve(msg);
            }
        });
    });
};
