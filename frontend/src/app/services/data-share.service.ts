import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { Observable, BehaviorSubject, of } from 'rxjs';
import { Document } from '../modules/document';


@Injectable({
  providedIn: 'root'
})
export class DataShareService {
  // Create a new variable type BehaviorSubject to share selected file between two components.
  // BehaviorSubject serves for synchronize shared data
  private selectedDocument = new BehaviorSubject<Document>(null);
  private docType = new BehaviorSubject<string>(null);
  private auxText = new BehaviorSubject<string>(null);
  private preview = new BehaviorSubject<boolean>(null);


  private currentLat;
  private currentLong;


  constructor() {
  }

  observeDocument() {
    return (this.selectedDocument.asObservable())
  }
  selectDocument(file: Document) {
    this.selectedDocument.next(file);
  }
 

  observeDocumentType() {
    return (this.docType.asObservable())
  }
  selectDocumentType(type: string) {
    this.docType.next(type);
  }

  previewTarget(bool:boolean){
    this.preview.next(bool);
  }

  observePreviewTarget() {
    return (this.preview.asObservable())
  }

  observeAuxText() {
    return (this.auxText.asObservable())
  }
  changeAuxText(text: string) {
    this.auxText.next(text);
  }

  //################################
  findMe() {

    if (navigator.geolocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition, this.showError);

      } else {
        alert("Geolocation is not supported by this browser.");
      }
    }
  }


  showPosition(position) {
    console.log(`tracking position:  ${position.coords.latitude} - ${position.coords.longitude}`);
    this.currentLat = position.coords.latitude;
    this.currentLong = position.coords.longitude;

    //   let location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    //   this.map.panTo(location);

    //   if (!this.marker) {
    //     this.marker = new google.maps.Marker({
    //       position: location,
    //       map: this.map,
    //       title: 'Got you!'
    //     });
    //   }
    //   else {
    //     this.marker.setPosition(location);
    //   }
    // }
  }

  showError(error) {
    console.log(error);

    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.");
        break;
      default:
        console.log("default");

    }
  }
}