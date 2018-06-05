import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from './services/api.service';
import { createTask, TaskObject, timeout } from 'angular-concurrency';
import { RecordRTCComponent } from './modules/recorder/recorder.module';
import { RecorderService } from './modules/recorder/services/recorder.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  phrases: Phrase[] = [];
  chosenPhrase: Phrase = null;
  @ViewChild('recorder') recorder: RecordRTCComponent;

  populatePhrases: TaskObject = (createTask.call(this, function* (this: AppComponent) {
    const phrases = yield this.api.getPhrases();
    this.phrases = phrases;
  }) as TaskObject).setSchedule('restart');

  startTimedRecording: TaskObject = (createTask.call(this, function* (this: AppComponent) {
    if (!this.choosePhrase) { return; }
    const recordTime = this.getRecordTime();
    this.recorder.startRecording();
    yield timeout(recordTime);
    yield this.recorder.stopRecording();
    return this.recordService.lastSuccessfulRecording;
  }) as TaskObject).setSchedule('drop');

  constructor(
    private api: ApiService,
    private recordService: RecorderService,
  ) {}

  ngOnInit() {
    this.populatePhrases.perform();
  }

  choosePhrase(phrase: Phrase) {
    this.chosenPhrase = phrase;
  }

  getRecordTime(): number {
    return 1000;
  }
}
