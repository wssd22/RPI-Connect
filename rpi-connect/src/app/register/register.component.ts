import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit {
  @Input() registerShow: boolean = false; 
  @Output() profileReroute = new EventEmitter<any>();
  @Output() idSend = new EventEmitter<any>();
  @Input() newId:string = "";
  //profile storage
  fname:string = "";
  lname:string = "";
  password:string = "";
  user:string = "";
  gradYr:string = "";
  email:string = "";
  discord:string = "";
  discordId:string = "";
  prevClasses:any = [];
  currentClasses:any = [];
  reqs:any = [];
  private data:any = [];

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
  }

  //increment registration steps
  public nextStep(step:HTMLElement){
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if(step.id == "basic"){
        //make sure all fields are filled out
        if((<HTMLInputElement>document.getElementById("fname")).value == ""){
            alert("Please enter your First Name");
            return;
        }
        else if((<HTMLInputElement>document.getElementById("lname")).value == ""){
            alert("Please enter your Last Name");
            return;
        }
        else if((<HTMLInputElement>document.getElementById("gradYr")).value == "" || (<HTMLInputElement>document.getElementById("gradYr")).value.length != 4){
            alert("Please enter a valid Graduation Year");
            return;
        }
        else if((<HTMLInputElement>document.getElementById("rpi")).value == "" || !(<HTMLInputElement>document.getElementById("rpi")).value.includes('@')){
            alert("Please enter a valid RPI Email");
            return;
        }
        else if((<HTMLInputElement>document.getElementById("discord")).value == ""){
            alert("Please enter your Discord Username");
            return;
        }
        /*else if((<HTMLInputElement>document.getElementById("password")).value == ""){
          alert("Please enter your Password");
          return;
        }
        else if((<HTMLInputElement>document.getElementById("password")).value != (<HTMLInputElement>document.getElementById("reenter")).value){
          alert("Please make sure your passwords match");
          return;
        }else if((<HTMLInputElement>document.getElementById("user")).value == ""){
          alert("Please make sure your Username");
          return;
        }*/
        
        this.fname = (<HTMLInputElement>document.getElementById("fname")).value;
        this.lname = (<HTMLInputElement>document.getElementById("lname")).value;
        //this.password = (<HTMLInputElement>document.getElementById("password")).value;
        //this.user = (<HTMLInputElement>document.getElementById("user")).value;
        this.gradYr = (<HTMLInputElement>document.getElementById("gradYr")).value;
        this.email = (<HTMLInputElement>document.getElementById("rpi")).value;
        this.discord = (<HTMLInputElement>document.getElementById("discord")).value;
        this.discordId = (<HTMLInputElement>document.getElementById("discordId")).value;
        //hide last step and show next step
        (<HTMLElement>document.getElementById("basicInfo")).style.display = "none";
        (<HTMLElement>document.getElementById("currentClasses")).style.display = "block";
    }
    else if(step.id == "current"){
        if(this.currentClasses.length == 0){
            alert("Please select your current classes");
            return;
        }
        //hide last step and show next step
        (<HTMLElement>document.getElementById("currentClasses")).style.display = "none";
        (<HTMLElement>document.getElementById("previousClasses")).style.display = "block";
    }
    else if(step.id == "previous"){
        if(this.prevClasses.length == 0){
            alert("Please select your previously taken classes");
            return;
        }
        //hide last step and show next step
        (<HTMLElement>document.getElementById("previousClasses")).style.display = "none";
        (<HTMLElement>document.getElementById("confirm")).style.display = "block";
        //read in confirmation
        (<HTMLElement>document.getElementById("fullName")).innerHTML = this.fname + "  "  + this.lname;
        (<HTMLElement>document.getElementById("grad")).innerHTML = this.gradYr;
        (<HTMLElement>document.getElementById("email")).innerHTML = this.email;
        (<HTMLElement>document.getElementById("disc")).innerHTML = this.discord;
        (<HTMLElement>document.getElementById("discId")).innerHTML = this.discordId;
        var list = "";
        for(var i = 0; i < this.currentClasses.length; i++){
          list += "<div class='row'>";
          list += "<div class='col-12'><p class='card-text'>" + this.currentClasses[i] + "</p></div>";
        }
        (<HTMLElement>document.getElementById("currentList")).innerHTML = list;
        list = "";

        for(var i = 0; i < this.prevClasses.length; i ++){
          list += "<div class='row'>";
          list += "<div class='col-12'><p class='card-text'>" + this.prevClasses[i] + "</p></div>";
        }
        (<HTMLElement>document.getElementById("prevList")).innerHTML = list;
    }
}

