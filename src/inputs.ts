import {Directive, ElementRef, Attribute} from '@angular/core';
import {uniqueId} from './util';

@Directive({
	selector: '[card-number]',
  host: {
    '[name]': 'name',
  },
})
export class CardNumberTemplate {
  constructor(public elementRef: ElementRef,
							@Attribute('name') public name: string) {}

	ngOnInit() {
		this.name = this.name || uniqueId('name');
	}
}

@Directive({
	selector: '[card-name]',
  host: {
    '[name]': 'name',
  },
})
export class CardNameTemplate {
  constructor(public elementRef: ElementRef,
							@Attribute('name') public name: string) {}

	ngOnInit() {
		this.name = this.name || uniqueId('name');
	}
}

@Directive({
	selector: '[card-expiry]',
  host: {
    '[name]': 'name',
  },
})
export class CardExpiryTemplate {
  constructor(public elementRef: ElementRef,
							@Attribute('name') public name: string) {}

	ngOnInit() {
		this.name = this.name || uniqueId('expiry');
	}
}

@Directive({
	selector: '[card-cvc]',
  host: {
    '[name]': 'name',
  },
})
export class CardCvcTemplate {
  constructor(public elementRef: ElementRef,
							@Attribute('name') public name: string) {}

	ngOnInit() {
		this.name = this.name || uniqueId('cvc');
	}
}
