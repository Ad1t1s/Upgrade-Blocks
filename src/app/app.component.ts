import { Component } from '@angular/core';

import { BlockService } from './block.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

	constructor(private blocks: BlockService) { }

	addColumn(title) {
		this.blocks.addColumn(title)
	}
}