public prevStep(step:HTMLElement){
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if(step.id == "current"){
        //hide current step and show last step
        (<HTMLElement>document.getElementById("currentClasses")).style.display = "none";
        (<HTMLElement>document.getElementById("basicInfo")).style.display = "block";
    }
    else if(step.id == "previous"){
        //hide current step and show last step
        (<HTMLElement>document.getElementById("previousClasses")).style.display = "none";
        (<HTMLElement>document.getElementById("currentClasses")).style.display = "block";
        //read in last step with previous choices
    }
    else if(step.id == "confirmInfo"){
        (<HTMLElement>document.getElementById("confirm")).style.display = "none";
        (<HTMLElement>document.getElementById("previousClasses")).style.display = "block";
    }
}

  //upload new user to db
  public register(){
    //sample schema for users
    /*
        {
            id:
            name: 
            user:
            password:
            gradYr:
            email:
            discord:
            current: []
            prev: []
            reqs: []
        }
    */
    //var id = Math.floor(Math.random() * (1000000 - 10000 + 1)) + 10000;
    
    var obj = {
      "id" : this.newId,
      "name" : this.fname + " " + this.lname,
      //"user" : this.user,
      //"password" : this.password,
      "gradYr" : this.gradYr,
      "email" : this.email,
      "discord" : this.discord,
      "discordId": this.discordId,
      "current" : this.currentClasses,
      "prev" : this.prevClasses,
      "reqs" : this.reqs
    };

    var msg = JSON.stringify(obj);

    //post request to user collection
    this.httpService.sendPostRequest("user/add", JSON.parse(msg)).subscribe((res) => {
      this.data = res;
        if(this.data.Insert == "Success"){
          //reroute to profile page
          this.idSend.emit(obj.id);
          this.profileReroute.emit("profile");
        }
    });
    
  }

  public selectClass(course:HTMLElement){
    //remove course from list

    if((<HTMLElement>course).classList.contains("select")){
        course.classList.remove("select");
        //current
        if(course.classList.contains("current")){
            var removed = course.innerHTML;
            var newStr = "";
            for(var i = 0; i < this.currentClasses.length; i++){
                if(this.currentClasses[i] == removed){
                    var temp = this.currentClasses[this.currentClasses.length - 1];
                    this.currentClasses[this.currentClasses.length - 1] = this.currentClasses[i];
                    this.currentClasses[i] = temp;
                    this.currentClasses.pop();
                    this.currentClasses = this.currentClasses.filter(function( element:any ) {
                      return element != undefined;
                   });
                }
            }
            //prefix
            var prefix = course.innerHTML.split("-")[0];
            var contains = false;
            for(var i = 0; i < this.currentClasses.length; i++){
              if(this.currentClasses[i].includes(prefix)){
                contains = true;
                i = this.currentClasses.length;
              }
            }
            if(!contains){
                (<HTMLElement>document.getElementById("current" + prefix.toLowerCase())).classList.remove("select");
            }
        }
        else{//previous
            var removed = course.innerHTML;
            var newStr = "";
            for(var i = 0; i < this.prevClasses.length; i++){
              if(this.prevClasses[i] == removed){
                  var temp = this.prevClasses[this.prevClasses.length - 1];
                  this.prevClasses[this.prevClasses.length - 1] = this.prevClasses[i];
                  this.prevClasses[i] = temp;
                  this.prevClasses.pop();
                  this.prevClasses = this.prevClasses.filter(function( element:any ) {
                    return element != undefined;
                 });
              }
          }
          //prefix
          var prefix = course.innerHTML.split("-")[0];
          var contains = false;
          for(var i = 0; i < this.prevClasses.length; i++){
            if(this.prevClasses[i].includes(prefix)){
              contains = true;
              i = this.prevClasses.length;
            }
          }
          if(!contains){
              (<HTMLElement>document.getElementById("prev" + prefix.toLowerCase())).classList.remove("select");
          }
        }
    }//add course to list
    else{
        //find class from opposite class selection
        if((<HTMLElement>course).classList.contains("current")){
            var prevs = document.getElementsByClassName("prev");
            for(var i = 0; i < prevs.length; i++){
                if(prevs[i].innerHTML == course.innerHTML && (<HTMLElement>prevs[i]).classList.contains("select")){
                    alert("Already selected class in Previous Classes");
                    return;
                }
            }
        }
        if((<HTMLElement>course).classList.contains("prev")){
            var currents = document.getElementsByClassName("current");
            for(var i = 0; i < currents.length; i++){
                if(currents[i].innerHTML == course.innerHTML && (<HTMLElement>currents[i]).classList.contains("select")){
                    alert("Already selected class in Current Classes");
                    return;
                }
            }
        }
        
        (<HTMLElement>course).classList.add("select");
        var prefix = course.innerHTML;
        //current
        if((<HTMLElement>course).classList.contains("current")){
            if(!(<HTMLElement>document.getElementById("current" + prefix.split("-")[0].toLowerCase())).classList.contains("select")){
                (<HTMLElement>document.getElementById("current" + prefix.split("-")[0].toLowerCase())).classList.add("select");
            }
            this.currentClasses.push(prefix);
        }
        else{//previous
            if(!(<HTMLElement>document.getElementById("prev" + prefix.split("-")[0].toLowerCase())).classList.contains("select")){
                (<HTMLElement>document.getElementById("prev" + prefix.split("-")[0].toLowerCase())).classList.add("select");
            }
            this.prevClasses.push(prefix);
        }
    }
}

