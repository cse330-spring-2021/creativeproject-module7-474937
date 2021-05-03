import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { AlertService, ProblemService, UserService, AuthenticationService } from '@/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    problemForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    currentUser: User;
    problems = [];
    users = [];

    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private problemService: ProblemService,
        private userService: UserService,
        private alertService: AlertService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.problemForm = this.formBuilder.group({
            name: ['', Validators.required],
            operations: ['', Validators.required],
            submitType: ['', Validators.required],
            privacy: ['', Validators.required],
            private: [false],
            answers: [''],
            tags: ['']
        });

        this.loadAllProblems();
        this.loadAllUsers();
    }

    get f() { return this.problemForm.controls; }

    deleteProblem(id: number) {
        this.problemService.deleteProblem(id)
            .pipe(first())
            .subscribe(() => this.loadAllProblems());
    }

    copyProblem(id: number) {
        this.problemService.copyProblem(id)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Problem successfully copied', true);
                    this.loadAllProblems();
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    private loadAllProblems() {
        this.problemService.getAllProblems()
            .pipe(first())
            .subscribe(problems => this.problems = problems);
    }

    private loadAllUsers() {
        this.userService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.problemForm.invalid) {
            return;
        }

        if (this.problemForm.value.privacy == "private") {
            this.problemForm.value.private = true;
        }
        else {
            this.problemForm.value.private = false;
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
            var targetProblem = this.problems.find(element => element.name == this.problemForm.value.name);

            if (!targetProblem) {
                this.alertService.error('There is no problem by this name to edit.');
                return;
            }

            if (this.currentUser.username != targetProblem.ownerName) {
                this.alertService.error('You are not the owner of this problem.');
                return;
            }
            var id = targetProblem.id;

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