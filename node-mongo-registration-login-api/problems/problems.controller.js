const express = require('express');
const router = express.Router();
const problemService = require('./problem.service');

// routes
router.post('/addProblem', addProblem);

router.get('/', getAll);
router.get('/:id', getById);

router.put('/:id', editProblem);

router.delete('/:id', _delete);

module.exports = router;

function addProblem(req, res, next) {
    problemService.addProblem(req.body)
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
    problemService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getById(req, res, next) {
    problemService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}
