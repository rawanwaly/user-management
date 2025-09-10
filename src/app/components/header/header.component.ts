import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  currentLang: 'en' | 'ar' = 'en';

  constructor(private translate: TranslateService) {
    translate.setDefaultLang(this.currentLang);
    translate.use(this.currentLang);
  }

  switchLanguage(lang: 'en' | 'ar') {
    this.currentLang = lang;

    // Change direction
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Apply translation
    this.translate.use(lang);
  }
}
