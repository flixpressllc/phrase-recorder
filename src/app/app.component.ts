import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from './services/api.service';
import { createTask, TaskObject, timeout } from 'angular-concurrency';
import { RecordRTCComponent } from './modules/recorder/recorder.module';
import { RecorderService } from './modules/recorder/services/recorder.service';
import { DeviceDetectorService } from 'ngx-device-detector';

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
  recordingTimer: number = null;
  isIPhone = false;
  chosenFile: File = null;
  recordTimeInSeconds = 0;
  done = false;
  @ViewChild('recorder') recorder: RecordRTCComponent;
  @ViewChild('iosFileChooser') fileChooser: ElementRef<HTMLInputElement>;

  populatePhrases: TaskObject = (createTask.call(this, function* (this: AppComponent) {
    const phrases = yield this.api.getPhrases();
    this.phrases = phrases;
  }) as TaskObject).setSchedule('restart');

  watchIosFileChooser: TaskObject = (createTask.call(this, function* (this: AppComponent) {
    while (!this.fileChooser) {
      yield timeout(1000);
    }
    while (this.fileChooser.nativeElement.files.length < 1) {
      yield timeout(500);
    }
    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 200);
    return this.chosenFile = this.fileChooser.nativeElement.files[0];
  }) as TaskObject).setSchedule('restart');

  startTimedRecording: TaskObject = (createTask.call(this, function* (this: AppComponent) {
    if (!this.choosePhrase) { return; }
    const recordTime = this.getRecordTime();

    this.doCountDown.perform();
    yield timeout(COUNTDOWN_SECONDS * 1000);

    this.recorder.startRecording();
    this.runRecordingTimer.perform();
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
    this.countdown = null;
  }) as TaskObject).setSchedule('restart');

  runRecordingTimer: TaskObject = (createTask.call(this, function* (this: AppComponent) {
    const originalDuration = this.getRecordTime();
    const originalTime = Date.now();
    this.recordingTimer = originalDuration / 1000;
    while (this.recordingTimer >= 1) {
      yield timeout(100);
      this.recordingTimer = (originalDuration - (Date.now() - originalTime)) / 1000;
    }
    this.recordingTimer = null;
  }) as TaskObject).setSchedule('restart');

  constructor(
    private api: ApiService,
    private recordService: RecorderService,
    private detector: DeviceDetectorService,
  ) {}

  ngOnInit() {
    this.populatePhrases.perform();
    this.discoverDevice();
  }

  discoverDevice() {
    this.isIPhone = this.detector.getDeviceInfo().device === 'iphone';
    if (this.isIPhone) { this.watchIosFileChooser.perform(); }
  }

  choosePhrase(phrase: Phrase) {
    this.chosenPhrase = phrase;
    this.recordTimeInSeconds = this.getRecordTime() / 1000;
  }

  getRecordTime(): number {
    if (!this.chosenPhrase) { return 0; }
    const time = this.chosenPhrase.text.length * 60;
    return time > 4000 ? time : 4000;
  }

  upload() {
    this.done = true;
  }
}
