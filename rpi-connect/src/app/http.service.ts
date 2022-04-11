import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private apiserver = "http://localhost:3000/";

  constructor(private httpClient: HttpClient) { }

  public sendGetRequest(request :string) {
    return this.httpClient.get(this.apiserver + request);
  }

  //POST
  public sendPostRequest(request:string, msg:string){
    
    return this.httpClient.post(this.apiserver + request, msg);
  }

  //PUT
  public sendPutRequest(request:string, msg:string){
    return this.httpClient.put(this.apiserver + request, msg);
  }

  //DELETE
  public sendDeleteRequest(request:string, msg:string){
    return this.httpClient.delete(this.apiserver + request);
  }

}

