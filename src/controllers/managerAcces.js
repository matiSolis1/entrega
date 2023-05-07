import fs from 'fs';

export default class ManagerAccess{
    createRecord = async(metod)=>{
        const date = new Date().toLocaleDateString();
        const time = new Date().toLocaleTimeString();
        const message = `Fecha: ${date} - Hora: ${time} - Metodo: ${metod}\n`;
        await fs.promises.appendFile('./src/models/log.txt', message, (err) => {return err;});
    }
}