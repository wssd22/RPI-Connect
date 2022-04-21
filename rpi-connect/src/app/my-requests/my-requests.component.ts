import { Component, Input, Output, OnInit, ElementRef } from '@angular/core';
import { HttpService } from '../http.service';
import { ViewEncapsulation } from '@angular/core';
import { empty } from 'rxjs';

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
  private data2:any = [];

  pendingReqs:number = 0;
  activeReqs:number = 0;
  answeredReqs:number = 0;
  expiredReqs:number = 0;

  pendingReqIndex:number = 0;
  activeReqIndex:number = 0;
  answeredReqIndex:number = 0;
  expiredReqIndex:number = 0;

  activeData:any = [];
  expiredData:any = [];
  answeredData:any = [];
  pendingData:any = [];

  year:number = 0;
  month:number = 0;
  day:number = 0;

  filter:any = ['all'];

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
        this.httpService.sendPutRequest("user/reqs/" + id.toString(), JSON.parse(query)).subscribe((res) => {

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
      (<HTMLInputElement>course).value = "";
      (<HTMLInputElement>msg).value = "";
      alert("New Request Added to " + reqClass);
      this.loadRequests();
    });

    });
    
  }

  public filters(){
    this.httpService.sendGetRequest('user/' + this.profileId).subscribe((res) => {
      this.data = res;
      var str = "";
      var courses = [];
      for(var i = 0; i < this.data.current.length; i++){
        courses.push(this.data.current[i]);
      }
      str += '<div class="form-check">';
      str += '<input type="checkbox" checked class="form-check-input" id="all" name="all">';
      str += '<label class="form-check-label" for="all">All</label>';
      str += '</div>';
      for(var i = 0; i < courses.length; i++){
        str += '<div class="form-check">';
        str += '<input type="checkbox" class="form-check-input" id="class' + i + '" name="' + courses[i] + '">';
        str += '<label class="form-check-label" for="class' + i + '">' + courses[i] + '</label>';
        str += '</div>';
       }
       (<HTMLElement>document.getElementById('pendingFilter')).innerHTML = str;
       (<HTMLElement>document.getElementById('activeFilter')).innerHTML = str;
       (<HTMLElement>document.getElementById('answeredFilter')).innerHTML = str;
       (<HTMLElement>document.getElementById('expiredFilter')).innerHTML = str;
    });
    
  }

  public loadRequests(){
    //get requests
    this.httpService.sendGetRequest("req").subscribe((res) =>{
      var act = 0;
      var ans = 0;
      var exp = 0;
      var pen = 0;

      this.data = res;
      var actData = [];
      var expData = [];
      var ansData = [];
      var penData = [];
      for(var i = 0; i < this.data.length; i++){
        if(this.data[i].userId == this.profileId){
        if(this.data[i].status == "active"){
          act++;
          actData.push(this.data[i]);
        }
        else if(this.data[0].status == "answered"){
          ans++;
          ansData.push(this.data[i]);
        }
        else if(this.data[0].status == "pending"){
          pen++;
          penData.push(this.data[i]);
        }
        else{
          exp++;
          expData.push(this.data[i]);
        }
      }
      }
      //this might not work
      this.activeData = actData;
      this.expiredData = expData;
      this.pendingData = penData;
      this.answeredData = ansData;
      ///////////////////////////
      this.activeReqs = act;
      this.answeredReqs = ans;
      this.expiredReqs = exp;
      this.pendingReqs = pen;
    
     var str = "";
    //get Active Requests
    this.loadActive(actData);
    //get Expried Requests
    this.loadExp(expData);
    //get Answered Requests
    this.loadAns(ansData);
    //get Pending Requests
    this.loadPen(penData);
    });
  }

  //edit request
  public openReqEdit(showClass:HTMLElement, showMsg:HTMLElement, hideClass:HTMLElement, hideMsg:HTMLElement, showBtn1:HTMLElement, showBtn2:HTMLElement, hideBtn1:HTMLElement, hideBtn2:HTMLElement){
    (<HTMLElement>showClass).style.display = "inline-block";
    (<HTMLElement>showMsg).style.display = "block";
    (<HTMLElement>hideClass).style.display = "none";
    (<HTMLElement>hideMsg).style.display = "none";
    (<HTMLElement>showBtn1).style.display = "inline-block";
    (<HTMLElement>showBtn2).style.display = "inline-block";
    (<HTMLElement>hideBtn1).style.display = "none";
    (<HTMLElement>hideBtn2).style.display = "none";

  }

  public confirmEdit(reqId:number, course:HTMLInputElement, msg:HTMLInputElement, courseFill:HTMLElement, msgFill:HTMLElement,
      btn1:HTMLElement, btn2:HTMLElement, btn3:HTMLElement, btn4:HTMLElement){
    if((<HTMLInputElement>course).value == ""){
      alert("Please enter a valid course name to update request");
      return;
    }

    if((<HTMLInputElement>msg).value == ""){
      alert("Please enter a valid message to update request");
      return;
    }
    //check if course is a current course
    this.httpService.sendGetRequest("user/" + this.profileId.toString()).subscribe((res) => {
      this.data = res;
      var taking = false;
      for(var i = 0; i < this.data.current.length; i++){
        if(this.data.current[i] == (<HTMLInputElement>course).value){
          taking = true;
          i = this.data.current.length;
        }
      }
      if(!taking){
        alert("Must be currently taking a course to post a request to it");
        return;
      }
      
    });
    
    this.httpService.sendGetRequest("req/" + reqId.toString()).subscribe((res) => {
      this.data = res;
      if(this.data.msg != (<HTMLInputElement>msg).value){
        var obj = {msg : (<HTMLInputElement>msg).value};
        var query = JSON.stringify(obj);
        this.httpService.sendPutRequest("req/" + reqId.toString(), JSON.parse(query)).subscribe((res) => {

        });
        (<HTMLElement>msgFill).innerHTML = (<HTMLInputElement>msg).value;
      }
      if(this.data.class != (<HTMLInputElement>course).value){
        var obj2 = {class : (<HTMLInputElement>course).value};
        var query = JSON.stringify(obj2);
        this.httpService.sendPutRequest("req/" + reqId.toString(), JSON.parse(query)).subscribe((res) => {

        });
        (<HTMLElement>courseFill).innerHTML = (<HTMLInputElement>course).value;
      }
      this.openReqEdit(courseFill, msgFill, course, msg, btn1, btn2, btn3, btn4);
    });
    
  }

  public delReq(targetReq:number){
    this.httpService.sendDeleteRequest("req/" + targetReq.toString() +"?user=" + this.profileId.toString(), "").subscribe((res) =>{
      
    });
    
    /*if(targetReq.id.includes("act")){
      alert("hello");
      this.activeReqIndex--;
    }*/
      
    this.loadRequests();
  }

  public classFilter(classes:HTMLElement){
    var allClassElements = (<HTMLElement>classes).querySelectorAll('.form-check-input');
    var selected = false;
    //clear filter
    this.filter = [];
    for(var i = 0; i < allClassElements.length; i++){
      if((<HTMLInputElement>allClassElements[i]).checked && (<HTMLInputElement>allClassElements[i]).id == 'all'){
        selected = true;
        i = allClassElements.length;
      }
      else if((<HTMLInputElement>allClassElements[i]).checked){
        selected = true;
        this.filter.push((<HTMLInputElement>allClassElements[i]).name);
      }
    }
    if(!selected){
      alert("Please choose at least one class to find requests");
      return;
    }

    if(classes.id.includes('active')){
      this.reloadData('active');
    }
    else if(classes.id.includes('expired')){
      this.reloadData('expired');
    }
    else if(classes.id.includes('pending')){
      this.reloadData('pending');
    }
    else{//answered
      this.reloadData('answered');
    }
  }

  public reloadData(status:string){
    var tempData = [];
    if(status == 'active'){
      for(var i = 0; i < this.activeData.length; i++){
        for(var j = 0; j < this.filter.length; j++){
          if(this.activeData[i].class == this.filter[j] || this.filter[j] == 'all'){
            tempData.push(this.activeData[i]);
          }
        }
      }
      this.activeReqIndex = 0;
      this.activeReqs = tempData.length;
      this.loadActive(tempData);
    }
    if(status == 'answered'){
      for(var i = 0; i < this.answeredData.length; i++){
        for(var j = 0; j < this.filter.length; j++){
          if(this.answeredData[i].status == this.filter[j] || this.filter[j] == 'all'){
            tempData.push(this.answeredData[i]);
          }
        }
      }
      this.answeredReqIndex = 0;
      this.answeredReqs = tempData.length;
      this.loadAns(tempData);
    }
    if(status == 'pending'){
      for(var i = 0; i < this.pendingData.length; i++){
        for(var j = 0; j < this.filter.length; j++){
          if(this.pendingData[i].status == this.filter[j] || this.filter[j] == 'all'){
            tempData.push(this.pendingData[i]);
          }
        }
      }
      this.pendingReqIndex = 0;
      this.pendingReqs = tempData.length;
      this.loadPen(tempData);
    }
    if(status == 'expired'){
      for(var i = 0; i < this.expiredData.length; i++){
        for(var j = 0; j < this.filter.length; j++){
          if(this.expiredData[i].status == this.filter[j] || this.filter[j] == 'all'){
            tempData.push(this.expiredData[i]);
          }
        }
      }
      this.expiredReqIndex = 0;
      this.expiredReqs = tempData.length;
      this.loadExp(tempData);
    }
  }

  public incrementReqs(direction:HTMLElement){
    if(direction.id == "previousAct"){
      this.activeReqIndex -= 5;
    }
    else if(direction.id == "nextAct"){
      this.activeReqIndex += 5;
    }
    else if(direction.id == "previousExp"){
      this.expiredReqIndex -= 5;
    }
    else if(direction.id == "nextExp"){
      this.expiredReqIndex += 5;
    }
    else if(direction.id == "previousAns"){
      this.answeredReqIndex -= 5;
    }
    else if(direction.id == "nextAns"){
      this.answeredReqIndex += 5;
    }
    else if(direction.id == "previousPen"){
      this.pendingReqIndex -= 5;
    }
    else if(direction.id == "nextPen"){
      this.pendingReqIndex += 5;
    }
    this.loadRequests()
  }

  public confirmAnswer(id:number){
    //increment answerId's answered questions stat
    //get req to get ansId
    this.httpService.sendGetRequest('req/' + id.toString()).subscribe((res) => {
      this.data = res;
      var ansId = this.data.answerId;
      //get answer profile
      this.httpService.sendGetRequest('user/' + ansId.toString()).subscribe((res) => {
        //put incremented numAnsed to profile
        this.data2 = res;
        var newNum =  this.data2.numAnsed + 1;
        var query = {id : this.data2.id};
        var obj = JSON.stringify(query);
        this.httpService.sendPutRequest('user/numAnsed/' + newNum.toString(), JSON.parse(obj)).subscribe((res) => {

        });
      });
    });
    //change status to inactive
    var query = {status : 'answered'};
    var obj = JSON.stringify(query);
    this.httpService.sendPutRequest('req/' + id.toString(), JSON.parse(obj)).subscribe((res) => {
      this.loadRequests();
    });
    
  }

  public cancelAnswer(id:number){
    //change status back to active
    var query = {status : 'active'};
    var obj = JSON.stringify(query);
    this.httpService.sendPutRequest('req/' + id.toString(), JSON.parse(obj)).subscribe((res) => {

    });
    //set answerId to 0
    var query2 = {answerId : 0};
    obj = JSON.stringify(query2);
    this.httpService.sendPutRequest('req/' + id.toString(), JSON.parse(obj)).subscribe((res) => {

    });
    //set answerMsg to ''
    var query3 = {answerMsg : ''};
    obj = JSON.stringify(query3);
    this.httpService.sendPutRequest('req/' + id.toString(), JSON.parse(obj)).subscribe((res) => {
      this.loadRequests();
    });
  }

  public loadActive(actData:any){
    var prev = document.getElementById("previousAct");
     var next = document.getElementById("nextAct");
    if(this.activeReqIndex == 0){
      (<HTMLElement>prev).style.display = "none";
      
    }
    else{
      (<HTMLElement>prev).style.display = "inline-block";
    }
    if(this.activeReqIndex+5 >= this.activeReqs){
      (<HTMLElement>next).style.display = "none";
    }
    else{
      (<HTMLElement>next).style.display = "inline-block";
    }

    var destination = document.getElementById("actContainer");
        (<HTMLElement>destination).innerHTML = "";
        for(var i = this.activeReqIndex; i < this.activeReqIndex+5; i++){
          if(i < actData.length){
          const elem1 = document.createElement("div");
          elem1.classList.add('card');
          elem1.id = i.toString();
          (<HTMLElement>destination).appendChild(elem1);
          //create card wrapper
          const elem2 = document.createElement("div");
          elem2.classList.add('card-body');
          elem2.id = 'inner' + i.toString();
          elem1.appendChild(elem2);
          //add request class
          const elem3 = document.createElement('p');
          elem3.id = 'actClass' + i.toString();
          elem3.innerHTML = actData[i].class;
          elem3.classList.add('card-title');
          elem2.appendChild(elem3);
          const elem4 = document.createElement('input');
          elem4.type = 'text';
          elem4.id = 'actClassEdit' + i.toString();
          elem4.style.display = 'none';
          elem4.value = actData[i].class;
          elem2.appendChild(elem4);
          //add days left
          const elem5 = document.createElement('div');
          elem5.innerHTML = actData[i].daysLeft;
          elem5.id = 'actDays' + i.toString();
          elem5.classList.add('card-days');
          if(actData[i].daysLeft >= 7){
            elem5.classList.add("card-days-green");
          }
          else{
            elem5.classList.add("card-days-red");
          }
          elem2.appendChild(elem5);
          //add msg
          const elem6 = document.createElement('p');
          elem6.innerHTML = actData[i].msg;
          elem6.id = 'actMsg' + i.toString();
          elem6.classList.add('card-text');
          elem2.appendChild(elem6);
          const elem7 = document.createElement('input');
          elem7.type = 'text';
          elem7.value = actData[i].msg;
          elem7.id = 'actMsgEdit' + i.toString();
          elem7.style.display = 'none';
          elem2.appendChild(elem7);
          //add date
          const elem8 = document.createElement('p');
          elem8.innerHTML = actData[i].datePosted;
          elem8.id = 'actDate' + i.toString();
          elem8.classList.add('card-text');
          elem2.appendChild(elem8);
          //add buttons
          /*
            <button #edit class="btn btn-outline-primary btn-sm" style="display: inline;" (click)="openReqEdit(actcard2Id, actcard2ClassEdit, actcard2MsgEdit, actcard2Class, actcard2Msg, confirm, cancel, edit, remove)">Edit</button>
            <button #confirm class="btn btn-outline-danger btn-sm rem" (click)="confirmEdit(actcard2Id, actcard2ClassEdit, actcard2MsgEdit)" style="display: none;">Confirm</button>
            <button #cancel class="btn btn-outline-danger btn-sm rem" (click)="openReqEdit(actcard2Id, actcard2Class, actcard2Msg, actcard2ClassEdit, actcard2MsgEdit, edit, remove, confirm, cancel)" style="display: none;">Cancel</button>
            <button #remove class="btn btn-outline-danger btn-sm rem" (click)="delReq(actcard2Id)" style="display: inline;">Remove</button>
          */
          //declare buttons
          const button1 = document.createElement('button');
          const button2 = document.createElement('button');
          const button3 = document.createElement('button');
          const button4 = document.createElement('button');
          const id = actData[i].reqId;

          //confirm edit button
          button2.addEventListener('click', (e) => {
            this.confirmEdit(id, elem4, elem7, elem3, elem6, button2, button3, button1, button4);
          });
          button2.id = 'confirmAct' + i.toString();
          button2.innerText = 'Confirm';
          button2.style.display = "none";
          button2.classList.add("btn");
          button2.classList.add("btn-outline-danger");
          button2.classList.add("btn-sm");
          (<HTMLElement>elem2).appendChild(button2);
          //cancel button
          button3.addEventListener('click', (e) => {
            this.openReqEdit(elem3, elem6, elem4, elem7, button1, button4, button1, button3);
          });
          button3.id = 'cancelAct' + i.toString();
          button3.innerText = 'Cancel';
          button3.style.display = 'none';
          button3.classList.add("btn");
          button3.classList.add("btn-outline-danger");
          button3.classList.add("btn-sm");
          (<HTMLElement>elem2).appendChild(button3);
          //remove button
          
          button4.addEventListener('click', (e) => {
            this.delReq(id);
          });
          button4.id = 'deleteAct' + i.toString();
          button4.innerText = 'Remove';
          button4.classList.add("btn");
          button4.classList.add("btn-outline-danger");
          button4.classList.add("btn-sm");
          //edit button
          button1.id = 'editAct' + i.toString();
          button1.addEventListener('click', (e) => {
            this.openReqEdit(elem4, elem7, elem3, elem6, button2, button3, button1, button4);//your typescript function
          });
          //button.id += "btn";
          button1.id = 'editAct' + i.toString();
          button1.innerText = 'Edit';
          button1.classList.add("btn");
          button1.classList.add("btn-outline-danger");
          button1.classList.add("btn-sm");
          (<HTMLElement>elem2).appendChild(button1);
          (<HTMLElement>elem2).appendChild(button4);
        }
        }
        var top = 0;
        if(actData.length - this.activeReqIndex >= 5){
          top = 5;
        }
        else{
          top = actData.length - this.activeReqIndex;
        }

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
  }

  public loadExp(expData:any){
    var prev = document.getElementById("previousExp");
     var next = document.getElementById("nextExp");
    if(this.expiredReqIndex == 0){
      (<HTMLElement>prev).style.display = "none";
      
    }
    else{
      (<HTMLElement>prev).style.display = "inline-block";
    }
    if(this.expiredReqIndex+4 >= this.expiredReqs){
      (<HTMLElement>next).style.display = "none";
    }
    else{
      (<HTMLElement>next).style.display = "inline-block";
    }

    var destination = document.getElementById("expContainer");
        (<HTMLElement>destination).innerHTML = "";
        for(var i = this.expiredReqIndex; i < this.expiredReqIndex+5; i++){
          if(i < expData.length){
          const elem1 = document.createElement("div");
          elem1.classList.add('card');
          elem1.id = i.toString();
          (<HTMLElement>destination).appendChild(elem1);
          //create card wrapper
          const elem2 = document.createElement("div");
          elem2.classList.add('card-body');
          elem2.id = 'inner' + i.toString();
          elem1.appendChild(elem2);
          //add request class
          const elem3 = document.createElement('p');
          elem3.id = 'expClass' + i.toString();
          elem3.innerHTML = expData[i].class;
          elem3.classList.add('card-title');
          elem2.appendChild(elem3);
          const elem4 = document.createElement('input');
          elem4.type = 'text';
          elem4.id = 'expClassEdit' + i.toString();
          elem4.style.display = 'none';
          elem4.value = expData[i].class;
          elem2.appendChild(elem4);
          //add msg
          const elem6 = document.createElement('p');
          elem6.innerHTML = expData[i].msg;
          elem6.id = 'expMsg' + i.toString();
          elem6.classList.add('card-text');
          elem2.appendChild(elem6);
          const elem7 = document.createElement('input');
          elem7.type = 'text';
          elem7.value = expData[i].msg;
          elem7.id = 'expMsgEdit' + i.toString();
          elem7.style.display = 'none';
          elem2.appendChild(elem7);
          //add answerMsg if applicable (maybe add answerid username later)
          const elem9 = document.createElement('p');
          elem9.id = 'expAnsMsg' + i.toString();
          elem9.classList.add('card-text');
          if(expData[i].answerMsg != ''){
            elem9.innerHTML = expData[i].answerMsg;
          }
          else {
            elem9.innerHTML = 'Request not fulfilled';
          }
          elem2.appendChild(elem9);
          //add date
          const elem8 = document.createElement('p');
          elem8.innerHTML = expData[i].datePosted;
          elem8.id = 'expDate' + i.toString();
          elem8.classList.add('card-text');
          elem2.appendChild(elem8);
          //add buttons
          /*
            <button #edit class="btn btn-outline-primary btn-sm" style="display: inline;" (click)="openReqEdit(expcard2Id, expcard2ClassEdit, expcard2MsgEdit, expcard2Class, expcard2Msg, confirm, cancel, edit, remove)">Edit</button>
            <button #confirm class="btn btn-outline-danger btn-sm rem" (click)="confirmEdit(expcard2Id, expcard2ClassEdit, expcard2MsgEdit)" style="display: none;">Confirm</button>
            <button #cancel class="btn btn-outline-danger btn-sm rem" (click)="openReqEdit(expcard2Id, expcard2Class, expcard2Msg, expcard2ClassEdit, expcard2MsgEdit, edit, remove, confirm, cancel)" style="display: none;">Cancel</button>
            <button #remove class="btn btn-outline-danger btn-sm rem" (click)="delReq(expcard2Id)" style="display: inline;">Remove</button>
          */
          //declare buttons
          const button4 = document.createElement('button');
          const id = expData[i].reqId;
          //remove button
          
          button4.addEventListener('click', (e) => {
            this.delReq(id);
          });
          button4.id = 'deleteexp' + i.toString();
          button4.innerText = 'Remove';
          button4.classList.add("btn");
          button4.classList.add("btn-outline-danger");
          button4.classList.add("btn-sm");
          (<HTMLElement>elem2).appendChild(button4);
        }
        }
        var top = 0;
        if(expData.length - this.expiredReqIndex >= 5){
          top = 5;
        }
        else{
          top = expData.length - this.expiredReqIndex;
        }

        if(expData.length > 0){
          if(expData.length - this.expiredReqIndex != 1){
            (<HTMLElement>document.getElementById("expstep")).innerHTML = this.expiredReqIndex+1 + " - " + (this.expiredReqIndex+top) + " of " + expData.length;
          }
          else{
            (<HTMLElement>document.getElementById("expstep")).innerHTML = this.expiredReqIndex+1 + " of " + expData.length;
          }
        }
        else{
          (<HTMLElement>document.getElementById("expstep")).innerHTML = "No Expired Requests";
        }
  }

  public loadAns(ansData:any){
    var prev = document.getElementById("previousAns");
     var next = document.getElementById("nextAns");
    if(this.answeredReqIndex == 0){
      (<HTMLElement>prev).style.display = "none";
      
    }
    else{
      (<HTMLElement>prev).style.display = "inline-block";
    }
    if(this.answeredReqIndex+4 >= this.answeredReqs){
      (<HTMLElement>next).style.display = "none";
    }
    else{
      (<HTMLElement>next).style.display = "inline-block";
    }
    var destination = document.getElementById("ansContainer");
        (<HTMLElement>destination).innerHTML = "";
        for(var i = this.answeredReqIndex; i < this.answeredReqIndex+5; i++){
          if(i < ansData.length){
          const elem1 = document.createElement("div");
          elem1.classList.add('card');
          elem1.id = i.toString();
          (<HTMLElement>destination).appendChild(elem1);
          //create card wrapper
          const elem2 = document.createElement("div");
          elem2.classList.add('card-body');
          elem2.id = 'inner' + i.toString();
          elem1.appendChild(elem2);
          //add request class
          const elem3 = document.createElement('p');
          elem3.id = 'ansClass' + i.toString();
          elem3.innerHTML = ansData[i].class;
          elem3.classList.add('card-title');
          elem2.appendChild(elem3);
          //add msg
          const elem6 = document.createElement('p');
          elem6.innerHTML = ansData[i].msg;
          elem6.id = 'ansMsg' + i.toString();
          elem6.classList.add('card-text');
          elem2.appendChild(elem6);
          //add ansMsg
          const elem9 = document.createElement('p');
          elem9.innerHTML = ansData[i].answerMsg;
          elem9.id = 'ansAnsMsg' + i.toString();
          elem9.classList.add('card-text');
          elem2.appendChild(elem9);
          //add date
          const elem8 = document.createElement('p');
          elem8.innerHTML = ansData[i].datePosted;
          elem8.id = 'ansDate' + i.toString();
          elem8.classList.add('card-text');
          elem2.appendChild(elem8);
          //add buttons
          /*
            <button #edit class="btn btn-outline-primary btn-sm" style="display: inline;" (click)="openReqEdit(anscard2Id, anscard2ClassEdit, anscard2MsgEdit, anscard2Class, anscard2Msg, confirm, cancel, edit, remove)">Edit</button>
            <button #confirm class="btn btn-outline-danger btn-sm rem" (click)="confirmEdit(anscard2Id, anscard2ClassEdit, anscard2MsgEdit)" style="display: none;">Confirm</button>
            <button #cancel class="btn btn-outline-danger btn-sm rem" (click)="openReqEdit(anscard2Id, anscard2Class, anscard2Msg, anscard2ClassEdit, anscard2MsgEdit, edit, remove, confirm, cancel)" style="display: none;">Cancel</button>
            <button #remove class="btn btn-outline-danger btn-sm rem" (click)="delReq(anscard2Id)" style="display: inline;">Remove</button>
          */
          //declare buttons
          const button1 = document.createElement('button');
          const button2 = document.createElement('button');
          const button3 = document.createElement('button');
          const button4 = document.createElement('button');
          const id = ansData[i].reqId;

          //remove button
          
          button4.addEventListener('click', (e) => {
            this.delReq(id);
          });
          button4.id = 'deleteans' + i.toString();
          button4.innerText = 'Remove';
          button4.classList.add("btn");
          button4.classList.add("btn-outline-danger");
          button4.classList.add("btn-sm");
          (<HTMLElement>elem2).appendChild(button4);
        }
        }
        var top = 0;
        if(ansData.length - this.answeredReqIndex >= 5){
          top = 5;
        }
        else{
          top = ansData.length - this.answeredReqIndex;
        }

        if(ansData.length > 0){
          if(ansData.length - this.answeredReqIndex != 1){
            (<HTMLElement>document.getElementById("ansstep")).innerHTML = this.answeredReqIndex+1 + " - " + (this.answeredReqIndex+top) + " of " + ansData.length;
          }
          else{
            (<HTMLElement>document.getElementById("ansstep")).innerHTML = this.answeredReqIndex+1 + " of " + ansData.length;
          }
        }
        else{
          (<HTMLElement>document.getElementById("ansstep")).innerHTML = "No Answered Requests";
        }
  }

  public loadPen(penData:any){
    var prev = document.getElementById("previousPen");
     var next = document.getElementById("nextPen");
    if(this.pendingReqIndex == 0){
      (<HTMLElement>prev).style.display = "none";
      
    }
    else{
      (<HTMLElement>prev).style.display = "inline-block";
    }
    if(this.pendingReqIndex+4 >= this.pendingReqs){
      (<HTMLElement>next).style.display = "none";
    }
    else{
      (<HTMLElement>next).style.display = "inline-block";
    }
    var destination = document.getElementById("penContainer");
        (<HTMLElement>destination).innerHTML = "";
        for(var i = this.pendingReqIndex; i < this.pendingReqIndex+5; i++){
          if(i < penData.length){
          const elem1 = document.createElement("div");
          elem1.classList.add('card');
          elem1.id = i.toString();
          (<HTMLElement>destination).appendChild(elem1);
          //create card wrapper
          const elem2 = document.createElement("div");
          elem2.classList.add('card-body');
          elem2.id = 'inner' + i.toString();
          elem1.appendChild(elem2);
          //add request class
          const elem3 = document.createElement('p');
          elem3.id = 'penClass' + i.toString();
          elem3.innerHTML = penData[i].class;
          elem3.classList.add('card-title');
          elem2.appendChild(elem3);
          //add msg
          const elem6 = document.createElement('p');
          elem6.innerHTML = penData[i].msg;
          elem6.id = 'penMsg' + i.toString();
          elem6.classList.add('card-text');
          elem2.appendChild(elem6);
          //add ansMsg
          const elem9 = document.createElement('p');
          elem9.innerHTML = penData[i].answerMsg;
          elem9.id = 'penAnsMsg' + i.toString();
          elem9.classList.add('card-text');
          elem2.appendChild(elem9);
          //add date
          const elem8 = document.createElement('p');
          elem8.innerHTML = penData[i].datePosted;
          elem8.id = 'penDate' + i.toString();
          elem8.classList.add('card-text');
          elem2.appendChild(elem8);
          //add buttons
        
          //declare buttons
          const button1 = document.createElement('button');
          const button2 = document.createElement('button');
          const button3 = document.createElement('button');
          const button4 = document.createElement('button');
          const id = penData[i].reqId;

          //confirm answer button
          button2.addEventListener('click', (e) => {
            this.confirmAnswer(id);
          });
          button2.id = 'confirmpen' + i.toString();
          button2.innerText = 'Confirm Answer';
          button2.classList.add("btn");
          button2.classList.add("btn-outline-danger");
          button2.classList.add("btn-sm");
          (<HTMLElement>elem2).appendChild(button2);
          //cancel answer button
          button3.addEventListener('click', (e) => {
            this.cancelAnswer(id);
          });
          button3.id = 'cancelpen' + i.toString();
          button3.innerText = 'Reject Answer';
          button3.classList.add("btn");
          button3.classList.add("btn-outline-danger");
          button3.classList.add("btn-sm");
          (<HTMLElement>elem2).appendChild(button3);
          //remove button
          
          button4.addEventListener('click', (e) => {
            this.delReq(id);
          });
          button4.id = 'deletepen' + i.toString();
          button4.innerText = 'Remove';
          button4.classList.add("btn");
          button4.classList.add("btn-outline-danger");
          button4.classList.add("btn-sm");
          (<HTMLElement>elem2).appendChild(button4);
        }
        }
        var top = 0;
        if(penData.length - this.pendingReqIndex >= 5){
          top = 5;
        }
        else{
          top = penData.length - this.pendingReqIndex;
        }

        if(penData.length > 0){
          if(penData.length - this.pendingReqIndex != 1){
            (<HTMLElement>document.getElementById("penstep")).innerHTML = this.pendingReqIndex+1 + " - " + (this.pendingReqIndex+top) + " of " + penData.length;
          }
          else{
            (<HTMLElement>document.getElementById("penstep")).innerHTML = this.pendingReqIndex+1 + " of " + penData.length;
          }
        }
        else{
          (<HTMLElement>document.getElementById("penstep")).innerHTML = "No Pending Requests";
        }
  }
}
