/*
 *
 * Copyright 2015 HISP Tanzania
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 * @since 2015
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
import { Injectable } from '@angular/core';
import { CurrentUser } from '../../models/currentUser';
import * as sha1 from 'js-sha1';
/*
  Generated class for the EncryptionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EncryptionProvider {
  constructor() {}

  getHashedKeyForOfflineAuthentication(user: CurrentUser) {
    const serverUrlArray = user.serverUrl.split('://');
    const urlWithoutHttp =
      serverUrlArray.length > 1 ? serverUrlArray[1] : serverUrlArray[0];
    const hashedPassword = sha1(
      urlWithoutHttp + ':' + user.username + ':' + user.password
    );
    return hashedPassword;
  }

  /**
   *
   * @param value
   * @returns {string}
   */
  encode(value) {
    let Base64 = {
      _keyStr:
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
      encode: function(e) {
        let t = '';
        let n, r, i, s, o, u, a;
        let f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
          n = e.charCodeAt(f++);
          r = e.charCodeAt(f++);
          i = e.charCodeAt(f++);
          s = n >> 2;
          o = ((n & 3) << 4) | (r >> 4);
          u = ((r & 15) << 2) | (i >> 6);
          a = i & 63;
          if (isNaN(r)) {
            u = a = 64;
          } else if (isNaN(i)) {
            a = 64;
          }
          t =
            t +
            this._keyStr.charAt(s) +
            this._keyStr.charAt(o) +
            this._keyStr.charAt(u) +
            this._keyStr.charAt(a);
        }
        return t;
      },
      decode: function(e) {
        let t = '';
        let n, r, i;
        let s, o, u, a;
        let f = 0;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, '');
        while (f < e.length) {
          s = this._keyStr.indexOf(e.charAt(f++));
          o = this._keyStr.indexOf(e.charAt(f++));
          u = this._keyStr.indexOf(e.charAt(f++));
          a = this._keyStr.indexOf(e.charAt(f++));
          n = (s << 2) | (o >> 4);
          r = ((o & 15) << 4) | (u >> 2);
          i = ((u & 3) << 6) | a;
          t = t + String.fromCharCode(n);
          if (u != 64) {
            t = t + String.fromCharCode(r);
          }
          if (a != 64) {
            t = t + String.fromCharCode(i);
          }
        }
        t = Base64._utf8_decode(t);
        return t;
      },
      _utf8_encode: function(e) {
        e = e.replace(/\r\n/g, '\n');
        let t = '';
        for (let n = 0; n < e.length; n++) {
          let r = e.charCodeAt(n);
          if (r < 128) {
            t += String.fromCharCode(r);
          } else if (r > 127 && r < 2048) {
            t += String.fromCharCode((r >> 6) | 192);
            t += String.fromCharCode((r & 63) | 128);
          } else {
            t += String.fromCharCode((r >> 12) | 224);
            t += String.fromCharCode(((r >> 6) & 63) | 128);
            t += String.fromCharCode((r & 63) | 128);
          }
        }
        return t;
      },
      _utf8_decode: function(e) {
        let t = '';
        let n = 0;
        let r = 0,
          c2 = 0;
        while (n < e.length) {
          r = e.charCodeAt(n);
          if (r < 128) {
            t += String.fromCharCode(r);
            n++;
          } else if (r > 191 && r < 224) {
            c2 = e.charCodeAt(n + 1);
            t += String.fromCharCode(((r & 31) << 6) | (c2 & 63));
            n += 2;
          } else {
            c2 = e.charCodeAt(n + 1);
            let c3 = e.charCodeAt(n + 2);
            t += String.fromCharCode(
              ((r & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
            );
            n += 3;
          }
        }
        return t;
      }
    };
    return Base64.encode(value);
  }

  /**
   *
   * @param value
   * @returns {string}
   */
  decode(value) {
    let Base64 = {
      _keyStr:
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
      encode: function(e) {
        let t = '';
        let n, r, i, s, o, u, a;
        let f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
          n = e.charCodeAt(f++);
          r = e.charCodeAt(f++);
          i = e.charCodeAt(f++);
          s = n >> 2;
          o = ((n & 3) << 4) | (r >> 4);
          u = ((r & 15) << 2) | (i >> 6);
          a = i & 63;
          if (isNaN(r)) {
            u = a = 64;
          } else if (isNaN(i)) {
            a = 64;
          }
          t =
            t +
            this._keyStr.charAt(s) +
            this._keyStr.charAt(o) +
            this._keyStr.charAt(u) +
            this._keyStr.charAt(a);
        }
        return t;
      },
      decode: function(e) {
        let t = '';
        let n, r, i;
        let s, o, u, a;
        let f = 0;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, '');
        while (f < e.length) {
          s = this._keyStr.indexOf(e.charAt(f++));
          o = this._keyStr.indexOf(e.charAt(f++));
          u = this._keyStr.indexOf(e.charAt(f++));
          a = this._keyStr.indexOf(e.charAt(f++));
          n = (s << 2) | (o >> 4);
          r = ((o & 15) << 4) | (u >> 2);
          i = ((u & 3) << 6) | a;
          t = t + String.fromCharCode(n);
          if (u != 64) {
            t = t + String.fromCharCode(r);
          }
          if (a != 64) {
            t = t + String.fromCharCode(i);
          }
        }
        t = Base64._utf8_decode(t);
        return t;
      },
      _utf8_encode: function(e) {
        e = e.replace(/\r\n/g, '\n');
        let t = '';
        for (let n = 0; n < e.length; n++) {
          let r = e.charCodeAt(n);
          if (r < 128) {
            t += String.fromCharCode(r);
          } else if (r > 127 && r < 2048) {
            t += String.fromCharCode((r >> 6) | 192);
            t += String.fromCharCode((r & 63) | 128);
          } else {
            t += String.fromCharCode((r >> 12) | 224);
            t += String.fromCharCode(((r >> 6) & 63) | 128);
            t += String.fromCharCode((r & 63) | 128);
          }
        }
        return t;
      },
      _utf8_decode: function(e) {
        let t = '';
        let n = 0;
        let r = 0,
          c2 = 0;
        while (n < e.length) {
          r = e.charCodeAt(n);
          if (r < 128) {
            t += String.fromCharCode(r);
            n++;
          } else if (r > 191 && r < 224) {
            c2 = e.charCodeAt(n + 1);
            t += String.fromCharCode(((r & 31) << 6) | (c2 & 63));
            n += 2;
          } else {
            c2 = e.charCodeAt(n + 1);
            let c3 = e.charCodeAt(n + 2);
            t += String.fromCharCode(
              ((r & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
            );
            n += 3;
          }
        }
        return t;
      }
    };
    return Base64.decode(value);
  }
}
