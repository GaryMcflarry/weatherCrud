import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
  //used by user service to store set item
  setItem(key: string, value : string) {
    localStorage.setItem(key, value)
  }
  //used to retrieve set item
  getItem(key: string) {
    return localStorage.getItem(key)
  }
  //used to delete set item
  removeItem(key: string) {
    localStorage.removeItem(key)
  }
}
