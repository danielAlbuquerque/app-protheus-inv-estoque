import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  private url_service: string;

  constructor(public http: Http) {
    this.url_service = localStorage.getItem('URL_SERVICE');
  }

  login() {
    return new Promise((resolve, reject) => {    
      if(this.url_service != null) {
        this.http.get(this.url_service + '/users')
        .map(res => res.json())
        .subscribe(response => {
          resolve(true);
        }, err => {
          reject(err.message);
        });
      } else {
        reject("Servidor não configurado");
      }
    });
  }

}
