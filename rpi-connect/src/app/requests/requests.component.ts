import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RequestsComponent implements OnInit {
  @Input() reqShow:boolean = false;
  @Input() profId:string = '0';
  @Output() prevEmitter = new EventEmitter();
  @Output() currentEmitter = new EventEmitter();
  private data:any = [];
  private data2:any = [];
  @Input() userPrev:any = [];
  @Input() userCurrent:any = [];

  private className:string = "";
  private message:string = "";
  private userId:number = 0;
  private discord:number = 0;
  private discordId:string = "";

  view:string = "all";
  poster:string = "";
  search:any = [];

  classIndex:number = 0;
  totalClass:number = 0;
  classData:any = [];
  
  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    
  }
  
  public sendToDiscord() {
    var url = "https://discord.com/api/webhooks/967520024338255892/oZYqEmgjfEovhjzOuOPwJJOd7uug99znSF4wajZGFwMi0X9P1vxru4oCTXRxgoXc771r";
    var msg = "here";
    
  }

 public currentOrPast(type:HTMLElement){
  //choose view
  if(type.id == "all"){
    this.view = "all";
  }
  else if(type.id == "current"){
    this.view = "current";
  }
  else{
    this.view = "past";
  }
  
  //load new view
  this.loadInterface();
 }

 public incrementReqs(direction:HTMLElement){
  if(direction.id == "previous"){
    this.classIndex -= 10;
  }
  else if(direction.id == "next"){
    this.classIndex += 10;
  }

  this.loadClassRequests(<HTMLElement>document.getElementById('container'));
 }

 public loadInterface(){
   this.httpService.sendGetRequest('user/' + this.profId.toString()).subscribe((res) => {
    this.data = res;
    
    //get applicable courses
    var courses = [];
    if(this.view == "past" || this.view == "all"){
      for(var i = 0; i < this.data.prev.length; i++){
        courses.push(this.data.prev[i]);
      }
    }
    if(this.view == "current" || this.view == "all"){
      for(var i = 0; i < this.data.current.length; i++){
        courses.push(this.data.current[i]);
      }
    }
    
    //read in courses to buttons
    /*
    <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="exampleCheck1">
                    <label class="form-check-label" for="exampleCheck1">BMED</label>
                </div>
    */
   var str = "";
   var container = document.getElementById("container");
   for(var i = 0; i < courses.length; i++){
    str += '<div class="form-check">';
    str += '<input type="checkbox" class="form-check-input" id="exampleCheck' + i + '" name="' + courses[i] + '">';
    str += '<label class="form-check-label" for="exampleCheck' + i + '">' + courses[i] + '</label>';
    str += '</div>';
   }
   (<HTMLElement>container).innerHTML = str;
   });
    
 }


  public loadClassRequests(container:HTMLElement){
    //detect checked classes

    var allChildElements = (<HTMLElement>container).querySelectorAll('.form-check-input');
    var btns;
    if((<HTMLElement>document.getElementById('dest'))){
     btns = (<HTMLElement>document.getElementById('dest')).querySelectorAll('.btn');
     for(var i = 0; i < btns.length; i++){
      (<HTMLElement>btns[i]).style.display = 'none';
     }
    }
   
    var selected = false;
    this.search = [];
    for(var i = 0; i < allChildElements.length; i++){
      if((<HTMLInputElement>allChildElements[i]).checked){
        selected = true;
        this.search.push((<HTMLInputElement>allChildElements[i]).name);
      }
    }
    if(!selected){
      alert("Please choose at least one class to find requests");
      return;
    }

    var cards = document.getElementsByClassName('card');
    var body = document.getElementsByClassName('card-body');
    for(var i = 0; i < cards.length; i++){
      (<HTMLElement>cards[i]).style.display = 'none';
    }
    for(var i = 0; i < body.length; i++){
      (<HTMLElement>body[i]).style.display = 'none';
    }
    
    //get requests for selected classes
    /*
    <div class="card">
                <div class="card-body">
                    <p class="card-title"><b>BIOL 1010 Intro to Biology</b></p>
                    <div class="card-days card-days-green" style="background-color: gray;">Inactive</div>
                    <p class="card-text">What are the functions of mitochondria?</p>
                    <p class="card-text" style="display: inline;"><small>Created: 1/1/2022</small></p>
                    <button class="btn btn-outline-danger btn-sm" style="display: inline;">Remove</button>
                </div>
            </div>
    */
   var outer = document.getElementById('outer');
    (<HTMLElement>outer).innerHTML = "";
    var dest = document.createElement('div');
    dest.id = 'destination';
    outer?.appendChild(dest);
    this.httpService.sendGetRequest('req').subscribe((res) => {
      this.data = res;
      var courses = [];
      for(var i = 0; i < this.data.length; i++){
        for(var j = 0; j < this.search.length; j++){
          if(this.search[j] == this.data[i].class && this.data[i].status == "active"){
            courses.push(this.data[i]);
            
          }
        }
      }
      
      //initialize variables
      this.classData = courses;
      this.totalClass = courses.length;
      //alert(courses.length);
      if(this.totalClass == 0){
        dest.innerHTML = "<p id='msg'>There are no requests for the included classes</p>";
        return;
      }
      else{
        //steps
        var top = 0;
        if(courses.length - this.classIndex >= 10){
          top = 10;
        }
        else{
          top = courses.length - this.classIndex;
        }
        var step = <HTMLElement>document.getElementById("step");
        if(courses.length - this.classIndex != 1){
          step.innerHTML = this.classIndex+1 + " - " + (this.classIndex+top) + " of " + courses.length;
        }
        else{
          (<HTMLElement>document.getElementById("step")).innerHTML = this.classIndex+1 + " of " + courses.length;
        }
        //buttons
        var prev = document.getElementById("previous");
        var next = document.getElementById("next");
        
        if(this.classIndex == 0){
          (<HTMLElement>prev).style.display = "none";
      
        }
        else{
          (<HTMLElement>prev).style.display = "inline-block";
        }
        if(this.classIndex+10 >= this.totalClass){
          (<HTMLElement>next).style.display = "none";
        }
        else{
          (<HTMLElement>next).style.display = "inline-block";
        }
        
      }
      
      for(var i = this.classIndex; i < this.classIndex+10; i++){
        for(var j = 0; j < this.search.length; j++){
        if(i < courses.length){
          if(this.search[j] == courses[i].class){

            var str = ""
            var card = document.createElement("div");
            card.classList.add("card");
            //str += '<div class="card">';
            str += '<div class="card-body">';
            str += '<p class="card-title"><b>' + courses[i].class + '</b></p>';
            str += '<div class="card-days card-days-green" style="background-color: green;">' + courses[i].status + '</div>'
             if(this.profId == courses[i].userId){
              str += '<p class="card-text">Posted by: You</p>'; 
            }
            else{
              str+='<p class="card-text">Posted by: ' + courses[i].userName + '</p>';
            }
            
            str += '<p class="card-text">' + courses[i].msg + '</p>';
            str += '<p class="card-text" style="display: inline;"><small>Created: ' + courses[i].datePosted + '</small></p>';
            str += '</div>';
            card.innerHTML = str;


            dest.appendChild(card);
            if(this.profId != courses[i].userId){
            const button = document.createElement('button');
            button.id = courses[i].reqId;
              button.addEventListener('click', (e) => {
                this.httpService.sendGetRequest("req/"+button.id).subscribe((res) => {
                  this.data2 = res;
                  this.className = this.data2.class;
                  this.message = this.data2.msg;
                  this.userId = this.data2.userId;
                  this.httpService.sendGetRequest("user/"+this.userId.toString()).subscribe((res) => {
                    this.data2 = res;
                    this.discordId = this.data2.discordId;
                    this.httpService.sendGetRequest("user/"+this.profId.toString()).subscribe((res) => {
                      this.data2 = res;
                      this.discord = this.data2.discord;
                      var msg = JSON.stringify({"className":this.className,"message":this.message,"discord":this.discord,"discordId":this.discordId});
                      this.httpService.sendPostRequest("postToDiscord", JSON.parse(msg)).subscribe((res) => {
                        console.log(res);
                      });
                    });
                  });
                });
                
              });
              button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16"><path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/></svg>Send Discord Notification';
              button.classList.add("btn");
              button.classList.add("btn-sm");
              button.style.backgroundColor = "#5865F2";
              button.style.color = "white";
              
              card.appendChild(button);
            }
            }
          }
        }
      }
      
      courses = [];

    });
  }

  public showAnswer(field:HTMLElement, btn1:HTMLElement, btn2:HTMLElement, btn3:HTMLElement){
    field.style.display = 'block';
    btn1.style.display = 'inline-block';
    btn2.style.display = 'inline-block';
    btn3.style.display = 'none';
  }

  public hideAnswer(field:HTMLElement, btn1:HTMLElement, btn2:HTMLElement, btn3:HTMLElement){
    field.style.display = 'none';
    btn1.style.display = 'none';
    btn2.style.display = 'none';
    btn3.style.display = 'inline-block';
  }

}
