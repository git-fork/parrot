import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/scan';

import { APIService } from './../../shared/api.service';
import { ProjectUser } from './../model';

@Injectable()
export class ProjectUsersService {

    private _projectUsers = new BehaviorSubject<ProjectUser[]>([]);
    public projectUsers = this._projectUsers.asObservable();

    constructor(private api: APIService) { }

    fetchProjectUsers(projectId: string): Observable<ProjectUser[]> {
        let request = this.api.request({
            uri: `/projects/${projectId}/users`,
            method: 'GET',
        })
            .map(res => {
                let users = res.payload;
                if (!users) {
                    throw new Error("no users in response");
                }
                return users;
            }).share();

        request.subscribe(
            users => { this._projectUsers.next(users); }
        );

        return request;
    }
}