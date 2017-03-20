import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-add-block',
  templateUrl: './add-block.component.html',
  styleUrls: ['./add-block.component.css']
})
export class AddBlockComponent implements OnInit {
	@Output() blockAdded = new EventEmitter;
	@Input() mid: number;

  constructor() { }

  ngOnInit() {
  }

  addBlock(title) {
  		this.blockAdded.emit(title)
  }
}
