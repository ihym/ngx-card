import {Component} from '@angular/core';

@Component({
  selector: 'app',
  templateUrl: './app.html',
})
export class AppComp {

  now = process.env.now;

  version = process.env.version;

}
