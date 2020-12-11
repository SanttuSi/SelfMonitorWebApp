import {getSetDate, getPrevWeek} from "../../services/summaryService.js";
import {validateDate} from "../../services/reportingService.js";
import { executeQuery } from "../../database/database.js";
const getWeek= async({request,response,params})=>{
    const data=await getPrevWeek();
    
    response.body= data;
   
}

const getDay= async({response, params})=>{
    const date = String(params.year)+'-'+String(params.month)+'-'+ String(params.day);
    const passes = await validateDate(date);
    if(!passes){
        response.body={};
    }else{
        const data = await getSetDate(date);
        response.body=data;
    }
}

export {getWeek,getDay};