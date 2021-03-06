import { Component, ViewChild, AfterViewInit, OnDestroy, isDevMode } from '@angular/core';
import { RecorderService } from '../../services/recorder.service';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-record-rtc',
  templateUrl: './record-rtc.component.html',
  styleUrls: ['./record-rtc.component.scss'],
})
export class RecordRTCComponent implements AfterViewInit, OnDestroy {

  private stream: MediaStream;
  public src: string | SafeUrl = null;

  @ViewChild('video') _video;
  get video(): HTMLVideoElement {
    return this._video.nativeElement;
  }

  constructor(
    private recorder: RecorderService,
  ) { }

  ngAfterViewInit() {
    this.setup();
  }

  async setup() {
    const stream = await this.recorder.setup();
    if (stream) {
      this.stream = stream;
      this.setPlayerToMonitorMode();
    }
  }

  ngOnDestroy() {
    this.killStream();
  }

  setPlayerToMonitorMode() {
    Object.assign(this.video, {
      muted: true,
      controls: false,
      autoplay: true,
      srcObject: this.stream,
    });
    this.src = null;
  }

  setPlayerToReviewMode(url: string | SafeUrl) {
    Object.assign(this.video, {
      muted: false,
      controls: true,
      autoplay: false,
      srcObject: null,
    });
    this.src = url;
  }

  reset() {
    this.setPlayerToMonitorMode();
  }

  startRecording() {
    this.setPlayerToMonitorMode();
    this.recorder.startRecording();
  }

  async stopRecording() {
    await this.recorder.stopRecording();
    this.setPlayerToReviewMode(this.recorder.lastSuccessfulRecording.url);
  }

  killStream() {
    this.recorder.killStream();
  }

  download() {
    this.recorder.download();
  }
}
