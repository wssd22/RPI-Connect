import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() loginShow: boolean = false;

  @Output() profId = new EventEmitter();
  @Output() reroute = new EventEmitter();

  private data:any = [];
  index:number = 0;
  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
  }

  public return(){
    this.reroute.emit("home");
  }

  public login(uname:HTMLElement, psw:HTMLElement){
    
    if((<HTMLInputElement>uname).value == ""){
      alert("Please enter a valid Username");
      return;
    }
    if((<HTMLInputElement>psw).value == ""){
      alert("Please enter a valid Password");
      return;
    }

    this.httpService.sendGetRequest("user").subscribe((res) => {
      
      this.data = res;
      
      //this.data = JSON.parse(this.data);
      //check if valid credentials given
      var valid = false;
      for(var i = 0; i < this.data.length; i++){
        if(this.data[i].user == (<HTMLInputElement>uname).value && this.data[i].password == (<HTMLInputElement>psw).value){
          valid = true;
          this.index = i;
          i = this.data.length;
        }
      }
      if(valid){
        this.profId.emit(this.data[this.index].id);
        this.reroute.emit("profile");
      }
      else{
        alert("Invalid Credentials");
        return;
      }
    });
  }

}
