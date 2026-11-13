// 1. Cargar las librerías necesarias y los enrutadores
import express from 'express';
import mongoose from 'mongoose';

import dotenv from 'dotenv';


import recintos from './routes/recintos.js';
import eventos from './routes/eventos.js';


dotenv.config();

// 2. Conectar con la base de datos MongoDB
mongoose.connect(process.env.MONGODB_URI);

// 3. Habilitar el servidor Express y el middleware para procesar JSON
let app = express();
app.use(express.json());

// 4. Cargar los enrutadores con las rutas base adecuadas
app.use('/recintos', recintos);
app.use('/eventos', eventos);

// 5. Poner en marcha el servidor.
app.listen(process.env.PORT || 3000, () => {

    console.log("Servidor iniciado...");
});