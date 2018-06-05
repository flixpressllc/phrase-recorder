import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { createTask, TaskObject } from 'angular-concurrency';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  phrases: Phrase[] = [];
  chosenPhrase: Phrase = null;

  populatePhrases: TaskObject = (createTask.call(this, function* (this: AppComponent) {
    const phrases = yield this.api.getPhrases();
    this.phrases = phrases;
  }) as TaskObject).setSchedule('restart');

  constructor(
    private api: ApiService,
  ) {}

  ngOnInit() {
    this.populatePhrases.perform();
  }

  choosePhrase(phrase: Phrase) {
    this.chosenPhrase = phrase;
  }
}
