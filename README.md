# ngx-card [![npm version](https://badge.fury.io/js/ngx-card.svg)](https://www.npmjs.com/package/ngx-card) [![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

[![Build Status](https://travis-ci.org/ihym/ngx-card.svg?branch=master)](https://travis-ci.org/ihym/ngx-card)
[![Dependencies](https://david-dm.org/ihym/ngx-card.svg)](https://david-dm.org/ihym/ngx-card)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/6ff9f19109dc4c9ba18eb8cd893d67d7)](https://www.codacy.com/app/ihym/ngx-card?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ihym/ngx-card&amp;utm_campaign=Badge_Grade)

Angular 2+ wrapper for [card.js](https://github.com/jessepollak/card)

[https://ihym.github.io/ngx-card/](https://ihym.github.io/ngx-card/)

## Installation

Install through `npm`:

```bash
npm install --save ngx-card
```


## API
### [card]
#### Input

* container: any: A selector or DOM element for the form where users will be entering their information

* card-width: number: default 350px

* messages: any = {validDate: 'valid\ndate', monthYear: 'mm/yyyy'}: Strings for translation

* placeholders: any = {number: '•••• •••• •••• ••••', name: 'Full Name', expiry: '••/••', cvc: '•••'}: Placeholders for rendered fields

* masks: any;

* formatting: boolean = true;

* debug: boolean = false: If true, will log helpful messages for setting up Card

###  input[card-number]
###  input[card-name]
###  input[card-expiry]
###  input[card-cvc]


## Usage
Once installed you need to import our main module into your application module. You should end up with code similar to this:

```javascript
import {AppComponent} from '...';
import {CardModule} from 'ngx-card/ngx-card';

@NgModule({
  imports: [..., CardModule],
  declarations: [AppComponent, ...],
  bootstrap: [AppComponent],
})
export class AppModule {}
```


Modify slightly your form by adding the correct directives in your input elements.
You can have multiple inputs that render to a single field (i.e. you have a first and last name input).
To use ngx-card with this functionality, just rearrange your input elements in the correct order and add the proper directives. For example,
```javascript
<form ngx-card
  container=".card-container"
  [card-width]="500"
  [messages]="messages"
  [placeholders]="placeholders"
  [masks]="masks"
  formatting="false"
  debug="true">

  <input type="text" name="number" card-number/>
  <input type="text" name="first-name" card-name/>
  <input type="text" name="last-name" card-name/>
  <input type="text" name="expiry" card-expiry/>
  <input type="text" name="cvc" card-cvc/>
</form>
```

***
MIT @ [Vasilis Diakomanolis](https://github.com/ihym)
