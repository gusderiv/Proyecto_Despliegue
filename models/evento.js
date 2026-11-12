import mongoose from "mongoose";

const event =  mongoose.Schema({

    //tabla
    nombre:{
        type: String,
        required: true,
        minlength: 5,
        trim: true
    },

    fecha:{
        type: Date,
        required:true,
        trim: true
    }
});

const evento = mongoose.model('eventos',event);
export default evento;