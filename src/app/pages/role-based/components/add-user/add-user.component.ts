import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { LoaderService } from 'app/shared/services/loader.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { UserMasterService } from '../../services/user-master.service';
import { RolePagePermissionsService } from '../../services/role-page-permissions.service';
import { ToasterMessageService } from 'app/shared/services/toaster-message.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent {

  userTypeDropdown = [
    { label: 'ScaleUp User', value: 'AdminUser' },
    { label: 'Company User', value: 'CompanyUser' },
  ]

  saveNewUser: saveNewUser = {
    UserType: [],
    UserName: '',
    Password: '',
    MobileNo: '',
    EmailId: '',
    CompanyIds: [],
    Claims: [],
    UserRoles: []
  }

  PostData: any;
  Companies: any;
  Roles: any;
  submitted = false;
  Id: any;
  selectedCompany: any;
  PhoneNumber: any;
  roless: any;
  Loader: boolean = false;

  constructor(
    private service: UserMasterService,
    private loader: LoaderService,
    private activatedRoute: ActivatedRoute,
    private rolePService: RolePagePermissionsService,
    private Router: Router,
    private tosterService: ToasterMessageService
  ) {
    var emailRegex = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,3}';
    this.PostData = new FormGroup({
      UserName: new FormControl('', [Validators.required]),
      PasswordHash: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        this.customPasswordValidator,
      ]),
      PhoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
        Validators.maxLength(10),
      ]),
      Email: new FormControl('', [Validators.required, Validators.pattern(emailRegex)]),
      CompanyId: new FormControl('', [Validators.required]),
      UserType: new FormControl('', [Validators.required]),
      UserRoles: new FormControl([], [Validators.required]),
    });
  }



  omit_special_char(event: any) {
    // debugger
    var k;
    k = event.charCode; //         k = event.keyCode;  (Both can be used)
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      k == 46 ||
      (k >= 48 && k <= 57)
    );
  }

  keyPress(event: any) {
    const pattern = /^[6-9][0-9]*$/;
    const inputChar = String.fromCharCode(event.charCode);
    // Allow backspace for navigation and correction
    if (event.keyCode === 8) {
      return;
    }
    // Prevent leading zeros
    if (this.PostData.controls.PhoneNumber.value && this.PostData.controls.PhoneNumber.value.length === 0 && inputChar === '0') {
      event.preventDefault();
      return;
    }
    // Allow any digit after the first  digits
    if (this.PostData.controls.PhoneNumber.value && this.PostData.controls.PhoneNumber.value.length >= 1) {
      return;
    }
    // Validate character based on the initial pattern
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  space(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }

  customPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value;
    // Check if the password contains at least one capital letter, one numeral, and one special character
    const capitalLetterRegex = /[A-Z]/;
    const numeralRegex = /\d/;
    const specialCharacterRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
    const hasCapitalLetter = capitalLetterRegex.test(value);
    const hasNumeral = numeralRegex.test(value);
    const hasSpecialCharacter = specialCharacterRegex.test(value);
    // If all conditions are met, return null (valid), otherwise, return an error object
    return hasCapitalLetter && hasNumeral && hasSpecialCharacter
      ? null
      : { passwordRequirements: true };
  }

  onClickBackBtn() {
    this.Router.navigateByUrl('pages/permission/user-master');
  }

  pageName: any;
  Userdata: any;
  userType: any;
  async ngOnInit() {
    // debugger;
    this.userType = localStorage.getItem("usertype");
    console.log(this.userType);

    this.getcompanyDropdown();
    await this.getRolesDropdown();
    this.Id = this.activatedRoute.snapshot.paramMap.get('Id');
    if (this.Id == 0) {
      this.pageName = 'Add New';
      if (this.userType == 'CompanyUser') {
        this.PostData.controls['UserType'].patchValue("CompanyUser");
        this.PostData.controls['UserType'].disable();
      }
    } else {
      this.pageName = 'Edit';
      this.GetUserById();
    }
    // this.clear();


  }


  selectedCompanies: any[] = [];
  GetUserById() {
    this.Loader = true;
    this.service.GetUserById(this.Id).subscribe((res: any) => {
      this.Loader = false;
      console.log("User Details", res);

      if (res.status) {
        this.PostData.controls['UserName'].patchValue(res.name);
        this.PostData.controls['UserName'].disable();

        this.PostData.controls['PhoneNumber'].patchValue(res.mobileNo);
        this.PostData.controls['Email'].patchValue(res.email);

        this.PostData.controls['UserType'].patchValue(res.userType);
        if (this.userType != 'superadmin') {
          // this.PostData.controls['UserType'].patchValue("CompanyUser");
          this.PostData.controls['UserType'].disable();
        }
        debugger
        if (res.userType == 'AdminUser') {
          this.PostData.controls['UserRoles'].patchValue(res.roles)
          if (res.companyIds && res.companyIds.length > 0) {
            let obj: any = [];
            this.Companies.forEach((e: any) => {
              res.companyIds.forEach((i: any) => {
                if (e.id == i) obj.push(e.id);
              });
            });
            this.PostData.controls['CompanyId'].patchValue(obj);
            // this.selectedCompanies = res.companyIds;
          } else {
            this.PostData.controls['CompanyId'].patchValue('');
          }
        } else {
          if (res.companyIds && res.companyIds.length > 0) {
            this.PostData.controls['CompanyId'].patchValue(res.companyIds[0]);
          }
          else {
            this.PostData.controls['CompanyId'].patchValue('');
          }
          // let role = this.Roles.filter((x: any) => x.name.toLowerCase() == "companyadmin")[0];
          this.PostData.controls['UserRoles'].patchValue(res.roles);
          // this.PostData.controls['UserRoles'].disable();
        }

        //this.PostData.controls['UserRoles'].patchValue(res.roles)
        this.roless = res.roles;

        console.log(this.PostData);
        // this.getRolesDropdown();
      }
    });
  }

  clear() {
    this.PostData.reset();
    this.submitted = false;
  }

  roleIdsArray() {
    let roleIds: any = [];
    this.PostData.controls['UserRoles'].enable();

    if (this.PostData.value.UserRoles && this.PostData.value.UserRoles.length > 0) {
      this.PostData.value.UserRoles.forEach((e: any) => {
        roleIds.push(e);
      });
      // this.PostData.controls['UserRoles'].disable();
    }

    return roleIds;
  }

  onSave() {
    debugger;
    console.log(this.PostData.value);

    // let compId = this.PostData.controls.CompanyId.value;
    // let usrTyp = this.PostData.controls.UserType.value;

    this.PostData.controls['CompanyId'].enable();
    this.PostData.controls['UserType'].enable();

    this.submitted = true;

    let roleIds: any = this.roleIdsArray();

    if (this.Id == 0) {
      if (this.PostData.status == 'VALID') {


        this.saveNewUser = {
          UserType: this.PostData.value.UserType,
          UserName: this.PostData.value.UserName,
          Password: this.PostData.value.PasswordHash,
          MobileNo: this.PostData.value.PhoneNumber,
          EmailId: this.PostData.value.Email,
          CompanyIds: this.PostData.value.UserType == 'AdminUser' ? this.PostData.value.CompanyId : [this.PostData.value.CompanyId],
          Claims: [],
          UserRoles: roleIds
        }
        console.log(this.saveNewUser);

        this.PostData.controls['CompanyId'].disable();
        this.PostData.controls['UserType'].disable();

        this.Loader = true;
        this.service.CreateUser(this.saveNewUser).subscribe((res: any) => {
          this.Loader = false;
          if (res.status == true) {
            alert(res.message);
            // this.tosterService.showSuccess(res.Message);
            this.clear();
            this.Router.navigateByUrl('pages/permission/user-master/' + 0);
          } else {
            alert(res.message);
            this.tosterService.showError(res.Message);
            if (this.userType != 'CompanyUser') {
              this.PostData.controls['CompanyId'].enable();
              this.PostData.controls['UserType'].enable();
            }
          }
        });
      }
    }
    else {
      this.PostData.controls.PasswordHash.status = "VALID";
      this.PostData.controls['UserName'].enable()
      if (this.PostData.status == 'VALID') {
        this.PostData.controls['UserRoles'].enable()
        var UpdateUserReqDTO = {
          Id: this.Id,
          MobileNo: this.PostData.value.PhoneNumber,
          Email: this.PostData.value.Email,
          Roles: roleIds,
          CompanyIds: this.PostData.value.UserType == 'AdminUser' ? this.PostData.value.CompanyId : [this.PostData.value.CompanyId],
          UserType: this.PostData.value.UserType
        };
        this.Loader = true;
        console.log(UpdateUserReqDTO);
        this.PostData.controls['CompanyId'].disable();
        this.PostData.controls['UserType'].disable();
        this.service.UpdateUser(UpdateUserReqDTO).subscribe((res: any) => {
          this.Loader = false;
          if (res.status == true) {
            alert(res.message);
            this.tosterService.showSuccess(res.Message);
            this.clear();
            this.Router.navigateByUrl('pages/permission/user-master/' + 0);
          } else {
            alert(res.message);
            this.tosterService.showError(res.Message);
            if (this.userType != 'CompanyUser') {
              this.PostData.controls['CompanyId'].enable();
              this.PostData.controls['UserType'].enable();
            }
          }
        });
      }
    }
  }

  // getcompanyDropdown() {
  //   this.Loader = true;
  //   this.service.getCompanyDropdown().subscribe((res: any) => {
  //     this.Loader = false;
  //     debugger

  //     if (res.status) {
  //       res.filter((x:any)=>{
  //         x.isDefault=false
  //       })
  //       this.Companies =  res.returnObject;
  //       console.log('city', this.Companies);
  //     }
  //   });
  // }


  getcompanyDropdown() {
    this.Loader = true;
    this.service.getCompanyDropdown().subscribe((res: any) => {
      this.Loader = false;
      debugger;

      if (res.status) {
        // Filter the returnObject array based on the condition
        const filteredCompanies = res.returnObject.filter((company: any) => {
          // Replace 'condition' with your filtering condition
          return company.isDefault == false;
        });

        this.Companies = filteredCompanies;
        if (this.userType == 'CompanyUser') {
          this.PostData.controls['CompanyId'].patchValue(this.Companies[0].id);
          this.PostData.controls['CompanyId'].disable();

        }

        console.log('Filtered companies:', this.Companies);
      }
    });
  }

  async getRolesDropdown() {
    this.Loader = true;
    let res: any = await this.rolePService.getRoleList().toPromise();
    this.Loader = false;
    if (res) {
      if (res.status) {

        // let rolesArr = res.returnObject;
        // if (rolesArr.length > 0) {
        //   this.Roles = rolesArr.filter((x: any) => x.name.toLowerCase() != "companyadmin");
        // }
        this.Roles = res.returnObject;
        console.log('res', this.Roles);
      }
    }
  }
  show: boolean = false;


  password() {
    this.show = !this.show;
  }

  changeUserType() {
    // this.PostData.controls['CompanyId'].patchValue('');
    this.PostData.controls['UserRoles'].enable();

    debugger
    if (this.PostData.value.UserType == 'AdminUser') {
      this.PostData.controls['UserRoles'].patchValue(this.roless);
      let typeOfVar = typeof (this.PostData.value.CompanyId);
      if (this.selectedCompanies.length > 0) {
        this.PostData.controls['CompanyId'].patchValue(this.selectedCompanies);
      } else if (typeOfVar == 'string') {
        let selComp: any[] = [];
        this.Companies.forEach((element: any) => {
          selComp.push(element.id);
        });
        this.PostData.controls['CompanyId'].patchValue(selComp);

        // this.PostData.controls['CompanyId'].patchValue(this.selectedCompanies);
      } else if (typeOfVar == 'number') {
        let entry = [this.PostData.value.CompanyId];
        this.PostData.controls['CompanyId'].patchValue(entry);
      } else if (typeOfVar == 'object') {
        // if (this.PostData.value.CompanyId.length != 0) {
        // }
        let selComp: any[] = [];
        this.Companies.forEach((element: any) => {
          selComp.push(element.id);
        });
        this.PostData.controls['CompanyId'].patchValue(selComp);
      }
    } else {
      // debugger
      // this.PostData.controls['CompanyId'].patchValue(this.companyId);
      // let role = this.Roles.filter((x: any) => x.name.toLowerCase() == "companyadmin")[0];
      // if (role) {
      //   // this.PostData.controls['UserRoles'].patchValue([role.name]);
      //   // this.PostData.controls['UserRoles'].disable();
      // } else {
      //   this.PostData.controls['UserRoles'].patchValue(['']);
      // }
    }
    console.log(this.Companies, this.PostData.value.CompanyId);
  }

}

interface saveNewUser {
  UserType: [],
  UserName: '',
  Password: '',
  MobileNo: '',
  EmailId: '',
  CompanyIds: [],
  Claims: [],
  UserRoles: [],
}
