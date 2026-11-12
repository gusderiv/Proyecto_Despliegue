import mongoose from "mongoose";
import { type } from "node:os";
//esquemas
const recinto = mongoose.Schema({

    nombre:{
        type: String,
        minlength: 5,
        required: true
    },

    direccion:{
        type: String,
        minlength: 10,
        required: true
    },

    localidad:{
        type: String,
        minlength: 3,
        required: true
    },

    aforoMaximo:{
        type: Number,
        min:0
    }

});

const recint = mongoose.model('recintos', recinto);
export default recint;