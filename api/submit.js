// api/submit.js

const { GoogleAuth } = require('google-auth-library');
const { google } = require('googleapis');

// Extraer la llave privada de la variable de entorno.
// Usamos el valor por defecto de una cadena vacía ('') 
// si la variable de entorno no está definida.
const privateKey = process.env.GOOGLE_PRIVATE_KEY || ''; 

// 1. Configuración de Autenticación
const auth = new GoogleAuth({
    credentials: {
        // La clave privada se procesa aquí:
        // Aseguramos que sea un string con el OR (|| '')
        // y aplicamos el reemplazo de los caracteres literales \n
        private_key: privateKey.replace(/\\n/g, '\n'), 
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// ID de tu hoja de cálculo
const SPREADSHEET_ID = '1jAyXeS7gzEbmG3ewfXya03p1yUDK323ivrYePMXbT_M'; 
// Rango de la hoja de cálculo donde quieres escribir (Hoja1)
const RANGE = 'Hoja1'; 

module.exports = async (req, res) => {
    // Solo procesa solicitudes POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Procesar los datos de entrada que vienen como JSON
        const data = req.body; 

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ error: 'No data received from form.' });
        }

        // 2. Crear el cliente de la API
        const sheets = google.sheets({ version: 'v4', auth });

        // Crear la nueva fila de datos
        const newRow = [
            data.nombre,
            data.apellido,
            data.mensaje,
            data.categoria,
            data.subcategoria,
            new Date().toISOString(),
        ];

        // 3. Escribir la fila en Google Sheets
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: RANGE,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [newRow],
            },
        });

        // 4. Respuesta exitosa
        res.status(200).json({ success: true, message: 'Data successfully appended to Google Sheets.' });

    } catch (error) {
        console.error('Error al escribir en Google Sheets:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error.' });
    }
};
