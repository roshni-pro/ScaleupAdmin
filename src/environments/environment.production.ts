export const environment = {

    production: true,
    // -------- local url start -------------------
    // apiBaseUrl: 'https://localhost:7000/',
    // identityBaseUrl: 'https://localhost:7008/',
    // imageurl:'https://localhost:7009/',
    // -------- local url end -------------------
    
    // -------- dev url start -------------------
    // apiBaseUrl: 'https://gateway-qa.scaleupfin.com/',
    // identityBaseUrl: 'https://identity-qa.scaleupfin.com/',
    // imageurl:'https://media-qa.scaleupfin.com/',
    // -------- dev url end -------------------


    // -------- uat url start -------------------
    // apiBaseUrl: 'https://gateway-uat.scaleupfin.com/',
    // identityBaseUrl: 'https://identity-uat.scaleupfin.com/',
    // imageurl:'https://media-uat.scaleupfin.com/',
    // -------- dev url end -------------------

    
    // -------- prod url start -------------------
    apiBaseUrl: 'https://gateway.scaleupfin.com/',
    identityBaseUrl: 'https://identity.scaleupfin.com/',
    imageurl:'https://media.scaleupfin.com/',
    saralUrl: 'https://internal.er15.xyz/',
    // -------- prod url end ------------------- 
    

    // ------------common ------------------------
    companygateway:"services/company/v1/",
    prodgateway:"services/product/v1/",
    locationgateway:"services/location/v1/",
    aggregator:"aggregator/",
    leadgateway:"services/lead/v1/",
    kycgateway:"services/kyc/v1/",
    Communicationgateway:"services/communication/v1/",
    Identitygateway:"services/identity/v1/",
    Mediagateway:"services/media/v1/",
    Nbfcgateway:"services/nbfc/v1",
    loanaccountgateway:"services/loanaccount/v1",

};
