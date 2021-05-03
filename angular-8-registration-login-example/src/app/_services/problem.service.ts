import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { Problem, User } from '@/_models';

@Injectable({ providedIn: 'root' })
export class ProblemService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    getAllProblems() {
        return this.http.get<Problem[]>(`${config.apiUrl}/problems`);
    }

    addProblem(problem: Problem) {
        problem.ownerName = this.currentUserSubject.value.username;
        return this.http.post(`${config.apiUrl}/problems/addProblem`, problem);
    }

    editProblem(problem: Problem, id: number) {
        problem.ownerName = this.currentUserSubject.value.username;
        return this.http.put(`${config.apiUrl}/problems/${id}`, problem);
    }

    copyProblem(id: number) {
        return this.http.post(`${config.apiUrl}/problems/copyProblem`, {id});
    }

    deleteProblem(id: number) {
        return this.http.delete(`${config.apiUrl}/problems/${id}`);
    }
}