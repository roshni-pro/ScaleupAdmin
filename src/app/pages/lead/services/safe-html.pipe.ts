import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHTML'
})
export class SafeHTMLPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any) {
    let val = this.sanitizer.bypassSecurityTrustHtml(value);
    return val;
  }

}

@Pipe({
  name: 'safeURL'
})
export class SafeURLPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any) {
    let val = this.sanitizer.bypassSecurityTrustUrl(value);
    return val;
  }

}

@Pipe({
  name: 'safeCSS'
})
export class SafeCSSPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any) {
    let val = this.sanitizer.bypassSecurityTrustStyle(value);
    return val;
  }

}

@Pipe({
  name: 'safeScript'
})
export class SafeScriptPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any) {
    let val = this.sanitizer.bypassSecurityTrustScript(value);
    return val;
  }

}

@Pipe({
  name: 'safeRecourceURL'
})
export class SafeRecourceURLPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any) {
    let val = this.sanitizer.bypassSecurityTrustResourceUrl(value);
    return val;
  }

}