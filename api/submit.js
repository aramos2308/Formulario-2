// api/submit.js

const { GoogleAuth } = require('google-auth-library');
const { google } = require('googleapis');

// 1. Configuración y Autenticación
const auth = new GoogleAuth({
    credentials: {
        // Se leen de las Variables de Entorno de Vercel
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Importante para las llaves
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Permiso para escribir en Sheets
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
        // 2. Procesar los datos de entrada
        // Vercel y Node.js procesan FormData diferente a Apps Script.
        // Asumimos que el cliente envía datos como 'application/json' o 'application/x-www-form-urlencoded'
        // Si usaste FormData, req.body tendrá los campos del formulario.
        const data = req.body; 

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ error: 'No data received from form.' });
        }

        // 3. Crear el cliente de la API
        const sheets = google.sheets({ version: 'v4', auth });

        // Crear la nueva fila de datos
        const newRow = [
            data.nombre,
            data.apellido,
            data.mensaje,
            data.categoria,
            data.subcategoria,
            new Date().toISOString(), // Usar ISO string para formato claro de fecha
        ];

        // 4. Escribir la fila en Google Sheets
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: RANGE,
            valueInputOption: 'USER_ENTERED', // Permite que Google interprete el formato (e.g., fechas)
            resource: {
                values: [newRow],
            },
        });

        // 5. Respuesta exitosa
        res.status(200).json({ success: true, message: 'Data successfully appended to Google Sheets.' });

    } catch (error) {
        console.error('Error al escribir en Google Sheets:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error.' });
    }
};
