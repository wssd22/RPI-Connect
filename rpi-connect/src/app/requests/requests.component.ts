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
  @Input() profId:number = 0;
  @Output() prevEmitter = new EventEmitter();
  @Output() currentEmitter = new EventEmitter();
  private data:any = [];
  private data2:any = [];
  @Input() userPrev:any = [];
  @Input() userCurrent:any = [];

  view:string = "all";
  poster:string = "";
  search:any = [];
  
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

  public loadClassRequests(container:HTMLElement, status:HTMLElement, destination:HTMLElement){
    //detect checked classes

    var allClassElements = (<HTMLElement>container).querySelectorAll('.form-check-input');
    var selected = false;
 
    for(var i = 0; i < allClassElements.length; i++){
      if((<HTMLInputElement>allClassElements[i]).checked){
        selected = true;
        this.search.push((<HTMLInputElement>allClassElements[i]).name);
      }
    }
    if(!selected){
      alert("Please choose at least one class to find requests");
      return;
    }

    var allStatusElements = (<HTMLElement>status).querySelectorAll('.form-check-input');
    selected = false;
    var stat = "";
 
    for(var i = 0; i < allStatusElements.length; i++){
      if((<HTMLInputElement>allStatusElements[i]).checked){
        selected = true;
        stat = (<HTMLInputElement>allStatusElements[i]).name;
      }
    }
    if(!selected){
      alert("Please choose at least one class to find requests");
      return;
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
    this.httpService.sendGetRequest('req').subscribe((res) => {
      this.data = res;
      
      for(var i = 0; i < this.data.length; i++){
        for(var j = 0; j < this.search.length; j++){
          if(this.search[j] == this.data[i].class && (this.data[i].status == stat || stat == 'all')){
            var str = ""
            var card = document.createElement("div");
            card.classList.add("card");
            //str += '<div class="card">';
            str += '<div class="card-body">';
            str += '<p class="card-title"><b>' + this.data[i].class + '</b></p>';
            if(this.data[i].daysLeft >= 7 || this.data[i].status == 'answered'){
              str += '<div class="card-days card-days-green" style="background-color: green;">' + this.data[i].status + '</div>';
            }
            else{
              str += '<div class="card-days card-days-red" style="background-color: red;">' + this.data[i].status + '</div>';
            }
              if(this.profId == this.data[i].userId){
              str += '<p class="card-text">Posted by: You</p>'; 
            }
            else{
              str+='<p class="card-text">Posted by: ' + this.data[i].userName + '</p>';
            }
            
            str += '<p class="card-text">' + this.data[i].msg + '</p>';
            str += '<p class="card-text" style="display: inline;"><small>Created: ' + this.data[i].datePosted + '</small></p>';
            str += '</div>';
            card.innerHTML = str;

            destination.appendChild(card);
            if(this.profId != this.data[i].userId && this.data[i].status == 'active'){
              const elem = document.createElement('input');
              elem.type = 'text';
              elem.style.display = 'none';
              elem.id = 'answerMsg' + this.data[i].reqId;
              card.appendChild(elem);
            const button = document.createElement('button');
            button.id = this.data[i].reqId;
              
              button.innerText = 'Answer';
              button.classList.add("btn");
              button.classList.add("btn-outline-danger");
              button.classList.add("btn-sm");
              
              card.appendChild(button);
              
              const button2 = document.createElement('button');
              button2.id = "conf" + this.data[i].reqId;
              button2.addEventListener('click', (e) => {
              this.answerReq(Number(button.id), elem);//your typescript function
              });
              button2.innerText = 'Confirm';
              button2.classList.add("btn");
              button2.classList.add("btn-outline-danger");
              button2.classList.add("btn-sm");
              button2.style.display = 'none';             
              
              card.appendChild(button2);

              const button3 = document.createElement('button');
              button3.id = "canc" + this.data[i].reqId;
              button3.addEventListener('click', (e) => {
              this.hideAnswer(elem, button2, button3, button);//your typescript function
              });
              button3.innerText = 'Cancel';
              button3.classList.add("btn");
              button3.classList.add("btn-outline-danger");
              button3.classList.add("btn-sm");
              button3.style.display = 'none';
              
              card.appendChild(button3);
              button.addEventListener('click', (e) => {
                this.showAnswer(elem, button2, button3, button);//your typescript function
              });
            }
          }
        }
      }
      
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

  public answerReq(reqId:number, elem:HTMLInputElement){
    if(elem.value == ""){
      alert("Cannot submit a blank answer to a request");
      return;
    }
    //add answerMsg to request
    //put answerMsg
    var query = {answerMsg : elem.value};
    var obj = JSON.stringify(query);
    this.httpService.sendPutRequest('req/' + reqId, JSON.parse(obj)).subscribe((res) => {

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

      this.loadClassRequests(<HTMLElement>document.getElementById('container'), <HTMLElement>document.getElementById('status'), <HTMLElement>document.getElementById('right-side'));
    });

    
  }

}
