import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
//import { timeStamp } from 'console';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  
})
export class ProfileComponent implements OnInit {
  @Input() profileShow: boolean = false;
  @Input() profileId:number = 0;

  @Output() loginSend = new EventEmitter();

  name:string = "";
  year:string = "";
  email:string = "";
  discord:string = "";
  private data:any = [];
  majors:any = [];
  classes:any = [];
  showClasses:boolean = false;
  className:string = "";

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
  }

  public getClasses(event:any){
    console.log(event.target.value);
    console.log("got here\n");
    this.httpService.sendGetRequest("majors/" + event.target.value).subscribe((res) => {
      this.classes = res;
      this.showClasses = true;
      console.log(this.classes);
    });
  }

  public setClassName(event:any) {
    this.className = event.target.value;
    console.log(event.target.value);
  }

  public loadProfile(id:number){
    this.profileId = id;
    this.httpService.sendGetRequest("user/" + this.profileId.toString()).subscribe((res) => {
      this.data = res;
      
      this.name = this.data.name;

      this.year = this.data.gradYr;
      this.email = this.data.email;
      this.discord = this.data.discord;
      //read in classes
      var current = "";
      var currentList = document.getElementById("currentList");
      
      var current = "";
      for(var i = 0; i < this.data.current.length; i++){
        if (i % 2 == 0) {
          current += "<div class='row' style='background-color: white;'>";
          current += "<div class='col-6'><p class='card-text' id='" + this.data.current[i] + "'>" + this.data.current[i] + "</p></div>";
        }
        else {
          current += "<div class='col-6'><p class='card-text' id='" + this.data.current[i] + "'>" + this.data.current[i] + "</p></div>";
          current += "</div>";
        }
      }
      (<HTMLElement>currentList).innerHTML = current;

      var prev = "";
      var prevList = document.getElementById("prevList");
      for(var i = 0; i < this.data.prev.length; i++){
        if (i % 2 == 0) {
          prev += "<div class='row' style='background-color: white;'>";
          prev += "<div class='col-6'><p class='card-text' id='" + this.data.prev[i] + "'>" + this.data.prev[i] + "</p></div>";
        }
        else {
          prev += "<div class='col-6'><p class='card-text' id='" + this.data.prev[i] + "'>" + this.data.prev[i] + "</p></div>";
          prev += "</div>";
        }
      }
      (<HTMLElement>prevList).innerHTML = prev;

      //class edits 
      //current
      var element;
      var destination = document.getElementById("editCurrent");
      for(var i = 0; i < this.data.current.length; i++){
        element = document.createElement("p");
        element.innerHTML = this.data.current[i];
        element.id = this.data.current[i] + "Edit";
        (<HTMLElement>destination).appendChild(element);
        const button = document.createElement('button');
        button.id = this.data.current[i];
        button.addEventListener('click', (e) => {
          this.delClass(button.id, "current");//your typescript function
        });
        //button.id += "btn";
        button.innerText = 'Delete';
        button.classList.add("btn");
        button.classList.add("btn-outline-danger");
        button.classList.add("btn-sm");
        button.style.cssText = 'margin-left: 10px; width: auto;';
        (<HTMLElement>element).appendChild(button);
      }

      //prev 
      destination = document.getElementById("editPrev");
      for(var i = 0; i < this.data.prev.length; i++){
        element = document.createElement("p");
        element.innerHTML = this.data.prev[i];
        element.id = this.data.prev[i] + "Edit";
        (<HTMLElement>destination).appendChild(element);
        const button = document.createElement('button');
        button.id = this.data.prev[i];
        button.addEventListener('click', (e) => {
          this.delClass(button.id, "prev");//your typescript function
        });
        button.innerText = 'Delete';
        //button.id += "btn";
        button.classList.add("btn");
        button.classList.add("btn-outline-danger");
        button.classList.add("btn-sm");
        button.style.cssText = 'margin-left: 10px; width: auto;';
        (<HTMLElement>element).appendChild(button);
      }



    });

    this.httpService.sendGetRequest('majors').subscribe((res) => {
      this.majors = res;
    });

  }

  public showEdit(show:HTMLElement, hide:HTMLElement){
    show.style.display = "block";
    
    hide.style.display = "none";
  }

  public editProfile(name:HTMLElement, year:HTMLElement, email:HTMLElement, disc:HTMLElement, show:HTMLElement, hide:HTMLElement){
    //validity checks
    if((<HTMLInputElement>name).value == ""){
      alert("Name field cannot be left blank");
      return;
    }
    if((<HTMLInputElement>year).value.length != 4){
      alert("Year update must be a valid year");
      return;
    }
    if((<HTMLInputElement>year).value == ""){
      alert("Year field cannot be left blank");
      return;
    }
    if((<HTMLInputElement>email).value == ""){
      alert("Email field cannot be left blank");
      return;
    }
    if(!(<HTMLInputElement>email).value.includes('@')){
      alert("Email update must be a valid email");
      return;
    }
    if((<HTMLInputElement>disc).value == ""){
      alert("Discord Username field cannot be left blank");
      return;
    }

    this.name = (<HTMLInputElement>name).value;
    this.year = (<HTMLInputElement>year).value;
    this.email = (<HTMLInputElement>email).value;
    this.discord = (<HTMLInputElement>disc).value;

    //get request to update user
    this.httpService.sendGetRequest('user/' + this.profileId.toString()).subscribe((res) => {
      this.data = res;
      var obj = {id : this.profileId};
      var json = JSON.stringify(obj);
      if(this.name != this.data.name){
        this.httpService.sendPutRequest('user/name/' + this.name, JSON.parse(json)).subscribe((res) => {

        });
        //update userName in requests
        this.httpService.sendGetRequest('user/' + this.profileId.toString()).subscribe((res) => {
          this.data = res;
          for(var i = 0; i < this.data.reqs.length; i++){
            var obj = {userName : this.name};
            var json = JSON.stringify(obj);
            this.httpService.sendPutRequest('req/' + this.data.reqs[i].toString(), JSON.parse(json)).subscribe((res) => {
            });
          }
        });
      }
      if(this.year != this.data.gradYr){
        this.httpService.sendPutRequest('user/gradYr/' + this.year, JSON.parse(json)).subscribe((res) => {

        });
      }
      if(this.email != this.data.email){
        this.httpService.sendPutRequest('user/email/' + this.email, JSON.parse(json)).subscribe((res) => {

        });
      }
      if(this.discord != this.data.discord){
        this.httpService.sendPutRequest('user/discord/' + this.discord, JSON.parse(json)).subscribe((res) => {

        });
      }
    
      (<HTMLElement>document.getElementById("confirm")).style.display = "block";
      (<HTMLElement>document.getElementById("edit")).style.display = "none";
      this.loadProfile(this.profileId);
    });
  }

  //delete class
  public delClass(course:string, list:string){
    //delete class
    this.httpService.sendDeleteRequest("user/" + this.profileId.toString() + "/" + list + "?course=" + course, "").subscribe((res) => {

    });
    //delete requests
    this.httpService.sendGetRequest("req").subscribe((res) => {
      //iterate thorugh all requests and delete ones with same class and userId
      this.data = res;
      for(var i = 0; i < this.data.length; i++){
        if(this.data[i].userId == this.profileId && this.data[i].class == course){
          this.httpService.sendDeleteRequest("req/" + this.data[i].reqId.toString(), "").subscribe((res) => {

          });
        }
      }
    });
    (<HTMLElement>document.getElementById("confirm")).style.display = "block";
    (<HTMLElement>document.getElementById("edit")).style.display = "none";
    if(document.getElementById(course)){
      (<HTMLElement>document.getElementById(course)).style.display = "none";
    }
    if(document.getElementById(course + "btn")){
      (<HTMLElement>document.getElementById(course + "btn")).style.display = "none";
    }
    alert(course + "Edit");
    if(document.getElementById(course + "Edit")){
      (<HTMLElement>document.getElementById(course + "Edit")).style.display = "none";
    }
    
    //this.loadProfile(this.profileId);
  }

  public addClass(list:string){
    //need to add list of classes to check to make sure class is valid
    this.httpService.sendGetRequest("user/" + this.profileId.toString()).subscribe((res) => {
      this.data = res;
      var courseList = this.data.current;
      for(var i = 0; i < courseList.length; i++){
        if(courseList[i] == this.className){
          alert(this.className + " is a already a member of your Current Classes list");
        }
      }
      courseList = this.data.prev;
      for(var i = 0; i < courseList.length; i++){
        if(courseList[i] == this.className){
          alert(this.className + " is a already a member of your Previous Classes list");
        }
      }
    });
    var obj = {id : this.profileId};
    var query = JSON.stringify(obj);
    this.httpService.sendPutRequest("user/" + list + "/" + this.className, JSON.parse(query)).subscribe((res) => {

    });
    (<HTMLElement>document.getElementById("confirm")).style.display = "block";
    (<HTMLElement>document.getElementById("edit")).style.display = "none";
    //add course to list on HTML page
    var destination;
    var editDest;
    if(list == "current"){
      destination = document.getElementById("currentList");
      editDest = document.getElementById("editCurrent");
      (<HTMLInputElement>document.getElementById("addCurrent")).value = "";
    }
    else{
      destination = document.getElementById("prevList");
      editDest = document.getElementById("editPrev");
      (<HTMLInputElement>document.getElementById("addPrev")).value = "";
    }
    var element = document.createElement("p");
    element.innerHTML = this.className;
    element.id = this.className + "Edit";
    (<HTMLElement>editDest).appendChild(element);
    const button = document.createElement("button");
    button.id = this.className;
    button.addEventListener('click', (e) => {
      this.delClass(button.id, list);//your typescript function
    });
    //button.id += "btn";
        button.innerText = 'Delete';
        button.classList.add("btn");
        button.classList.add("btn-outline-danger");
        button.classList.add("btn-sm");
        button.style.cssText = 'margin-left: 10px; width: auto;';
    element.appendChild(button);
    var elem = document.createElement("p");
    elem.innerHTML = this.className;
    elem.id = this.className;
    (<HTMLElement>destination).appendChild(elem);
    //this.loadProfile(this.profileId);
  }

}
