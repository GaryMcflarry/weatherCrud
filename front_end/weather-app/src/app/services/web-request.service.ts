import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  readonly ROOT_URL: any;
  readonly key: any;
  readonly firebase_URL : any;

  constructor(private http: HttpClient) {

    //making strings for the key and url with weather api, and the firebase api
    this.ROOT_URL = 'http://api.weatherapi.com/v1/';
    this.firebase_URL = 'http://127.0.0.1:5001/firstcrud-6ee6e/us-central1/app'
    this.key = 'cd24f9073d024cc2b3a82758242501'

   }

  //function that makes http call to weather api
  get(action: any, uri: string) {
    return this.http.get(`${this.ROOT_URL}${action}.json?key=${this.key}&q=${uri}&aqi=no&days=3`);
  }
  
  //function that makes http call to get from firebase through api
  mongoPost(uri: string, payload: object) {
    return this.http.post(`${this.firebase_URL}/${uri}`, payload);
  }

  //function that makes http call to post to firebase through api
  mongoGet(uri: string) {
    return this.http.get(`${this.firebase_URL}/${uri}`)
  }
}
