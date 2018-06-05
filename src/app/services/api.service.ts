import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { delay } from 'rxjs/operators';
import { consoleOnce } from '../utils/console-once';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor() { }

  getPhrases(): Promise<Phrase[]> {
    consoleOnce.warn('Using fake data for `getPhrases`');

    const phrases: Phrase[] = [
      { id: '1', text: 'Hello from [YOUR CITY], [YOUR STATE]! You are watching Me TV, Channel 23!' },
      { id: '2', text: 'That\'s why I choose Me TV news.' },
    ];
    return from([phrases]).pipe(delay(1000)).toPromise();
  }
}
