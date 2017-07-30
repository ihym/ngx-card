import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CardModule} from 'ngx-card/ngx-card';

import {AppComp} from './app';

@NgModule({
  imports: [
    BrowserModule,
    CardModule,
  ],
  declarations: [
    AppComp,
  ],
  bootstrap: [AppComp],
})
export class CardDemoModule {}
