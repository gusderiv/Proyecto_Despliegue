import mongoose from "mongoose";
//esquemas
const entrada = mongoose.Schema({
    
    tipo:{ 
    type: String,
    required: true,
    minlength: 3
    },

    precio:{
        type: Number,
        required: true,
        min:0
    },

    disponibles:{
    type: Number,
    required: true,
    min:0
    }
});
//esquema evento
const event =  mongoose.Schema({
    //equivale a una tabla
    nombre:{
        type: String,
        required: true,
        minlength: 5,
        trim: true
    },

    fecha:{
        type: Date,
        required:true,
    },

    entradas: [entrada],

    recinto:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "recintos",
        required: true
    }
});

const evento = mongoose.model('eventos',event);
export default evento;