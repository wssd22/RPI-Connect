import { Component, Input, Output, OnInit, ElementRef } from '@angular/core';
import { HttpService } from '../http.service';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MyRequestsComponent implements OnInit {

  @Input() myRequestsShow:boolean = false;
  @Input() profileId = 0;
  private data:any = [];

  card1:boolean = false;
  card2:boolean = false;
  card3:boolean = false;
  card4:boolean = false;
  card5:boolean = false;

  card1Date:string = "";
  card2Date:string = "";
  card3Date:string = "";
  card4Date:string = "";
  card5Date:string = "";

  activeReqs:number = 0;
  answeredReqs:number = 0;
  expiredReqs:number = 0;

  activeReqIndex:number = 0;
  answeredReqIndex:number = 0;
  expiredReqIndex:number = 0;

  year:number = 0;
  month:number = 0;
  day:number = 0;

  constructor(private httpService: HttpService, private elRef: ElementRef) { }

  ngOnInit(): void {
    
    
  }

  public addRequest(course:HTMLElement, msg:HTMLElement){
    //Request Schema
  /*
    {
      reqId:
      msg: 
      class:
      datePosted:
      status:
      userId:
      userName:
      answerId:
    }
  */
    if((<HTMLInputElement>msg).value == ""){
      alert("Please enter a message for your request");
      return;
    }
    if((<HTMLInputElement>course).value == ""){
      alert("Please enter a message for your request");
      return;
    }
    var reqClass = (<HTMLInputElement>course).value;
    var reqMsg = (<HTMLInputElement>msg).value
    var name = "";
    var id = Math.floor(Math.random() * (1000000 - 10000 + 1)) + 10000;
    //get name
    this.httpService.sendGetRequest("user/" + this.profileId.toString()).subscribe((res) => {
      
      this.data = res;
      name = this.data.name;
      var current = this.data.current;
      var enrolled = false;
      
      for(var i = 0; i < current.length; i++){
        
        if(current[i] == reqClass){
          
          
          enrolled = true;
          i = current.length;
        }
      }
      if(!enrolled){
        alert("You are not currently enrolled in " + reqClass + " or it is an invalid class");
        (<HTMLInputElement>course).value = "";
        return;
      }
      else{
        //add reqId
        var query = '{"id" :' + this.profileId + '}';
        this.httpService.sendPutRequest("user/req/" + id.toString(), JSON.parse(query)).subscribe((res) => {

        });
      }

      var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    
    //date = date.slice(0,9);
    var obj = {
      "reqId" : id,
      "msg" : reqMsg,
      "class" : reqClass,
      "datePosted" : date,
      "daysLeft" : 14,
      "status" : "active",
      "userId" : this.profileId,
      "userName" : name,
      "answerId" : 0
    };

    var req = JSON.stringify(obj);

    this.httpService.sendPostRequest("req", JSON.parse(req)).subscribe((res) => {
      
    });

    });
    (<HTMLInputElement>course).value = "";
    (<HTMLInputElement>msg).value = "";
    alert("New Request Added");
    this.loadRequests();
  }

  public loadRequests(){
    //update req dates
    //increment daysLeft for all requests
    

    //get requests
    this.httpService.sendGetRequest("req").subscribe((res) =>{
      var act = 0;
      var ans = 0;
      var exp = 0;

      this.data = res;
      var actData = [];
      for(var i = 0; i < this.data.length; i++){
        if(this.data[i].userId == this.profileId){
        if(this.data[0].status == "active"){
          act++;
          actData.push(this.data[i]);
        }
        else if(this.data[0].status == "answered"){
          ans++;
        }
        else{
          exp++;
        }
      }
      }
      this.activeReqs = act;
      this.answeredReqs = ans;
      this.expiredReqs = exp;
    
     var str = "";

     var prev = document.getElementById("previous");
     var next = document.getElementById("next");
    if(this.activeReqIndex == 0){
      (<HTMLElement>prev).style.display = "none";
      
    }
    else{
      (<HTMLElement>prev).style.display = "inline-block";
    }
    if(this.activeReqIndex+4 >= this.activeReqs){
      (<HTMLElement>next).style.display = "none";
    }
    else{
      (<HTMLElement>next).style.display = "inline-block";
    }
    //get Active Requests
    
  
    
    //DISPLAY 1st 5 Active Requests
    

      var i = this.activeReqIndex;
        var top = 0;
        if(i < actData.length ){
          (<HTMLElement>document.getElementById("actcard1Id")).innerHTML = actData[i].reqId;
          (<HTMLElement>document.getElementById("actcard1Class")).innerHTML = actData[i].class;
          (<HTMLElement>document.getElementById("actcard1Msg")).innerHTML = actData[i].msg;
          (<HTMLElement>document.getElementById("actcard1Days")).innerHTML = actData[i].daysLeft + " days";
          if(actData[i].daysLeft >= 7){
            (<HTMLElement>document.getElementById("actcard1Days")).classList.add("card-days-green");
          }
          else{
            (<HTMLElement>document.getElementById("actcard1Days")).classList.add("card-days-red");
          }
          (<HTMLElement>document.getElementById("actcard1Date")).innerHTML = actData[i].datePosted;
          top++;
          (<HTMLElement>document.getElementById("actcard1")).style.display = "inline";
          (<HTMLElement>document.getElementById("actcard11")).style.display = "inline";
        }else{
          (<HTMLElement>document.getElementById("actcard1")).style.display = "none";
          (<HTMLElement>document.getElementById("actcard11")).style.display = "none";
        }
        if(i+1 < actData.length){
          (<HTMLElement>document.getElementById("actcard2Id")).innerHTML = actData[i+1].reqId;
          (<HTMLElement>document.getElementById("actcard2Class")).innerHTML = actData[i+1].class;
          (<HTMLElement>document.getElementById("actcard2Msg")).innerHTML = actData[i+1].msg;
          (<HTMLElement>document.getElementById("actcard2Days")).innerHTML = actData[i+1].daysLeft + " days";
          if(actData[i+1].daysLeft >= 7){
            (<HTMLElement>document.getElementById("actcard2Days")).classList.add("card-days-green");
          }
          else{
            (<HTMLElement>document.getElementById("actcard2Days")).classList.add("card-days-red");
          }
          (<HTMLElement>document.getElementById("actcard1Date")).innerHTML = actData[i+1].datePosted;
          top++;
          (<HTMLElement>document.getElementById("actcard2")).style.display = "inline";
          (<HTMLElement>document.getElementById("actcard21")).style.display = "inline";
        }else{
          (<HTMLElement>document.getElementById("actcard2")).style.display = "none";
          (<HTMLElement>document.getElementById("actcard21")).style.display = "none";
        }
        if(i+2 < actData.length){
          (<HTMLElement>document.getElementById("actcard3Id")).innerHTML = actData[i+2].reqId;
          (<HTMLElement>document.getElementById("actcard3Class")).innerHTML = actData[i+2].class;
          (<HTMLElement>document.getElementById("actcard3Msg")).innerHTML = actData[i+2].msg;
          (<HTMLElement>document.getElementById("actcard3Days")).innerHTML = actData[i+2].daysLeft + " days";
          if(actData[i+2].daysLeft >= 7){
            (<HTMLElement>document.getElementById("actcard3Days")).classList.add("card-days-green");
          }
          else{
            (<HTMLElement>document.getElementById("actcard3Days")).classList.add("card-days-red");
          }
          (<HTMLElement>document.getElementById("actcard3Date")).innerHTML = actData[i+2].datePosted;
          top++;
          (<HTMLElement>document.getElementById("actcard3")).style.display = "inline";
          (<HTMLElement>document.getElementById("actcard31")).style.display = "inline";
        }else{
          (<HTMLElement>document.getElementById("actcard3")).style.display = "none";
          (<HTMLElement>document.getElementById("actcard31")).style.display = "none";
        }
        if(i+3 < actData.length){
          (<HTMLElement>document.getElementById("actcard4Id")).innerHTML = actData[i+3].reqId;
          (<HTMLElement>document.getElementById("actcard4Class")).innerHTML = actData[i+3].class;
          (<HTMLElement>document.getElementById("actcard4Msg")).innerHTML = actData[i+3].msg;
          (<HTMLElement>document.getElementById("actcard4Days")).innerHTML = actData[i+3].daysLeft + " days";
          if(actData[i+3].daysLeft >= 7){
            (<HTMLElement>document.getElementById("actcard4Days")).classList.add("card-days-green");
          }
          else{
            (<HTMLElement>document.getElementById("actcard4Days")).classList.add("card-days-red");
          }
          (<HTMLElement>document.getElementById("actcard4Date")).innerHTML = actData[i+3].datePosted;
          top++;
          (<HTMLElement>document.getElementById("actcard4")).style.display = "inline";
          (<HTMLElement>document.getElementById("actcard41")).style.display = "inline";
        }else{
          (<HTMLElement>document.getElementById("actcard4")).style.display = "none";
          (<HTMLElement>document.getElementById("actcard41")).style.display = "none";
        }
        if(i+4 < actData.length){
          (<HTMLElement>document.getElementById("actcard5Id")).innerHTML = actData[i+4].reqId;
          (<HTMLElement>document.getElementById("actcard5Class")).innerHTML = actData[i+4].class;
          (<HTMLElement>document.getElementById("actcard5Msg")).innerHTML = actData[i+4].msg;
          (<HTMLElement>document.getElementById("actcard5Days")).innerHTML = actData[i+4].daysLeft + " days";
          if(actData[i+4].daysLeft >= 7){
            (<HTMLElement>document.getElementById("actcard5Days")).classList.add("card-days-green");
          }
          else{
            (<HTMLElement>document.getElementById("actcard5Days")).classList.add("card-days-red");
          }
          (<HTMLElement>document.getElementById("actcard5Date")).innerHTML = actData[i+4].datePosted;
          top++;
          (<HTMLElement>document.getElementById("actcard5")).style.display = "inline";
          (<HTMLElement>document.getElementById("actcard51")).style.display = "inline";
        }else{
          (<HTMLElement>document.getElementById("actcard5")).style.display = "none";
          (<HTMLElement>document.getElementById("actcard51")).style.display = "none";
        }
        i = i+4;
        
        if(actData.length > 0){
          if(actData.length - this.activeReqIndex != 1){
          (<HTMLElement>document.getElementById("actstep")).innerHTML = this.activeReqIndex+1 + " - " + (this.activeReqIndex+top) + " of " + actData.length;
        }
        else{
          (<HTMLElement>document.getElementById("actstep")).innerHTML = this.activeReqIndex+1 + " of " + actData.length;
        }
      }
      else{
        (<HTMLElement>document.getElementById("actstep")).innerHTML = "No Active Requests";
      }
      
    });
  }

  //edit request
  public openReqEdit(){

  }

  public delReq(targetReq:HTMLElement){
    this.httpService.sendDeleteRequest("req/" + targetReq.innerHTML+"?user=" + this.profileId.toString(), "").subscribe((res) =>{
      
    });
    
    /*if(targetReq.id.includes("act")){
      alert("hello");
      this.activeReqIndex--;
    }*/
      
    this.loadRequests();
  }

  public incrementReqs(direction:HTMLElement){
    if(direction.id == "previous"){
      this.activeReqIndex -= 5;
    }
    else{
      this.activeReqIndex += 5;
    }
    this.loadRequests()
  }
}
