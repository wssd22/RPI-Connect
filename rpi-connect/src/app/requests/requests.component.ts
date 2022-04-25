import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
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

  public loadClassRequests(container:HTMLElement, destination:HTMLElement){
    //detect checked classes

    var allChildElements = (<HTMLElement>container).querySelectorAll('.form-check-input');

    var selected = false;
 
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
          if(this.search[j] == this.data[i].class && this.data[i].status == "active"){
            var str = ""
            var card = document.createElement("div");
            card.classList.add("card");
            //str += '<div class="card">';
            str += '<div class="card-body">';
            str += '<p class="card-title"><b>' + this.data[i].class + '</b></p>';
            str += '<div class="card-days card-days-green" style="background-color: green;">' + this.data[i].status + '</div>';
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
            const button = document.createElement('button');
            button.id = this.data[i].reqId;
              button.addEventListener('click', (e) => {
                this.answerReq(Number(button.id));//your typescript function
                this.httpService.sendGetRequest("discordInfo/"+this.profId+"/"+button.id).subscribe((res) => {
                  this.data2 = res;
                  console.log(res);
                  var msg = JSON.stringify(this.data2);
            
                  this.httpService.sendPostRequest("postToDiscord", JSON.parse(msg)).subscribe((res) => {
                    this.data = res;
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
      
    });
  }

  public answerReq(reqId:number){
    alert(reqId);
    
  }

}
