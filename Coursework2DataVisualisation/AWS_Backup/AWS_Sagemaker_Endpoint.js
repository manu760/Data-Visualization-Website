//Import AWS
let AWS = require("aws-sdk");
let documentClient = new AWS.DynamoDB.DocumentClient();


//ADD YOUR OWN AUTHENTICATION DETAILS
const PLOTLY_USERNAME = 'manubasra96';
const PLOTLY_KEY = 'lWBiO9n9ap7uG2BCoVSg';

//Initialize Plotly with user details.
let plotly = require('plotly')(PLOTLY_USERNAME, PLOTLY_KEY);

//Data that we are going to send to endpoint
//REPLACE THIS WITH YOUR OWN DATA!
let endpointData = {
    "instances": [{
        "start": "2019-04-03 05:00:00",
        "target": [159.6183161081236, 169.15140197906751, 164.97566787352338, 173.70923154218374, 172.74851887088548, 164.78680192924037, 170.72448207444486, 173.53460822719413, 172.1341788636259, 168.13088301217533, 159.96856153945717, 153.83493004184976, 152.2900846090811, 149.42487439796352, 146.45289603470033, 150.69903587014596, 148.32329419897766, 148.12378857839366, 152.86744606283224, 155.8351419709553, 159.67892511117142, 154.0660536539677, 151.84921304735172, 165.05785840893336, 160.7183922454808, 168.240721565793, 168.9639281720324, 171.80983226167294, 177.8350626410182, 180.88086176579748, 173.50073989431266, 172.6521546073041, 172.0753171307376, 164.06684127403972, 160.03071314825323, 165.3540959784993, 164.59915373436155, 155.9350251415355, 153.24058228105946, 165.0525713906133, 153.1332273470356, 163.8607508356046, 156.13393075377599, 160.5268997886328, 153.93080324808886, 169.86865335778813, 165.26860832194632, 173.62237055663866, 177.99541204325294, 167.38858566100646, 172.24110261292446, 180.12306168938505, 184.86330780700314, 185.99140068472212, 174.95574255122364, 189.12063534922447, 184.5466258019787, 170.10532019436107, 172.31157276614005, 177.9999302916986, 167.02900039209806, 172.02212526820676, 162.75410486710268, 171.621119100208, 163.27770795964273, 160.9657450207438, 168.28432859411353, 168.74229927405543, 160.82109000416895, 173.66475761578576, 166.63867099636823, 181.95851774150174, 177.29269433369817, 188.66061290973286, 189.1520330450864, 190.35777316320053, 180.55841595623764, 183.83306163929484, 190.47764749451338, 183.698604231521, 178.48327020264415, 177.54762998387093, 189.56264299755443, 179.17998119441614, 180.48379982352407, 167.9549580249409, 169.28813423515163, 171.16439906833762, 164.07017416839304, 171.6781537190288, 177.3470020350897, 169.67471036346384, 171.91615776926034, 168.40442566263312, 183.77768354866467, 175.6880281055281, 175.63466441683235, 191.26264485270497, 188.96128602780013, 194.320029804103, 195.55201325401794, 191.22403902030342, 191.9301478410783, 200.80100414072356, 184.5334605182653, 187.67935255481885, 193.68336772571328, 189.36890714297252, 174.61405729588512, 175.95338672268517, 174.65432358161496, 181.74340679748096, 177.67800042757779, 167.2152842079236, 172.66207990877442]
    }],
    "configuration": {
        "num_samples": 50,
        "output_types": ["mean", "quantiles", "samples"],
        "quantiles": ["0.1", "0.9"]
    }
};

//Name of endpoint
const endpointName = "synth-endpoint";

//Parameters for calling endpoint
let params = {
    EndpointName: endpointName,
    Body: JSON.stringify(endpointData),
    ContentType: "application/json",
    Accept: "application/json"
};


//AWS class that will query endpoint
let awsRuntime = new AWS.SageMakerRuntime({});

//Handler for Lambda function
exports.handler = event => {
    //Call endpoint and handle response
    awsRuntime.invokeEndpoint(params, (error, data) => {
        if (error) { //An error occurred
            console.log(error, error.stack);

            //Return error response
            const response = {
                statusCode: 500,
                body: JSON.stringify('ERROR: ' + JSON.stringify(error)),
            };
            return response;
        } else { //Successful response
            //Convert response data to JSON
            let responseData = JSON.parse(Buffer.from(data.Body)).predictions;
            //console.log(JSON.stringify(responseData));

            // console.log(JSON.stringify(endpointData));

            const mean = JSON.stringify(responseData[0]['mean']);
            const lowerQuantiles = JSON.stringify(responseData[0]['quantiles']['0.1']);
            const upperQuantiles = JSON.stringify(responseData[0]['quantiles']['0.9']);
            const samples = JSON.stringify(responseData[0]['samples'][0]);
            console.log(samples);


            //STORE DATA IN PREDICTION TABLE

            let dynamoParams = {
                TableName: "SyntheticDataPredictions",
                Item: {
                    Id: 1,
                    Mean: mean,
                    LowerQuantiles: lowerQuantiles,
                    UpperQuantiles: upperQuantiles,
                    Samples: samples

                }
            }
            let dynamoData = documentClient.put(dynamoParams).promise();
            console.log("DATA added to dynamodb");


            //Return successful response
            const response = {
                statusCode: 200,
                body: JSON.stringify('Predictions stored.'),
            };
            return response;
        }
    });
};
