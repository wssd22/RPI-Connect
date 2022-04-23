import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { MyRequestsComponent } from './my-requests/my-requests.component';
import { RequestsComponent } from './requests/requests.component';
import { RegisterComponent } from './register/register.component';
import { HttpService } from './http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})
export class AppComponent{

  @ViewChild(ProfileComponent) profile!: ProfileComponent;
  @ViewChild(MyRequestsComponent) myReqs!: MyRequestsComponent;
  @ViewChild(RequestsComponent) reqs!: RequestsComponent;
  @ViewChild(RegisterComponent) reg!: RegisterComponent;
  title = 'rpi-connect';
  showHome = true;
  showRequests = false;
  showLogin = false;
  showRegister = false;
  showProfile = false;
  showMyRequests = false;
  loggedOut = true;
  loggedIn = false;
  year:number = 0;
  month:number = 0;
  day:number = 0;


  private data:any = [];
  sentId:number = 0;
  
  currentClass:any = [];
  prevClass:any = [];


  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    var today = new Date();
    this.year = today.getFullYear();
    this.month = today.getMonth(); 
    this.day = today.getDate();
    var monthDays = 0;
    if("1 3 5 7 8 10 12".includes(this.month.toString()) && this.month != 2){
      monthDays = 31;
    }
    else if("4 6 9 11".includes(this.month.toString())){
      monthDays = 30;
    }
    else{
      monthDays = 28;
    }
    this.httpService.sendGetRequest("req").subscribe((res) =>{
      this.data = res;
      for(var i = 0; i < this.data.length; i++){
        var reqDate = this.data[i].datePosted.split('-');
        var reqDay = reqDate[2];
        var reqMonth = reqDate[1];
        var reqYear = reqDate[0];
        if(reqYear < this.year){
          this.month += 12;
        }
        if(reqMonth < this.month){
          this.day += monthDays;
        }
        var diff = this.day - reqDay;
        var daysLeft = 14 - diff;
        if(daysLeft < 0){
          daysLeft = 0;
        }
        //update req
        if(daysLeft != this.data[i].daysLeft){
          var obj = {"daysLeft" : daysLeft};
          var json = JSON.stringify(obj);
          this.httpService.sendPutRequest("req/" + this.data[i].reqId, JSON.parse(json)).subscribe((res) =>{
          });
        }

        //update active status is daysleft == 0
        if(daysLeft == 0){
          var obj2 = {"status" : "expired"};
          json = JSON.stringify(obj2);
          this.httpService.sendPutRequest("req/" + this.data[i].reqId, JSON.parse(json)).subscribe((res) =>{
            
          });
        }
      }
    });
    
  }

  public setId(num:number):void{
    this.sentId = num;
    this.loggedOut = false;
    this.loggedIn = true;
  }
  public profileNav(profile:any):void{
    this.showProfile = true;
    this.showRegister = false;
  }

  public nav(page: any):void {
    if(page == "home"){
      this.showHome = true;
      this.showRequests = false;
      this.showLogin = false;
      this.showRegister = false;
      this.showProfile = false;
      this.showMyRequests = false;
    }
    else if(page == "logout"){
      this.showHome = true;
      this.showRequests = false;
      this.showLogin = false;
      this.showRegister = false;
      this.showProfile = false;
      this.showMyRequests = false;
      this.sentId = 0;
      this.loggedOut = true;
      this.loggedIn = false;
    }
    else if(page == "login"){
      this.showHome = false;
      this.showRequests = false;
      this.showLogin = true;
      this.showRegister = false;
      this.showProfile = false;
      this.showMyRequests = false;
    }
    else if(page == "requests" && this.sentId != 0){
      this.showHome = false;
      this.showRequests = true;
      this.showLogin = false;
      this.showRegister = false;
      this.showProfile = false;
      this.showMyRequests = false;
      this.reqs.loadInterface();
    }
    else if(page == "register"){
      this.showHome = false;
      this.showRequests = false;
      this.showLogin = false;
      this.showRegister = true;
      this.showProfile = false;
      this.showMyRequests = false;
      this.reg.loadCurrentClasses();
      this.reg.loadPrevClasses();
    }
    else if(page == "myRequests" && this.sentId != 0){
      this.showHome = false;
      this.showRequests = false;
      this.showLogin = false;
      this.showRegister = false;
      this.showProfile = false;
      this.showMyRequests = true;
      this.myReqs.filters();
      this.myReqs.loadRequests();
    }
    else if(page == "profile" && this.sentId != 0){
      this.showHome = false;
      this.showRequests = false;
      this.showLogin = false;
      this.showRegister = false;
      this.showProfile = true;
      this.showMyRequests = false;
      
      this.profile.loadProfile(this.sentId);
    }
    else if(this.sentId == 0){
      this.showHome = false;
      this.showRequests = false;
      this.showLogin = true;
      this.showRegister = false;
      this.showProfile = false;
      this.showMyRequests = false;
    }
  }

  public currentSet(data:any){
    this.currentClass = data;
    
  }
  public prevSet(data:any){
    this.prevClass = data;
  }

}
