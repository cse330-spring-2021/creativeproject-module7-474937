const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Problem = db.Problem;
const User = db.User;

module.exports = {
    addProblem,
    editProblem,
    getAll,
    getById,
    copyProblem,
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

    let oldTags = currentProblem.tags;
    let newTags = problemParam.tags;

    if (oldTags.includes(newTags)) {

    }
    
    Object.assign(currentProblem, problemParam);

    currentProblem.tags.push(...oldTags);

    await currentProblem.save();
}

async function copyProblem(id, ownerID) {
    const newOwner = await User.findById(ownerID);
    const currentProblem = await Problem.findById(id);

    if (!currentProblem) throw 'Problem not found';

    let newProblem = new Problem({
        name: currentProblem.name + " (copy for " + newOwner.username + ")",
        operations: currentProblem.operations,
        ownerID: ownerID,
        ownerName: newOwner.username,
        answers: currentProblem.answers,
        private: currentProblem.private,
        tags: currentProblem.tags
    });

    await newProblem.save();
}

async function _delete(id) {
    await Problem.findByIdAndRemove(id);
}

async function getById(id) {
    return await Problem.findById(id);
}

async function getAll(ownerId) {
    return await Problem.find({$or:[{ private: false }, { ownerID: ownerId}]});
}