import { CoreService } from './core.service';
import { Injectable } from '@angular/core';
import { INITIAL_EVENTS } from '../event-utils';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(
    private coreService: CoreService
  ) { }
  getData() {
    return INITIAL_EVENTS;
  }
}
