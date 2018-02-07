import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable()
export class SystemService {
  constructor(private httpClient: HttpClient) {}

  getSystemInfo() {
    return this.httpClient.get('../../../api/system/info.json');
  }
}
