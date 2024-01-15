import mysql from 'mysql';

const conector = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'transacciones'
});

const conectar = () => {
    conector.connect(error => {
        if (error) {
            throw error;
        } else {
            console.log('Conexión exitosa');
        }
    });
    return conector;
};



export { conectar };

