import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from './services/api.service';
import { createTask, TaskObject, timeout } from 'angular-concurrency';
import { RecordRTCComponent } from './modules/recorder/recorder.module';
import { RecorderService } from './modules/recorder/services/recorder.service';

const COUNTDOWN_SECONDS = 3;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  phrases: Phrase[] = [];
  chosenPhrase: Phrase = null;
  countdown: number = null;
  @ViewChild('recorder') recorder: RecordRTCComponent;

  populatePhrases: TaskObject = (createTask.call(this, function* (this: AppComponent) {
    const phrases = yield this.api.getPhrases();
    this.phrases = phrases;
  }) as TaskObject).setSchedule('restart');

  startTimedRecording: TaskObject = (createTask.call(this, function* (this: AppComponent) {
    if (!this.choosePhrase) { return; }
    const recordTime = this.getRecordTime();

    this.doCountDown.perform();
    yield timeout(COUNTDOWN_SECONDS * 1000);

    this.recorder.startRecording();
    yield timeout(recordTime);
    yield this.recorder.stopRecording();
    return this.recordService.lastSuccessfulRecording;
  }) as TaskObject).setSchedule('drop');

  doCountDown: TaskObject = (createTask.call(this, function* (this: AppComponent) {
    this.countdown = COUNTDOWN_SECONDS;
    while (this.countdown > 0) {
      yield timeout(1000);
      this.countdown -= 1;
    }
  }) as TaskObject).setSchedule('restart');

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
