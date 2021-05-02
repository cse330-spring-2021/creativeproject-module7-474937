import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Problem } from '@/_models';

@Injectable({ providedIn: 'root' })
export class ProblemService {
    constructor(private http: HttpClient) { }

    getAllProblems() {
        return this.http.get<Problem[]>(`${config.apiUrl}/problems`);
    }

    addProblem(problem: Problem) {
        return this.http.post(`${config.apiUrl}/problems/addProblem`, problem);
    }

    deleteProblem(id: number) {
        return this.http.delete(`${config.apiUrl}/problems/${id}`);
    }
}