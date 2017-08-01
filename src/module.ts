import {NgModule} from '@angular/core';

import {NgxCardNumberTemplate, NgxCardNameTemplate, NgxCardExpiryTemplate, NgxCardCvcTemplate} from './inputs';
import {NgxCard} from './card';

const CARD_DIRECTIVES = [
	NgxCard,
	NgxCardNumberTemplate,
	NgxCardNameTemplate,
	NgxCardExpiryTemplate,
	NgxCardCvcTemplate,
];

@NgModule({
  declarations: [CARD_DIRECTIVES],
  exports: [CARD_DIRECTIVES],
})
export class CardModule {}
