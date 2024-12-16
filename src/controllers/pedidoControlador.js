import Pedido from "../models/pedido.js";  

// Crear un nuevo pedido
const crearPedido = async (req, res) => {
    const { productos, usuario, direccion } = req.body;

    if (!productos || !usuario || !direccion) {
        return res.status(400).json({ msg: "Todos los campos son requeridos" });
    }

    try {
        const nuevoPedido = new Pedido(req.body);
        await nuevoPedido.save(); // Guardar el pedido en la base de datos
        res.status(201).json(nuevoPedido);
    } catch (error) {
        res.status(500).json({ msg: "Error al crear el pedido", error });
    }
};

// Obtener todos los pedidos
const obtenerPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find(); // Obtener todos los pedidos
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener los pedidos", error });
    }
};

// Obtener un pedido específico por su ID
const obtenerPedido = async (req, res) => {
    const { id } = req.params;

    try {
        const pedido = await Pedido.findById(id); // Buscar un pedido por su ID
        if (!pedido) {
            return res.status(404).json({ msg: "Pedido no encontrado" });
        }
        res.status(200).json(pedido);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener el pedido", error });
    }
};

// Actualizar estado de un pedido
const actualizarEstadoPedido = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const pedidoActualizado = await Pedido.findByIdAndUpdate(id, { estado }, { new: true });
        if (!pedidoActualizado) {
            return res.status(404).json({ msg: "Pedido no encontrado" });
        }
        res.status(200).json(pedidoActualizado);
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar el pedido", error });
    }
};

export {
    crearPedido,
    obtenerPedidos,
    obtenerPedido,
    actualizarEstadoPedido
};
