import { Component, OnInit, Input } from '@angular/core';
import { BlockService } from '../block.service';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css']
})
export class ColumnComponent implements OnInit {
  @Input() blocks: string[];

  @Input() index: number;

  constructor(private blockService: BlockService) { }

  ngOnInit() {
  }

  addBlock(title: string): void {
  	this.blockService.addBlock(this.index, title)
  }

  removeFrom(blockIndex: number): void {
  	this.blockService.removeBlock(this.index, blockIndex);
  }
}
