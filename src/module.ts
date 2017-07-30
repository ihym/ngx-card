import {NgModule} from '@angular/core';

import {CardNumberTemplate, CardNameTemplate, CardExpiryTemplate, CardCvcTemplate} from './inputs';
import {Card} from './card';

const CARD_DIRECTIVES = [
	Card,
  CardNumberTemplate,
	CardNameTemplate,
	CardExpiryTemplate,
	CardCvcTemplate,
];

@NgModule({
  declarations: [CARD_DIRECTIVES],
  exports: [CARD_DIRECTIVES],
})
export class CardModule {}
