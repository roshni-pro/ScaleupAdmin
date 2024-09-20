export interface SaveCompanyAndLocationDTO{
    CompanyId:number;
    CompanyType: any,
    GSTNo:any,
    BusinessName:any,
    BusinessContactEmail: any,
    BusinessContactNo:number|any,
    BusinessTypeId:number|any,
    BusinessPanURL:any,
    BusinessPanDocId:number|any,
    IsDefault:boolean,
    GSTDocId:number|any,
    GSTDocumentURL:any,
    MSMEDocId: any,
    MSMEDocumentURL:any,
    CancelChequeDocId:number|any,
    CancelChequeURL:any,
    BankName:any,
    BankAccountNumber:number|any,
    BankIFSC:any,
    ContactPersonName:any,
    isMSME:boolean|string,
    IsSelfConfiguration: boolean
    CompanyAddress :{}
    PartnerList :any
    CompanyStatus :boolean
    AgreementURL:any,
    AgreementStartDate: Date|any,
    AgreementEndDate: Date|any,
      PanNo: any, //anchor
      LandingName: any,//anchor
      APIKey: any,//anchor
      APISecretKey: any,//anchor
      WhitelistURL:any,//anchor
      CustomerAgreementURL: any,//NBFC
        BusinessHelpline:any,
    LogoURL:any,
    AccountType:any,
    AccountHolderName:string,
    BranchName:string,
    FinancialLiaisonDetails:FinancialLiaisonDetails

}

export interface CompanyAddressDTO
{
    //public long CompanyId { get; set; }
    AddressTypeId:number;
    AddressLineOne:any;
    AddressLineTwo:any;
    AddressLineThree:any;
    ZipCode:any;
    CityId:number | null;
    StateId:number | null;
    countryId:number;
}

export interface NBFCProductDTO{
    Id: number,
    CompanyId :number,
    GSTRate: ['',],
    ConvenienceFee: number,
    ProcessingFee:number,
    DelayPenaltyFee: number,
    BounceCharges:number,
    ProcessingCreditDays:number,
    CreditDays:number,
    CompanyCreditDays: [[]],
    ProductId:number,
    ProductName:string,

    InterestRate: number,
    PenaltyCharges:number,
    PlatformFee: number,
    AgreementURL:any,
    AgreementDocId: number,
    AgreementStartDate: any,
    AgreementEndDate: any,
    CustomerAgreementURL: any,
    CustomerAgreementDocId: number,
    ProcessingFeeType: any,
    CustomerAgreementType:any,
    SanctionLetterDocId:number,
    SanctionLetterURL: any,
    IsInterestRateCoSharing: boolean,
    IsPenaltyChargeCoSharing:boolean,
    IsBounceChargeCoSharing: boolean,
    IsPlatformFeeCoSharing: boolean,
}
export interface FinancialLiaisonDetails{
    FinancialLiaisonFirstName:string,
    FinancialLiaisonLastName:string,
    FinancialLiaisonEmailAddress:string,
    FinancialLiaisonContactNo:string,
    // financialLiaisonFirstName :string,
    // financialLiaisonLastName :string,
    // financialLiaisonEmailAddress :string,
    // financialLiaisonContactNo :string,
}

