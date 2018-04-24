import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import tasks, { Task } from '../tasks/tasks';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppService {
  private isLoggedIn = new BehaviorSubject<boolean>(false);
  currLoginStatus = this.isLoggedIn.asObservable();
  users:any
  constructor(private sanitizer: DomSanitizer, private http:HttpClient) {
    let data = localStorage.getItem('users');
    if(data){
      this.users=JSON.parse(data);
    } else{
      this.http.get('https://randomuser.me/api/?results=40&seed=abc&inc=name,email,dob,phone,cell,id,picture')
      .subscribe(data=>{
        let results = data['results'];
        if(results){

          let allResults = []
          let eachData = {};
          let id=0;
          results.forEach(d=>{
            eachData = {
              fullName:d.name.title + " "+d.name.first +" " +d.name.last,
              email:d.email,
              dob:d.dob,
              phone:d.phone,
              id:id++,
              picture:d.picture.large
            }
            allResults.push(eachData);
          })
          console.log(allResults);
          this.users = allResults;
          // let a = allResults.stringify();
          localStorage.setItem('users',JSON.stringify(allResults));
        }
      })
    }

  }

  ChangeLoginStatus(status:boolean){
    this.isLoggedIn.next(status);
    console.log(status);
  }

  // getUsersList(){
  //   //https://randomuser.me/api/?results=40&seed=abc&inc=name,email,dob,phone,cell,id,picture
  //   this.http.get('https://randomuser.me/api/?results=40&seed=abc&inc=name,email,dob,phone,cell,id,picture')
  //   .subscribe(data=>{
  //     let results = data['results'];
  //     if(results){
  //
  //       let allResults = []
  //       let eachData = {};
  //       let id=0;
  //       results.forEach(d=>{
  //         eachData = {
  //           fullName:d.name.title + " "+d.name.first +" " +d.name.last,
  //           email:d.email,
  //           dob:d.dob,
  //           phone:d.phone,
  //           id:id++,
  //           picture:d.picture.large
  //         }
  //         allResults.push(eachData);
  //       })
  //       console.log(allResults);
  //       this.users = allResults;
  //       // return this.users;
  //     }
  //   })
  // }

  getUsers(){
    return this.users;
  }

  // getUsers(){
  //
  //   this.getUsersList()
  //   .subscribe(data=>{
  //     let results = data['results'];
  //     if(results){
  //
  //       let allResults = []
  //       let eachData = {};
  //       let id=0;
  //       results.forEach(d=>{
  //         eachData = {
  //           fullName:d.name.title + " "+d.name.first +" " +d.name.last,
  //           email:d.email,
  //           dob:d.dob,
  //           phone:d.phone,
  //           id:id++,
  //           picture:d.picture.large
  //         }
  //         allResults.push(eachData);
  //       })
  //       console.log(allResults);
  //       this.users = allResults;
  //       // return this.users;
  //     }
  //   })
  // }



  /**
   * @author Ahsan Ayaz
   * @desc Returns an array of tasks to be done as exercise
   */
  getTasks(): Array<Task> {
    return tasks.map((task) => {
      const updatedTask: Task = {description: ''};
      if (task.links && task.links.length) {
        for (const link of task.links) {
          updatedTask.description = task.description.replace('{{link}}', `<a href='${link}'>${link}</a>`);
        }
      } else if (task.routerLinks && task.routerLinks.length) {
        for (const link of task.routerLinks) {
          updatedTask.description = task.description.replace('{{link}}', `<a href='#/${link}' routerLink="${link}">'${link} route'</a>`);
        }
      }
      updatedTask.description = this.sanitizer.bypassSecurityTrustHtml(updatedTask.description) as string;
      return Object.assign({}, task, updatedTask);
    });
  }


}