//DROPDOWN FUNCTION
public dropdown(target:HTMLElement) {
    const dropMenu = target.nextElementSibling;
    var accordions = document.getElementsByClassName("accordion");
    for(var i = 0; i < accordions.length; i++){
        if(accordions[i].id != (<HTMLElement>dropMenu).id){
          (<HTMLElement>accordions[i]).style.display = "none";
        }
    }
    //Show dropdown for clicked content
    if((<HTMLElement>dropMenu).style.display === "block"){
      (<HTMLElement>dropMenu).style.display = "none";
    }
    else{
      (<HTMLElement>dropMenu).style.display = "block";
    }
}

  public loadCurrentClasses(){
    this.httpService.sendGetRequest('courses').subscribe((res) => {
      this.data = res;
      /*
      <div class = "accordion" id = "artsAccordion">
                    <li #currentARTS1 class = "current course" (click) = "selectClass(currentARTS1)">ARTS 1</li>
                    <li #currentARTS2 class = "current course" (click) = "selectClass(currentARTS2)">ARTS 2</li>
                    <li #currentARTS3 class = "current course" (click) = "selectClass(currentARTS3)">ARTS 3</li>
                </div>
      */
      for(var i = 0; i < this.data.length; i++){
        var courses = this.data[i].courses;
        var prefix = this.data[i].code.toLowerCase();
        var dropdown = document.getElementById(prefix + "AccordionCur");
        //alert(prefix + "Accordion");
        //alert((<HTMLElement>dropdown).id);
        //var after = (<HTMLElement>dropdown).querySelectorAll('p');
        //var str = "";
        for(var j = 0; j < courses.length; j++){
          //str += "<li #current" + courses[j].id + "class = 'current course ' (click) = 'selectClass(current" + courses[j].id + ")'>" + courses[j].id + " " + courses[j].title + "</li>";
          const elem = document.createElement('li');
          elem.classList.add('current');
          elem.classList.add('course');
          elem.id = "current" + courses[j].id;
          //elem.type = 'button';
          elem.addEventListener('click', (e) => {
            this.selectClass(elem);//your typescript function
          });
          elem.innerHTML = courses[j].id + " " + courses[j].title;
          dropdown?.appendChild(elem);
          //after[0].insertAdjacentHTML("afterend", elem);
        }
        //alert((<HTMLElement>dropdown).id);
        //(<HTMLElement>dropdown).innerHTML = str;
      }
    });
  }

  public loadPrevClasses(){
    this.httpService.sendGetRequest('courses').subscribe((res) => {
      this.data = res;
      /*
      <div class = "accordion" id = "artsAccordion">
                    <li #currentARTS1 class = "current course" (click) = "selectClass(currentARTS1)">ARTS 1</li>
                    <li #currentARTS2 class = "current course" (click) = "selectClass(currentARTS2)">ARTS 2</li>
                    <li #currentARTS3 class = "current course" (click) = "selectClass(currentARTS3)">ARTS 3</li>
                </div>
      */
      for(var i = 0; i < this.data.length; i++){
        var courses = this.data[i].courses;
        var prefix = this.data[i].code.toLowerCase();
        var dropdown = document.getElementById(prefix + "AccordionPrev");
        //alert(prefix + "Accordion");
        //alert((<HTMLElement>dropdown).id);
        //var after = (<HTMLElement>dropdown).querySelectorAll('p');
        //var str = "";
        for(var j = 0; j < courses.length; j++){
          //str += "<li #current" + courses[j].id + "class = 'current course ' (click) = 'selectClass(current" + courses[j].id + ")'>" + courses[j].id + " " + courses[j].title + "</li>";
          const elem = document.createElement('li');
          elem.classList.add('prev');
          elem.classList.add('course');
          elem.id = "prev" + courses[j].id;
          //elem.type = 'button';
          elem.addEventListener('click', (e) => {
            this.selectClass(elem);//your typescript function
          });
          elem.innerHTML = courses[j].id + " " + courses[j].title;
          dropdown?.appendChild(elem);
          //after[0].insertAdjacentHTML("afterend", elem);
        }
        //alert((<HTMLElement>dropdown).id);
        //(<HTMLElement>dropdown).innerHTML = str;
      }
    });    
  }


}
