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

  view:string = "all";
  poster:string = "";
  search:any = [];

  classIndex:number = 0;
  totalClass:number = 0;
  classData:any = [];
  
  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    
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
            const button = document.createElement('button');
            button.id = courses[i].reqId;
              button.addEventListener('click', (e) => {
              this.answerReq(Number(button.id));//your typescript function
              });
              button.innerText = 'Answer';
              button.classList.add("btn");
              button.classList.add("btn-outline-danger");
              button.classList.add("btn-sm");
              
              card.appendChild(button);
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

  public answerReq(reqId:number){
    
    //add answerMsg to request
    //put answerMsg
    //var query = {answerMsg : elem.value};
    //var obj = JSON.stringify(query);
    /*this.httpService.sendPutRequest('req/' + reqId, JSON.parse(obj)).subscribe((res) => {

    });
    //put answerId
    var query2 = {answerId : this.profId};
    obj = JSON.stringify(query2);
    this.httpService.sendPutRequest('req/' + reqId, JSON.parse(obj)).subscribe((res) => {

    });
    //change answerStatus
    var query3 = {status : 'pending'};
    obj = JSON.stringify(query3);
    this.httpService.sendPutRequest('req/' + reqId, JSON.parse(obj)).subscribe((res) => {
      this.hideAnswer(elem, <HTMLElement>document.getElementById('conf' + reqId.toString()), <HTMLElement>document.getElementById('canc' + reqId.toString()), <HTMLElement>document.getElementById(reqId.toString()));

      this.loadClassRequests(<HTMLElement>document.getElementById('container'));
    });*/

    
  }

}
