import express from 'express';
import evento from '../models/evento.js';
import recinto from '../models/recinto.js';


//enrutador express
const router = express.Router();


//GET /eventos
router.get('/', async (req, res) => {
    try {
        let resultado = await evento.find().populate('recinto');

        if (resultado.length > 0) {
            res.status(200).send({ 
                ok: true, resultado: resultado
            });
        } else {
            res.status(500).send({ 
                ok: false, 
                error: "No se han encontrado eventos" });
        }
    } catch (error) {
        res.status(500).send({ 
            ok: false, error: 'No se han encontrado eventos' });
    }
});

//GET /eventos/:id, obtiene un evento por su ID con datos del recinto
router.get('/:id', async (req, res) => {
    try {
        let resultado = await evento.findById(req.params.id).populate("recinto");

        if (resultado) {
            res.status(200).send({ 
                ok: true, 
                resultado: resultado });
        } else {
            res.status(404).send({ 
                ok: false, 
                error: `Evento ${req.params.id} no encontrado` });
        }

    } catch (error) {
        res.status(404).send({ 
            ok: false, 
            error: `Evento ${req.params.id} no encontrado` });
    }
});



/*
Orden de las rutas: Mantén router.get('/localidad/:nombre', ...) 
por encima de router.get('/:id', ...) 
para respetar la buena práctica de declarar las rutas más específicas 
antes de las rutas con parámetros genéricos en la raíz.

*/

//GET /eventos/localidad/:nombre:
router.get('/localidad/:nombre', async (req, res) => {
    try {
        //paso 1, buscar recintos de esa localidad
        let recintos = await recinto.find({ localidad: req.params.nombre });
        
        //eventos de recinto que aun no ahan pasado
        let idsRecintos = recintos.map(r => r._id);

        let resultado = await evento.find({
            recinto: { $in: idsRecintos },//_id de cada recinto encontrado
            fecha: { $gte: new Date() } //gte:greater than or equal
        }).populate('recinto');


        if (resultado.length > 0) {
            res.status(200).send({ 
                ok: true, 
                resultado: resultado });
        } 
        else {
            res.status(404).send({ 
                ok: false, 
                error: 'No se han encontrado eventos' });
        }
    } catch (error) {
        res.status(404).send({ 
            ok: false, 
            error: 'No se han encontrado eventos' });
    }
});

//POST /eventos:
router.post('/', async (req, res) => {
    try {
        const nuevoEvento = new evento({
            nombre: req.body.nombre,
            fecha: req.body.fecha,
            entradas: req.body.entradas,
            recinto: req.body.recinto
        });

        const resultado = await nuevoEvento.save();
        res.status(201).send({
            ok: true,
            resultado: resultado
        });
    } catch (error) {
        res.status(500).send({
            ok: false,
            error: "Error añadiendo evento"
        });
    }
});


//https://nachoiborraies.github.io/nodejs/md/es/03c   
// 4.2 Las modificaciones del PUT
// PUT /eventos/:id -> Actualizar los datos de un evento
router.put('/:id', async (req, res) => {
    try {
        const resultado = await evento.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    nombre: req.body.nombre,
                    fecha: req.body.fecha,
                    entradas: req.body.entradas,
                    recinto: req.body.recinto
                }
            },
            { new: true }  //sin esto no hay cambios
        );

        if (resultado) {
            res.status(200).send({
                ok: true,
                resultado: resultado
            });

        } else {
            res.status(404).send({
                ok: false,
                error: `Error actualizando evento ${req.params.id}`
            });
        }

    } catch (error) {
        res.status(404).send({
            ok: false,
            error: `Error actualizando evento ${req.params.id}`
        });
    }
});


//DELETE /eventos/:id:
router.delete('/:id', async (req, res) => {
    try {
        let resultado = await Evento.findByIdAndDelete(req.params.id);

        if (resultado) {
            res.status(200).send({ 
                ok: true, 
                resultado: resultado });
        } 
        else {
            res.status(404).send({ 
                ok: false, 
                error: `Error eliminando evento ${req.params.id}` });
        }
    } catch (error) {
        res.status(404).send({ 
            ok: false, 
            error: `Error eliminando evento ${req.params.id}` });
    }
});


// GET /eventos/entradas/:idEvento/:tipoEntrada
//consulta de datos de una entrada
router.get('/entradas/:idEvento/:tipoEntrada', async (req, res) => {
    try {
        let evento = await Evento.findById(req.params.idEvento);

        if (evento) {
            let entrada = evento.entradas.find(p => p.tipo === req.params.tipoEntrada);
            
            if (entrada) {
                res.status(200).send({
                    ok: true,
                    resultado: { 
                        precio: entrada.precio, 
                        disponibles: entrada.disponibles 
                    }
                });
                return;
            }
        }

        res.status(404).send({ 
            ok: false, 
            error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}` });
    } 
    catch (error) {
        res.status(404).send({ 
            ok: false, 
            error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}` });
    }
});


//PUT /eventos/entradas/:idEvento/:tipoEntrada/:cantidad: 
//servicio de actualizacion de entradas disponibles
router.put('/entradas/:idEvento/:tipoEntrada/:cantidad', async (req, res) => {
    try {

        let eventoEncontrado = await evento.findById(req.params.idEvento);
        let cantidad = parseInt(req.params.cantidad);

        if (eventoEncontrado) {
            let entrada = eventoEncontrado.entradas.find(e => e.tipo === req.params.tipoEntrada);

            if (entrada && cantidad > 0 && entrada.disponibles >= cantidad) {
                entrada.disponibles = entrada.disponibles - cantidad;

                let resultado = await eventoEncontrado.save();

                res.status(200).send({
                    ok: true,
                    resultado: resultado
                });
                return;
            }
        }

        res.status(404).send({
            ok: false,
            error: `Error actualizando entradas del evento ${req.params.idEvento}`
        });

    } catch (error) {
        res.status(404).send({
            ok: false,
            error: `Error actualizando entradas del evento ${req.params.idEvento}`
        });
    }
});


export default router;
