const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Problem = db.Problem;

module.exports = {
    addProblem,
    editProblem,
    getAll,
    getById,
    delete: _delete
};

async function addProblem(problemParam) {
    if (await Problem.findOne({ name: problemParam.name })) {
        throw 'Problem name "' + problemParam.name + '" is already taken';
    }

    const newProblem = new Problem(problemParam);

    await newProblem.save();
}

async function editProblem(id, problemParam) {
    const currentProblem = await Problem.findById(id);

    if (!currentProblem) throw 'Problem not found';
    if (currentProblem.name !== problemParam.name && await Problem.findOne({ name: problemParam.name })) {
        throw 'Problem name "' + problemParam.name + '" is already taken';
    }

    Object.assign(currentProblem, problemParam);

    await currentProblem.save();
}

async function _delete(id) {
    await Problem.findByIdAndRemove(id);
}

async function getById(id) {
    return await Problem.findById(id);
}

async function getAll() {
    return await Problem.find();
}