import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

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
  
  
  constructor() { }

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
    /*if(target.id == "home"){
      this.showHome = true;
      this.showRequests = false;
      this.showLogin = false;
      this.showRegister = false;
      this.showProfile = false;
    }
    else if(target.id == "login"){
      this.showHome = false;
      this.showRequests = false;
      this.showLogin = true;
      this.showRegister = false;
      this.showProfile = false;
    }
    else if(target.id == "requests"){
      this.showHome = false;
      this.showRequests = true;
      this.showLogin = false;
      this.showRegister = false;
      this.showProfile = false;
    }
    else if(target.id == "register"){
      this.showHome = false;
      this.showRequests = false;
      this.showLogin = false;
      this.showRegister = true;
      this.showProfile = false;
    }
    else if(target.id == "profile"){
      this.showHome = false;
      this.showRequests = false;
      this.showLogin = false;
      this.showRegister = false;
      this.showProfile = true;
    }*/
  }

}
