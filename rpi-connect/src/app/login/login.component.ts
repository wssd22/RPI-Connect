import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { AuthService } from '../auth.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() loginShow: boolean = false;

  @Output() profId = new EventEmitter();
  @Output() reroute = new EventEmitter();
  private user:any = [];

  private data:any = [];
  index:number = 0;
  constructor(private httpService: HttpService, private authService: AuthService, public router: Router) { }

  ngOnInit(): void {
    this.authService.SignOut();
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

  public googleLogin(){
    this.authService.SigninWithGoogle().then((result) =>{
      //alert("hello");
      //console.log(result.additionalUserInfo);
      if(result.additionalUserInfo){
        this.user = result.additionalUserInfo.profile;
        //alert(this.data.id);
        this.httpService.sendGetRequest('user').subscribe((res) => {
          this.data = res;
          var found = false;
          for(var i = 0; i < this.data.length; i++){
            if(this.data[i].id == this.user.id){
              found = true;
              //this.profId.emit(id);
              //this.reroute.emit("profile");
              this.profId.emit(this.user.id);
              this.reroute.emit("profile");
              //this.router.navigate(['profile']);
              i = this.data.length;
            }
          }
          if(!found){
            this.profId.emit(this.user.id);
            this.reroute.emit("register");
          }
        });
      }
      else{
        alert("Please log in with a valid Google Account");
        
      }
    });    
  }

  public googleLogout(){
    this.authService.SignOut();
  }

  public checkStatus(){
    var id = this.authService.user.uid;
    alert(id);
    this.httpService.sendGetRequest('user').subscribe((res) => {
      this.data = res;
      var found = false;
      for(var i = 0; i < this.data.length; i++){
        if(this.data[i].id == id){
          found = true;
          this.profId.emit(id);
          this.reroute.emit("profile");
          return;
        }
      }
      if(!found){
        this.profId.emit(id);
        this.reroute.emit("register");
      }
    });
  }

}
