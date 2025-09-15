const jsonfile = require('jsonfile');
const path = "C:/Users/Offix/Documents/fullstack/JS/nodeFinalProj/Data/sessionData.json"


const readData = async()=>{
    try {
        return await jsonfile.readFile(path);    
    } catch (error) {
        console.log(error); 
    }
    
}


const writeData = async (obj)=>{
    try {
        let data = await jsonfile.readFile(path)
        console.log(data);
        let newdata = [...data, obj]
        await jsonfile.writeFile(path, newdata)
        console.log("Data added succesfully")         
    } catch (error) {
        console.log(error);
    }

}


module.exports = {readData,writeData}