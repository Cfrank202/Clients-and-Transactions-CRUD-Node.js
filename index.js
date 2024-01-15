import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import bodyParser from 'body-parser';
import { conectar } from './src/conexion.js'
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log("Servidor escuchando en el puerto: " + port);
});

// Configurar las vistas y el motor de plantillas
app.set('views', path.join(__dirname, 'vistas'));

// Establecer las rutas estáticas para los archivos HTML
app.use('/', express.static(path.join(__dirname, 'vistas')));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/css', express.static(path.join(__dirname, 'css')));

// Renderizar el archivo index.html
app.get('/', function (req, res) {
    conectar()
    res.render(path.join(__dirname, 'vistas', 'index.html'));
});

const connection = conectar();

//para mostrar clientes
app.get('/api/clientes', (req, res) => {
    connection.query('SELECT * FROM clientes', (error, filas) => {
        if (error) {
            throw error;
        } else {
            res.send(filas);
        }
    })
});

//para registrar cliente
app.post('/api/clientes', (req, res) => {
    const { dni, nombres, apellidos, fecha_nacimiento, celular, correo, banco, numero_cci } = req.body;
    const data = {
        dni,
        nombres,
        apellidos,
        fecha_nacimiento,
        celular,
        correo,
        banco,
        numero_cci
    };
    const sql = "INSERT INTO clientes SET ?";
    connection.query(sql, data, function (error, results) {
        if (error) {
            throw error;
        } else {
            res.send(results);
        }
    });
});


//para mostrar transacciones
app.get('/api/transacciones', (req, res) => {
    connection.query('SELECT * FROM transacciones', (error, filas) => {
        if (error) {
            throw error;
        } else {
            res.send(filas);
        }
    })
});

//para la busqueda por dni
app.get('/api/clientes/:dni', (req, res) => {
    connection.query('SELECT * FROM clientes WHERE dni = ?', [req.params.dni], (error, fila) => {
        if (error) {
            throw error;
        } else {
            res.send(fila);
        }
    });
})

//editar clientes
app.post('/api/clientes/editar', (req, res) => {
    const { editNombres, editApellidos, editFechaNacimiento, editCelular, editCorreo, editBanco, editNcci, dni } = req.body;
    const sql = "UPDATE clientes SET nombres = ?, apellidos = ?, fecha_nacimiento = ?, celular = ?, correo = ?, banco = ?, numero_cci = ? WHERE dni = ?";
    
    connection.query(sql, [editNombres, editApellidos, editFechaNacimiento, editCelular, editCorreo, editBanco, editNcci, dni], function (error, results) {
        if (error) {
            throw error;
        } else {
            res.send(results);
        }
    });
});

// Borrar cliente por DNI
app.delete('/api/clientes/:dni', (req, res) => {
    const dni = req.params.dni;

    const sql = "DELETE FROM clientes WHERE dni = ?";

    connection.query(sql, [dni], function (error, results) {
        if (error) {
            res.status(500).json({ error: 'Error al borrar el cliente' });
        } else {
            res.status(200).json({ message: 'Cliente borrado correctamente' });
        }
    });
});
