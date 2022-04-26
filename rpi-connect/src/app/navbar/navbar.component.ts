import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output() target = new EventEmitter<any>();
  @Input() profId:number = 0;
  @Input() loggedIn:boolean = false;
  @Input() loggedOut:boolean = true;
  sentId:number = 0;
  
  
  constructor(public router : Router) { }

  ngOnInit(): void {
  }

  public dropdown(target:HTMLElement) {
    const dropMenu = target;
    /*var accordions = document.getElementsByClassName("accordion");
    for(var i = 0; i < accordions.length; i++){
        if(accordions[i].id != (<HTMLElement>dropMenu).id){
          (<HTMLElement>accordions[i]).style.display = "none";
        }
    }*/
    //Show dropdown for clicked content
    if((<HTMLElement>dropMenu).style.display === "block"){
      (<HTMLElement>dropMenu).style.display = "none";
    }
    else{
      (<HTMLElement>dropMenu).style.display = "block";
    }
}

  //navigation between pages
  public navigate(page:HTMLElement){
    this.target.emit(page.id);
    /*if(page.id == "home"){
      this.router.navigate(['home']);
    }
    else if(page.id == "logout"){
      this.sentId = 0;
      this.loggedOut = true;
      this.loggedIn = false;
    }
    else if(page.id == "login"){
      this.router.navigate(['login']);
    }
    else if(page.id == "requests" && this.sentId != 0){

      //this.reqs.loadInterface();
    }
    else if(page.id == "register"){

      //this.reg.loadCurrentClasses();
      //this.reg.loadPrevClasses();
    }
    else if(page.id == "myRequests" && this.sentId != 0){

      //this.myReqs.loadRequests();
      //this.myReqs.filters();
    }
    else if(page.id == "profile" && this.sentId != 0){
      
      //this.profile.loadProfile(this.sentId);
    }
    else if(this.sentId == 0){
      this.router.navigate(['login']);
    }*/
  }

}
