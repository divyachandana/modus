import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { AppService } from '../../services/app.service';
@Component({
  selector: 'ng-e-app-content',
  templateUrl: './app-content.component.html',
  styleUrls: ['./app-content.component.scss']
})
export class AppContentComponent implements OnInit {
  user: User = {
    firstName: 'Ahsan',
    lastName: 'Ayaz'
  };
  isLoggedIn: boolean;
  constructor(private data:AppService) { }

  ngOnInit() {
    this.isLoggedIn = false;
    this.data.currLoginStatus.subscribe(status=>this.isLoggedIn=status)
  }

  /**
   * @author Ahsan Ayaz
   * @desc Logs the user in
   */
  login() {
    this.isLoggedIn = true;
    this.data.ChangeLoginStatus(this.isLoggedIn);
  }

  /**
   * @author Ahsan Ayaz
   * @desc Logs the user out
   */
  logout() {
    this.isLoggedIn = false;
    this.data.ChangeLoginStatus(this.isLoggedIn);
  }

}
