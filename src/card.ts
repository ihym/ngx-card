import {Directive, Input, ContentChildren, QueryList, ElementRef} from '@angular/core';
import {NgxCardNumberTemplate, NgxCardNameTemplate, NgxCardExpiryTemplate, NgxCardCvcTemplate} from './inputs';

declare var Card;

const defaultPlaceholders = {
	number: '•••• •••• •••• ••••',
	name: 'Full Name',
	expiry: '••/••',
	cvc: '•••',
};

const defaultMessages = {
	validDate: 'valid\nthru',
	monthYear: 'month/year',
};

@Directive({
  selector: '[card]',
})
export class NgxCard {

	// a selector or DOM element for the container
	// where you want the card to appear
	@Input() container: any;

	@Input('card-width') width: number; // optional — default 350px

	// Strings for translation - optional
	_messages;
	@Input() set messages(_messages: any) {
		this._messages = Object.assign({}, defaultMessages, _messages);
	}
	get messages() {
		return this._messages;
	}

	// Default placeholders for rendered fields - optional
	_placeholders;
	@Input() set placeholders(_placeholders: any) {
		this._placeholders = Object.assign({}, defaultPlaceholders, _placeholders);
	}
	get placeholders() {
		return this._placeholders;
	}

	@Input() masks: any;

	@Input() formatting: boolean = true; // optional - default true

	// if true, will log helpful messages for setting up Card
	@Input() debug: boolean = false; // optional - default false

	@ContentChildren(NgxCardNumberTemplate,  {descendants: true}) numbers: QueryList<NgxCardNumberTemplate>;
	@ContentChildren(NgxCardNameTemplate,  {descendants: true}) names: QueryList<NgxCardNameTemplate>;
	@ContentChildren(NgxCardExpiryTemplate,  {descendants: true}) expiries: QueryList<NgxCardExpiryTemplate>;
	@ContentChildren(NgxCardCvcTemplate,  {descendants: true}) cvcs: QueryList<NgxCardCvcTemplate>;

	constructor(private element: ElementRef) {}

	ngAfterViewInit() {
		new Card({
			form: this.element.nativeElement,
			container: this.container,
			width: this.width,
			formSelectors: {
				numberInput: this.findSelectors(this.numbers),
				expiryInput: this.findSelectors(this.expiries),
				cvcInput: this.findSelectors(this.cvcs),
				nameInput: this.findSelectors(this.names),
			},
			formatting: this.formatting,
			messages: this.messages,
			placeholders: this.placeholders,
			masks: this.masks,
			debug: this.debug,
		});
	}

	findSelectors(list: QueryList<any>): string {
		return list.map(template => template.elementRef.nativeElement.tagName.toLowerCase() + '[name="' + template.name + '"]')
				   .join(', ');
	}

};
