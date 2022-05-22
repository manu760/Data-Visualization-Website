//Open connection
let connection = new WebSocket("wss://14817e7iv6.execute-api.us-east-1.amazonaws.com/prod");


//Log connected response
connection.onopen = function (event) {
    console.log("Connected: " + JSON.stringify(event));
    updateSentimentAnalysis();//update sentiment analysis to all clients
    sentimentAnalysisTwitterData();//plot sentiment analysis to single client
};

//Output messages from the server
connection.onmessage = function (msg) {
    let messageData = msg.data;//get message from websockets
    let plotlyData = JSON.parse(messageData);

    //Arrays to plot pie charts
    let data = [{
        values: plotlyData[0].data.values,
        labels: plotlyData[0].data.labels,
        type: plotlyData[0].data.type,
        domain: {column: 0},
        name: 'BTC Twitter Sentiment Analysis',
        hoverinfo: 'label+percent+name',
        hole: .4,

    }, {
        values: plotlyData[1].data.values,
        labels: plotlyData[1].data.labels,
        type: plotlyData[1].data.type,
        text: 'BNB',
        textposition: 'inside',
        domain: {column: 1},
        name: 'BNB Twitter Sentiment Analysis',
        hoverinfo: 'label+percent+name',
        hole: .4,
    }, {
        values: plotlyData[2].data.values,
        labels: plotlyData[2].data.labels,
        type: plotlyData[2].data.type,
        text: 'ZEC',
        textposition: 'inside',
        domain: {column: 2},
        name: 'ZEC Twitter Sentiment Analysis',
        hoverinfo: 'label+percent+name',
        hole: .4,
    }];

    //Layouts for pie charts
    let layout = {
        title: 'Twitter Sentiment Analysis Bitcoin, Binane and ZCash',
        annotations: [
            {
                font: {
                    size: 25
                },
                showarrow: false,
                text: 'Bitcoin',
                x: 0.13,
                y: 0.5
            },
            {
                font: {
                    size: 25
                },
                showarrow: false,
                text: 'Binance',
                x: 0.50,
                y: 0.5
            }, {
                font: {
                    size: 25
                },
                showarrow: false,
                text: 'ZCASH',
                x: 0.880,
                y: 0.5
            },
        ],
        height: 1000,
        width: 1800,
        showlegend: false,
        grid: {rows: 1, columns: 3}
    }
    Plotly.react('pieDivBTC', data, layout);//send it to plotly

    let data1 = [{
        values: plotlyData[3].data.values,
        labels: plotlyData[3].data.labels,
        type: plotlyData[3].data.type,
        text: 'ETH',
        textposition: 'inside',
        domain: {column: 0},
        name: 'ETH Twitter Sentiment Analysis',
        hoverinfo: 'label+percent+name',
        hole: .4,
    }, {
        values: plotlyData[4].data.values,
        labels: plotlyData[4].data.labels,
        type: plotlyData[4].data.type,
        text: 'BCH',
        textposition: 'inside',
        domain: {column: 1},
        name: 'BCH Twitter Sentiment Analysis',
        hoverinfo: 'label+percent+name',
        hole: .4,
    }];
    let layout1 = {
        title: 'Twitter Sentiment Analysis Ethereum and Bitcoin Cash',

        annotations: [
            {
                font: {
                    size: 25
                },
                showarrow: false,
                text: 'ETHEREUM',
                x: 0.17,
                y: 0.5
            },
            {
                font: {
                    size: 25
                },
                showarrow: false,
                text: 'Bitcoin Cash',
                x: 0.82,
                y: 0.5
            }
        ],
        height: 1000,
        width: 1300,
        showlegend: false,
        grid: {rows: 1, columns: 2}
    }
    Plotly.react('pieDivETH', data1, layout1);//send data to plotly

}

//Log errors
connection.onerror = function (error) {
    console.log("WebSocket Error: " + JSON.stringify(error));
}

//Send message to server
function sentimentAnalysisTwitterData() {

    //Create message to be sent to server
    let msgObject = {
        action: "sentimentAnalysisTwitterData",//Used for routing in API Gateway
        data: ""
    };

    //Send message
    connection.send(JSON.stringify(msgObject));

    //Log result
    console.log("Message sent: " + JSON.stringify(msgObject));
}

function updateSentimentAnalysis() {
    //Create message to be sent to server
    let msgObject = {
        action: "updateSentimentAnalysis"//Used for routing in API Gateway
    }
    connection.send(JSON.stringify((msgObject)));//send message
    console.log("MESSAGE SENT: " + JSON.stringify(msgObject));//log result

}