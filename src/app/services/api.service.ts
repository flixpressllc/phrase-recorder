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
      { id: '1', text: 'Hello' },
    ];
    return from([phrases]).pipe(delay(1000)).toPromise();
  }
}
