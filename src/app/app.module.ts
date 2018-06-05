import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RecorderModule } from './modules/recorder/recorder.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    RecorderModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
