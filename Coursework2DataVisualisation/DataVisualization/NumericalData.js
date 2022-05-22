//Open connection
let connection = new WebSocket("wss://14817e7iv6.execute-api.us-east-1.amazonaws.com/prod");


//Log connected response
connection.onopen = function (event) {
    console.log("Connected: " + JSON.stringify(event));
    numericalData();//load numerical data
};

//Output messages from the server
connection.onmessage = function (msg) {
    let messageData = msg.data;
    let plotlyData = JSON.parse(messageData); //parse string data

    //BTC BITCOIN
    let bitcoin_actual_data = {
        x: plotlyData.data[0].x,
        y: plotlyData.data[0].y,
        mode: plotlyData.data[0].mode,
        name: plotlyData.data[0].name
    }

    let bitcoin_mean = {
        x: plotlyData.data[21].x,
        y: plotlyData.data[21].y,
        mode: plotlyData.data[21].mode,
        name: plotlyData.data[21].name
    }
    let bitcoin_lowerQuantile = {
        x: plotlyData.data[22].x,
        y: plotlyData.data[22].y,
        mode: plotlyData.data[22].mode,
        name: plotlyData.data[22].name
    }
    let bitcoin_upperQuantile = {
        x: plotlyData.data[23].x,
        y: plotlyData.data[23].y,
        mode: plotlyData.data[23].mode,
        name: plotlyData.data[23].name
    }
    let bitcoin_samples = {
        x: plotlyData.data[24].x,
        y: plotlyData.data[24].y,
        mode: plotlyData.data[24].mode,
        name: plotlyData.data[24].name
    }

    //BNB BINANE COIN
    let binane_actual_data = {
        x: plotlyData.data[3].x,
        y: plotlyData.data[3].y,
        mode: plotlyData.data[3].mode,
        name: plotlyData.data[3].name
    }
    let binane_mean = {
        x: plotlyData.data[5].x,
        y: plotlyData.data[5].y,
        mode: plotlyData.data[5].mode,
        name: plotlyData.data[5].name
    }
    let binane_lowerQuantile = {
        x: plotlyData.data[6].x,
        y: plotlyData.data[6].y,
        mode: plotlyData.data[6].mode,
        name: plotlyData.data[6].name
    }
    let binane_upperQuantile = {
        x: plotlyData.data[7].x,
        y: plotlyData.data[7].y,
        mode: plotlyData.data[7].mode,
        name: plotlyData.data[7].name
    }
    let binane_samples = {
        x: plotlyData.data[8].x,
        y: plotlyData.data[8].y,
        mode: plotlyData.data[8].mode,
        name: plotlyData.data[8].name
    }
    //ETH ETHEREUM
    let ethereum_actual_data = {
        x: plotlyData.data[2].x,
        y: plotlyData.data[2].y,
        mode: plotlyData.data[2].mode,
        name: plotlyData.data[2].name
    }

    let ethereum_Mean = {
        x: plotlyData.data[13].x,
        y: plotlyData.data[13].y,
        mode: plotlyData.data[13].mode,
        name: plotlyData.data[13].name
    }

    let ethereum_lowerQuantile = {
        x: plotlyData.data[14].x,
        y: plotlyData.data[14].y,
        mode: plotlyData.data[14].mode,
        name: plotlyData.data[14].name
    }
    let ethereum_UpperQuantile = {
        x: plotlyData.data[15].x,
        y: plotlyData.data[15].y,
        mode: plotlyData.data[15].mode,
        name: plotlyData.data[15].name
    }
    let ethereum_samples = {
        x: plotlyData.data[16].x,
        y: plotlyData.data[16].y,
        mode: plotlyData.data[16].mode,
        name: plotlyData.data[16].name
    }

    //ZEC ZCash
    let zec_actual_data = {
        x: plotlyData.data[1].x,
        y: plotlyData.data[1].y,
        mode: plotlyData.data[1].mode,
        name: plotlyData.data[1].name
    }
    let zec_Mean = {
        x: plotlyData.data[9].x,
        y: plotlyData.data[9].y,
        mode: plotlyData.data[9].mode,
        name: plotlyData.data[9].name
    }
    let zec_lowerQuantile = {
        x: plotlyData.data[10].x,
        y: plotlyData.data[10].y,
        mode: plotlyData.data[10].mode,
        name: plotlyData.data[10].name
    }
    let zec_UpperQuantile = {
        x: plotlyData.data[11].x,
        y: plotlyData.data[11].y,
        mode: plotlyData.data[11].mode,
        name: plotlyData.data[11].name
    }
    let zec_samples = {
        x: plotlyData.data[12].x,
        y: plotlyData.data[12].y,
        mode: plotlyData.data[12].mode,
        name: plotlyData.data[12].name
    }

    //BCH BITCOIN CASH
    let bch_actual_data = {
        x: plotlyData.data[4].x,
        y: plotlyData.data[4].y,
        mode: plotlyData.data[4].mode,
        name: plotlyData.data[4].name
    }
    let bch_Mean = {
        x: plotlyData.data[17].x,
        y: plotlyData.data[17].y,
        mode: plotlyData.data[17].mode,
        name: plotlyData.data[17].name
    }
    let bch_lowerQuantile = {
        x: plotlyData.data[18].x,
        y: plotlyData.data[18].y,
        mode: plotlyData.data[18].mode,
        name: plotlyData.data[18].name
    }
    let bch_upperQuantile = {
        x: plotlyData.data[19].x,
        y: plotlyData.data[19].y,
        mode: plotlyData.data[19].mode,
        name: plotlyData.data[19].name
    }
    let bch_samples = {
        x: plotlyData.data[20].x,
        y: plotlyData.data[20].y,
        mode: plotlyData.data[20].mode,
        name: plotlyData.data[20].name
    }

//layouts to plot the graphs
    let layout = {
        title: 'Crypto Currency',
        yaxis: {
            type: 'log',
            autorange: true
        }
    }
    let layoutbtc = {
        title: 'BITCOIN',
        yaxis: {
            type: 'log',
            autorange: true
        }
    }
    let layoutBNB = {
        title: 'BINANE',
        yaxis: {
            type: 'log',
            autorange: true
        }
    }
    let layoutETH = {
        title: 'ETHEREUM',
        yaxis: {
            type: 'log',
            autorange: true
        }
    }
    let layoutZEC = {
        title: 'ZCASH',
        yaxis: {
            type: 'log',
            autorange: true
        }
    }
    let layoutBCH = {
        title: 'BITCOIN CASH',
        yaxis: {
            type: 'log',
            autorange: true
        }
    }

    //array to plot all graph
    let currencies = [bitcoin_actual_data, bitcoin_mean, bitcoin_lowerQuantile, bitcoin_upperQuantile, bitcoin_samples, binane_actual_data, binane_mean, binane_lowerQuantile, binane_upperQuantile, binane_samples,
        ethereum_actual_data, ethereum_Mean, ethereum_lowerQuantile, ethereum_UpperQuantile, ethereum_samples, zec_actual_data, zec_Mean, zec_lowerQuantile, zec_UpperQuantile, zec_samples,
        bch_actual_data, bch_Mean, bch_lowerQuantile, bch_upperQuantile, bch_samples

    ];


    //arrays to plot individual graphs
    let btc = [bitcoin_actual_data, bitcoin_mean, bitcoin_lowerQuantile, bitcoin_upperQuantile, bitcoin_samples];
    let bnb = [binane_actual_data, binane_mean, binane_lowerQuantile, binane_upperQuantile, binane_samples];
    let eth = [ethereum_actual_data, ethereum_Mean, ethereum_lowerQuantile, ethereum_UpperQuantile, ethereum_samples];
    let zec = [zec_actual_data, zec_Mean, zec_lowerQuantile, zec_UpperQuantile, zec_samples];
    let bch = [bch_actual_data, bch_Mean, bch_lowerQuantile, bch_upperQuantile, bch_samples];


    //send the arrays and layouts to plotly
    Plotly.react('CryptoAllData', currencies, layout);
    Plotly.react('btc', btc, layoutbtc);
    Plotly.react('bnb', bnb, layoutBNB);
    Plotly.react('eth', eth, layoutETH);
    Plotly.react('zec', zec, layoutZEC);
    Plotly.react('bch', bch, layoutBCH);

}

//Log errors
connection.onerror = function (error) {
    console.log("WebSocket Error: " + JSON.stringify(error));
}

//Send message to server
function numericalData() {
    //Create message to be sent to server
    let msgObject = {
        action: "numericalData",//Used for routing in API Gateway
        data: ""
    };

    //Send message
    connection.send(JSON.stringify(msgObject));

    //Log result
    console.log("Message sent: " + JSON.stringify(msgObject));
}