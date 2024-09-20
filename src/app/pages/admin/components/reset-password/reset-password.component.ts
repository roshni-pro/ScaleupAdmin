import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { LoginService } from '../../../login/services/login.service';
import { LocalStogareService } from 'app/shared/services/local-storage.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  PostData: any;
  ConfirmPassword: string = '';
  NewPassword: string = '';
  oldpassword: string = '';
  submitted = false;
  Msg: string = '';
  Loader: boolean = false;
  constructor(
    private service: LoginService,
    private local: LocalStogareService,
    private router: Router,
    private messageService: MessageService

  ) {

    this.PostData = new FormGroup({
      password: new FormControl('', [Validators.required, this.customPasswordValidator]),
      oldpassword: new FormControl('', Validators.required),
      ConfirmPassword: new FormControl('', Validators.required),

    },
    );

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
  ngOnInit(): void {
    this.clear();
  }
  pwdMatchValidator(frm: FormGroup) {
    return this.PostData.value.password === this.PostData.value.ConfirmPassword
      ? null : { 'mismatch': true };
  }
  ChangePassword() {
    debugger
    this.Msg = "";
    console.log(this.PostData.value);
    this.submitted = true;
    if (this.PostData.value.password != this.PostData.value.ConfirmPassword) {
      this.Msg = 'Doesnt match!'
      return;
    }
    if (this.PostData.invalid) {
      return;
    }
    else {
      debugger
      this.Loader = true;
      let userid = this.local.getItemString('userId');
      this.service.resetPassword(userid, this.PostData.value.oldpassword, this.PostData.value.password).subscribe((res: any) => {
        console.log(res)
        this.Loader = false;
        if (res.status == true) {
          // alert(res.message);
          this.messageService.add({ severity: 'success', summary: res.message });

          localStorage.clear();
          localStorage.removeItem('clUserToken');
          this.router.navigateByUrl('/login')
        }
        else {
          // alert(res.message)
          this.messageService.add({ severity: 'error', summary: res.message});

          this.PostData.reset();
        }
      })
    }
  }
  onKeypressEvent(event: any) {

    console.log(event.target.value);

  }
  clear() {
    this.ConfirmPassword = '';
    this.oldpassword = '';
    this.NewPassword = '';
  }
}
