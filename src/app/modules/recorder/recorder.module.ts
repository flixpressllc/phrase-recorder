import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecorderService } from './services/recorder.service';
import { RecordRTCComponent } from './components/record-rtc/record-rtc.component';

export { RecordRTCComponent };

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    RecordRTCComponent,
  ],
  exports: [
    RecordRTCComponent,
  ],
})
export class RecorderModule { }
