import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { BlockComponent } from './block/block.component';
import { ColumnComponent } from './column/column.component';
import { AddBlockComponent } from './add-block/add-block.component';

import { BlockService } from './block.service';

@NgModule({
  declarations: [
    AppComponent,
    BlockComponent,
    ColumnComponent,
    AddBlockComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    BlockService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
