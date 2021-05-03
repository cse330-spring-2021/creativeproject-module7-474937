const express = require('express');
const router = express.Router();
const problemService = require('./problem.service');

// routes
router.post('/addProblem', addProblem);
router.post('/copyProblem', copyProblem);

router.get('/', getAll);
router.get('/:id', getById);

router.put('/:id', editProblem);

router.delete('/:id', _delete);

module.exports = router;

function addProblem(req, res, next) {

    let myProblem = 
    { 
        "name": req.body.name,
        "operations": req.body.operations,
        "private": req.body.private,
        "ownerID": req.user.sub,
        "ownerName": req.body.ownerName,
        "tags": req.body.tags
    };

    problemService.addProblem(myProblem)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function copyProblem(req, res, next) {
    problemService.copyProblem(req.body.id, req.user.sub)
    .then(() => res.json({}))
    .catch(err => next(err));
}

function editProblem(req, res, next) {
    problemService.editProblem(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    problemService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    problemService.getAll(req.user.sub)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getById(req, res, next) {
    problemService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}
