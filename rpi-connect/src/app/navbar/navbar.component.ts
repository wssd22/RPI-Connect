import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output() target = new EventEmitter<any>();
  @Input() profId:number = 0;
  @Input() loggedIn:boolean = false;
  @Input() loggedOut:boolean = true;
  
  
  constructor() { }

  ngOnInit(): void {
  }

  public dropdown(target:HTMLElement) {
    const dropMenu = target;
    
    //Show dropdown for clicked content
    if((<HTMLElement>dropMenu).style.display === "block"){
      (<HTMLElement>dropMenu).style.display = "none";
    }
    else{
      (<HTMLElement>dropMenu).style.display = "block";
    }
}

  //navigation between pages
  public navigate(page:HTMLElement){
    this.target.emit(page.id);
  }

}
