import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { ProblemService, AuthenticationService } from '@/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    currentUser: User;
    problems = [];

    constructor(
        private authenticationService: AuthenticationService,
        private problemService: ProblemService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.loadAllProblems();
    }

    deleteProblem(id: number) {
        this.problemService.deleteProblem(id)
            .pipe(first())
            .subscribe(() => this.loadAllProblems());
    }

    private loadAllProblems() {
        this.problemService.getAllProblems()
            .pipe(first())
            .subscribe(problems => this.problems = problems);
    }
}