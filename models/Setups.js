import mongoose from "mongoose";

const setupSchema = new mongoose.Schema({
        title: String,
        author: String,
        body: String,
        category: String,
        image: String


    }, {
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret._links = {
                    self: {
                        href: process.env.BASE_URL + 'setups'
                    },
                    collection: {
                        // href: process.env.BASE_URL+'setups'
                    }

                }
                delete ret._id

            }
        }
    }
);


export default mongoose.model('setup', setupSchema)