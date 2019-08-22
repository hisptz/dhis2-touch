import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  constructor(private network: Network) {}

  getNetWorkStatus() {
    return {
      isAvailable:
        this.network.type === 'unknown' || this.network.type === 'none'
          ? false
          : true,
      message:
        this.network.type === 'unknown' || this.network.type === 'none'
          ? 'You are offline'
          : 'You are online',
      networkType: this.network.type
    };
  }
}
