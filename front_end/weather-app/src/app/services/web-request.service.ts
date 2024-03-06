import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {
  //only meant to be read
  readonly ROOT_URL: any;
  key: any;

  constructor(private http: HttpClient) {
    //making strings for the key and rooting path to communicate with the api
    this.ROOT_URL = 'http://api.weatherapi.com/v1/';
    this.key = 'cd24f9073d024cc2b3a82758242501'
   }

   //function that makes http call to requested url
  get(action: any, uri: string) {
    return this.http.get(`${this.ROOT_URL}${action}.json?key=${this.key}&q=${uri}&aqi=no&days=3`);
  }
  
  mongoPost(uri: string, payload: object) {
    return this.http.post(`http://localhost:1000/${uri}`, payload);
  }

  mongoGet(uri: string) {
    return this.http.get(`http://localhost:1000/${uri}`)
  }
}
