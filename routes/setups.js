import mongoose from "mongoose";
import express from "express";
import Setup from '../models/Setups.js';

import {faker} from "@faker-js/faker";
import setups from "../models/Setups.js";


const {Schema} = mongoose;

const router = express.Router();

router.use(express.json());

router.use(express.urlencoded({extended: true}));


router.options('/', async (req, res) => {
    res.header('Allow', 'GET,OPTIONS,POST,DELETE');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE');

    res.status(204).send();

});

router.options('/:id', async (req, res) => {
    res.header('Allow', 'GET,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');

    res.status(204).send();

});

router.get('/', async (req, res) => {

    // Check Accept header

    try {
        const setups = await Setup.find({});

        const collection = {
            "items": setups,
            "_links": {
                "self": {
                    "href": process.env["BASE_URL"] + "/setups"
                },
                "collection": {
                    "href": process.env["BASE_URL" + "EXPRESS_PORT"] + "/setups"
                }
            }
        }

        res.json(collection);
    } catch (error) {
        res.json({error: error.message});
    }
});

router.post('/seed', async (req, res) => {
    try {
        console.log('delete start');

        const amount = 10;

        await Setup.deleteMany({});

        for (let i = 0; i < amount; i++) {
            await Setup.create({
                title: faker.lorem.lines(1),
                body: faker.lorem.lines(1),
                author: faker.person.fullName(),
                category: faker.lorem.lines(1),
                image: faker.lorem.lines(1)
            });

        }
        res.json({success: true})

    } catch (error) {
        res.json({error: error.message});
    }
});

router.put('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const editSetup = req.body;
        const updatedSetup = await Setup.findByIdAndUpdate(id, editSetup, {runValidators: true});

        res.status(201).json({message: req.body, succes: updatedSetup});
    } catch (error) {
        res.status(400).json({error: error.message})
    }
});
router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const setup = await Setup.findById(id);
    res.json(setup)
    console.log('delete start')

});

router.delete('/:id', async (req, res) => {
    console.log('delete start');
    try {
        const {id} = req.params;
        await Setup.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


router.post('/', async (req, res) => {
    try {

        const {title, body, author, category, image} = req.body;

        const setup = await Setup.create({
            title: title,
            body: body,
            author: author,
            category: category,
            image: image
        })
        res.json({setup})


    } catch (error) {
        res.json({error: error.message});
    }

});

export default router