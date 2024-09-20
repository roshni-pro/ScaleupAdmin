// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,

    // -------- local url start -------------------
    // apiBaseUrl: 'https://localhost:7000/',
    // identityBaseUrl: 'https://localhost:7008/',
    // imageurl:'https://localhost:7009/',
    // -------- local url end -------------------
    

    // -------- dev url start -------------------
    apiBaseUrl: 'https://gateway-qa.scaleupfin.com/',
    identityBaseUrl: 'https://identity-qa.scaleupfin.com/',
    imageurl:'https://media-qa.scaleupfin.com/',
    saralUrl: 'https://uat.shopkirana.in/',
    // -------- dev url end -------------------
    

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
  