import express from 'express';
import recinto from '../models/recinto.js';


//enrutador express
const router = express.Router();

//1. para todos los recintos metodos GET 
router.get('/', async(req, res)=>{
    
    try{
        const resultado = await recinto.find();

        if(resultado.length>0){
            res.status(200).send({
                ok:true,
                resultado:resultado
            });
        }
        else{
            res.status(500).send({
                ok: false, 
                error: "no se encontro recintos"});
        }

     } catch(error){
        res.status(500).send({
            ok:false,
            error: "no se han encontrado recintos"});
    }
});

// 2.servicio de listado por id
router.get('/:id', async (req, res) => {

    try {
        let resultado = await recinto.findById(req.params.id);

        if (resultado) {
            res.status(200).send({ 
                ok: true,
                resultado: resultado});
        } 
        else {
            res.status(404).send({ 
                ok: false, error: `Recinto ${req.params.id} no encontrado` });
        }
    } catch (error) {
        res.status(404).send({ 
            ok: false, 
            error: `el recinto ${req.params.id} no encontrado` });
    }
});

//3. servicio de listado por localidad
    router.get('/localidad/:nombre', async (req, res) => {
    try {
        let resultado = await recinto.find({ localidad: req.params.nombre });

        if (resultado.length > 0) {
            res.status(200).send({ 
                ok: true, 
                resultado: resultado });
        } 
        else {
            res.status(404).send({ 
                ok: false, 
                error: "No se han encontrado recintos de la localidad indicada"});
        }
    } catch (error) {
        res.status(404).send({ 
            ok: false, 
            error: "No se han encontrado recintos de la localidad indicada"});
    }
});

//Post crear un nuevo recinto

router.post('/', async (req, res) => {
    try {
        const nuevoRecinto = new recinto({
            //esquema de recinto en recinto.js
            nombre: req.body.nombre,
            direccion: req.body.direccion,
            localidad: req.body.localidad,
            aforoMaximo: req.body.aforoMaximo
        });

        const resultado = await nuevoRecinto.save();
        res.status(201).send({ 
            ok: true, 
            resultado: resultado });
    } 
    
    catch (error) {
        res.status(500).send({ 
            ok: false, 
            error:"Error añadiendo recinto"});
    }
});

//borrado https://nachoiborraies.github.io/nodejs/md/es/03c
router.delete('/:id', async (req, res) => {
    try {
        let resultado = await recinto.findByIdAndDelete(req.params.id);

        if (resultado) {
            res.status(200).send({ 
                ok: true, 
                resultado: resultado });
        } 
        else {
            res.status(404).send({ 
                ok: false, 
                error: `Error eliminando recinto ${req.params.id}` });
        }

    } catch (error) {
        res.status(404).send({ ok: false, error: `Error eliminando recinto ${req.params.id}` });
    }
});

export default router;