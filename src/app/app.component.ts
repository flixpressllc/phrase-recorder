import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  phrases: Phrase[] = [];
  chosenPhrase: Phrase = null;

  constructor(
    private api: ApiService,
  ) {}

  ngOnInit() {
    this.api.getPhrases().then((phrases) => this.phrases = phrases);
  }

  choosePhrase(phrase: Phrase) {
    this.chosenPhrase = phrase;
  }
}
