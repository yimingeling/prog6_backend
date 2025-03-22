import mongoose from "mongoose";

const setupSchema = new mongoose.Schema({
        title: { type: String, required: true },
        author: { type: String, required: true },
        body: { type: String, required: true },
        category: String,
        image: String


    }, {
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret._links = {
                    self: {
                        href: process.env.BASE_URL + `setups/${ret._id}`
                    },
                    collection: {
                        href: process.env.BASE_URL + 'setups'
                    }

                }
                delete ret._id

            }
        }
    }
);


export default mongoose.model('setup', setupSchema)