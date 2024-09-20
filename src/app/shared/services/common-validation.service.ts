import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CommonValidationService {

    constructor() { }

    space(event: any): boolean {
        if (event.target.selectionStart === 0 && event.code === "Space") {
            event.preventDefault();
            return true
        }
        else
            return false
    }
    numberOnly(e: any) {  // Accept only alpha numerics, not special characters 
        var regex = new RegExp("^[a-zA-Z ]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        }

        e.preventDefault();
        return false;
    }
    omit_special_char(event: any): boolean {
        var k;
        k = event.charCode; //         k = event.keyCode;  (Both can be used)
        return (
            (k > 64 && k < 91) ||
            (k > 96 && k < 123) ||
            k == 8 ||
            k == 32 ||
            k == 46 ||
            (k >= 48 && k <= 57)
        )

    }
    // onPaste(e: any) {
    //   e.preventDefault();
    //   return false;
    // }

    AlphabetNumberOnly(e: any): boolean {  // Accept only alpha numerics, not special characters 
        var regex = new RegExp("^[a-zA-Z0-9 ]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        }
        e.preventDefault();
        return false;
    }
    allowSpecialSymbolsAndAlphabets(event: KeyboardEvent): boolean {
        const charCode = event.charCode;
        // Allow all characters except numbers (char codes for '0' to '9' are 48 to 57)
        if (charCode >= 48 && charCode <= 57) {
            event.preventDefault();
            return false;
        }
        return true;
    }

    restrictPaste(e: any): boolean {
        e.preventDefault();
        return false;
    }

    restrictDot(event: any) {
        var ret = ((event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46);
        event.preventDefault();
        return false;
    }

    keyPress(event: any) {
        const pattern = /[0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
            return false;
        }
        return true;
    }

    keyPressAmount(event: any) {
        // After Decimal Allow only 2 digit

        const reg = /^-?\d*(\.\d{0,2})?$/;
        let input = event.target.value + String.fromCharCode(event.charCode);
        if (!reg.test(input)) {
            event.preventDefault();
            return false;
        }
        return true;
    }

    RestrictCommaSemicolon(e: any) {
        var theEvent = e || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var regex = /[^,'";]+$/;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) {
                theEvent.preventDefault();
            }
        }
    }

    pascalCode(obj: any) {    //for camel casing
        let result: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const pascalCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
                // debugger
                result[pascalCaseKey] = obj[key];
            }
        }
        return result;
    }

    onPaste(e: any) {
        e.preventDefault();
        return false;
    }
    isFirstLetterNotSpace(sentence: string) {
        // Check if the first character is not a space
        return /^\S/.test(sentence);
    }
    onkeypress(event: KeyboardEvent) {
        const charCode = event.which || event.keyCode;
        const charStr = String.fromCharCode(charCode);
        const pattern = /[a-zA-Z\s\-_\.]/; // Regular expression to match alphabets, spaces, hyphens, underscores, and periods

        if (!pattern.test(charStr)) {
            event.preventDefault(); // Prevent the default action if the character is not allowed
        }
    }
}
