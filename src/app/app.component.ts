import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  ngOnInit(): void {

    const config = {
      apiKey: 'AIzaSyCH76knSiZvx-sqAMkGe_Pl6Rw1P5NqjWs',
      authDomain: 'angular-instagram-clone-70b72.firebaseapp.com',
      databaseURL: 'https://angular-instagram-clone-70b72.firebaseio.com',
      projectId: 'angular-instagram-clone-70b72',
      storageBucket: 'angular-instagram-clone-70b72.appspot.com',
      messagingSenderId: '87627455973'
    };

     firebase.initializeApp(config);
  }
}
