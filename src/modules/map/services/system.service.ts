import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { HttpClientProvider } from "../../../providers/http-client/http-client";

@Injectable()
export class SystemService {
  constructor(private httpClient: HttpClientProvider) {}

  getSystemInfo() {
    return this.httpClient.get("system/info.json", true);
  }

  getGoogleEarthToken() {
    return this.httpClient.get("tokens/google", true);
  }

  getMapID() {
    return this.httpClient.get("tokens/google", true);
  }
}
