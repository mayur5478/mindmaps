import { Injectable } from '@angular/core';
import { Topics } from './topics';
import { Links } from './links';
import {Question} from './question';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import {Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Discussions} from "./discussions";


@Injectable()
export class TopicService {
  private baseUrl:string = 'http://139.59.39.117:8282';

  constructor(private http:Http) {
  }

  /**
   *
   * Gets all the topics
   * @returns {any}
   */
  getAllTopics():Promise<Topics[]> {
    let topic$ = this.http.get(`${this.baseUrl}/topic`, {headers: this.getHeaders()})
      .toPromise()
      .then(response => response.json().data as Topics[])
      .catch(this.handleError);

    return topic$;
  }


  addTopics(topic:Topics):Promise<string> {
    return this
      .http
      .post(`${this.baseUrl}/topic`,
        JSON.stringify(topic), {headers: this.getHeaders()})
      .toPromise()
      .then((response => response.json().data ))
      .catch(this.handleError);
  }

  private handleError(error:any):Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  /**
   * Gets all the discussions
   * @returns {any}
   */
  getAllDiscussions():Promise<Discussions[]> {
    let discussions$ = this.http
      .get(`${this.baseUrl}/discussion`, {headers: this.getHeaders()})
      .toPromise()
      .then(response => response.json().data as Discussions[])
      .catch(this.handleError);
    return discussions$;
  }

  addDiscussion(question:Question):Promise<Discussions> {
    return this
      .http
      .post(`${this.baseUrl}/discussion`,
        JSON.stringify(question), {headers: this.getHeaders()})
      .toPromise()
      .then((response => response.json().data as Discussions))
      .catch(this.handleError);
  }


  renameDiscussion(parameters:Discussions):Promise<Discussions> {
    return this
      .http
      .post(`${this.baseUrl}/rename_discussion`,
        JSON.stringify(parameters), {headers: this.getHeaders()})
      .toPromise()
      .then((response => response.json().data as Discussions))
      .catch(this.handleError);
  }


  private getHeaders() {
    // I included these headers because otherwise FireFox
    // will request text/html instead of application/json
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', "*");
    return headers;
  }



  createLink(link:Links):Promise<any> {
    return this
      .http
      .post(`${this.baseUrl}/create_link`,
        JSON.stringify(link), {headers: this.getHeaders()})
      .toPromise()
      .then((response => response.json().data  ))
      .catch(this.handleError);
  }


}
