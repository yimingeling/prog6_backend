import mongoose from "mongoose";
import express from "express";
import Setup from '../models/Setups.js';

import {faker} from "@faker-js/faker";
import setups from "../models/Setups.js";

const {Schema} = mongoose;

const router = express.Router();

router.use(express.json());

router.use(express.urlencoded({extended: true}));

router.options('/', (req, res) => {
    res.header('Allow', 'GET,OPTIONS,POST');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.status(204).send();
});

router.options('/:id', (req, res) => {
    res.header('Allow', 'GET,PUT,DELETE,OPTIONS, PATCH');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS, PATCH');
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
                    "href": process.env["BASE_URL"] + "setups"
                },
                "collection": {
                    "href": process.env["BASE_URL"] + "setups"
                }
            }
        }
        res.status(201).json(collection);

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
        res.status(201).json({success: true})

    } catch (error) {
        res.json({error: error.message});
    }
});


router.put('/:id', async (req, res) => {
    try {
        console.log('PUT ' + req.params.id);
        const {id} = req.params;

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).json({ error: 'No setup found with this ID' });
        }

        const editSetup = req.body;
        const updatedSetup = await Setup.findByIdAndUpdate(id, editSetup, {
            new: true,
            runValidators: true,
        });
        res.status(201).json({message: req.body, success: updatedSetup});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});


router.get('/:id', async (req, res) => {

    try {
        const {id} = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).json({ error: 'No setup found with this ID' });
        }

        const setup = await Setup.findById(id);

        if (setup) {
            res.status(200).json(setup);
        } else {
            res.status(404).json({error: 'No setup found with this id'});
        }

    } catch(error) {
        console.log(error);
        res.status(400).json({error: error.message});
    }
});

router.delete('/:id', async (req, res) => {
    console.log('delete start');
    try {
        const {id} = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).json({error: 'No setup found with this ID'});
        }

        await Setup.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

/*
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

*/
router.post('/', async (req, res) => {
    try {
        const { title, body, author } = req.body;

        // Check for missing fields
        if (!title || !body || !author) {
            return res.status(400).json({
                message: 'Missing required fields',
                errors: {
                    title: !title ? 'Title is required' : undefined,
                    body: !body ? 'Body is required' : undefined,
                    author: !author ? 'Author is required' : undefined,
                }
            });
        }

        const newProduct = new Setup({
            title,
            body,
            author,
            category: '',
            image: '',
        });

        await newProduct.save();

        res.status(201).json({ message: 'POST request received', data: newProduct });
    } catch (e) {
        res.status(500).json({ message: 'Server error', error: e.message });
    }
});

export default router