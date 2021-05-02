import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { AlertService, ProblemService, AuthenticationService } from '@/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    problemForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    currentUser: User;
    problems = [];

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private problemService: ProblemService,
        private alertService: AlertService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.problemForm = this.formBuilder.group({
            name: ['', Validators.required],
            operations: ['', Validators.required],
            submitType: ['', Validators.required],
        });

        this.loadAllProblems();
    }

    get f() { return this.problemForm.controls; }

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

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.problemForm.invalid) {
            return;
        }

        if (this.problemForm.value.submitType == 'add') {
            this.problemService.addProblem(this.problemForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Problem submission successful', true);
                    this.loadAllProblems();
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
        }
        else if (this.problemForm.value.submitType == 'edit') {
            var id = this.problems.find(element => element.name == this.problemForm.value.name).id;

            this.problemService.editProblem(this.problemForm.value, id)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Problem edit successful', true);
                    this.loadAllProblems();
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
        }
    }
}