const QRcode = require('qrcode');
const baseURL = 'https://qr-restaurant-ordering-system-rouge.vercel.app/';

for(let table = 1; table <= 3; table++){
    const tableURL = `${baseURL}?table=${table}`;
    const fileName = `table_${table}_QR.png`;

    QRcode.toFile(fileName, tableURL, {
        color : {
            dark : '#000000',
            light : '#ffffff'
        }
    },function (err){
        if(err) throw err;
        console.log(`✅ QR for Table ${table} generated as ${fileName} and url: ${tableURL}`);
    }
)
}