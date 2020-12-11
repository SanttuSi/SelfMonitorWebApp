import {validate, required, isInt, isDate, isEmail, numberBetween,isString,lengthBetween } from "../deps.js";
import { executeQuery } from "../database/database.js";


const validationRulesForQuality ={
    quality:[required, isInt, numberBetween(1,5)]
};

const validationRulesForDate={
    date: [required, isDate]
};
const validationRulesForTime={
    time: [required, numberBetween(0,24)]
};

const validationRulesForEmail={
    email: [required, isEmail],
    
};
const rulesForPw={
    password: [required,isString,lengthBetween(4,60)]
};
const validatePW=async(data)=>{
    const [passes, errors]=await validate(data, rulesForPw);
    if (passes )
        return true;
    else{
        console.log(errors)
        return false;
    }
}

const validateEmail= async(data)=>{
    const [passes, errors]=await validate(data, validationRulesForEmail);
    if (passes )
        return true;
    else{
        console.log(errors)
        return false;
    }
}

const validateEveningData = async(document,uid, data)=>{
    const sleepQuality= Number(document.get('quality'));
    const mood= Number(document.get('mood'));
    const date = document.get('date');
    const study = Number(document.get('study')); 
    const sleepTime= Number( document.get('duration'));
    const regularity= Number(document.get('regularity'));
    let hasErrors= false;
    const isDateValid= await validateDate(date);
    const isTimeValid=await validateTime(sleepTime);
    const isQualityValid= await validateQuality(sleepQuality);
    const isRegularityValid = await validateQuality(regularity); 
    const isMoodValid= await validateQuality(mood);
    const isStudyValid= await validateTime(study);
    if (!isDateValid ){
        data.dateErrors=true;
        hasErrors=true;
    }
    if(!isStudyValid){
        hasErrors=true;
        data.studyErrors=true;
    }
    if(!isRegularityValid){
        data.regularityErrors=true;
        hasErrors=true;
    }
    if (!isTimeValid ){
        data.timeErrors=true;
        hasErrors=true;
    }
    if (!isQualityValid ){
        data.qualityErrors=true;
        hasErrors=true;
    }
    if (!isMoodValid){
        data.moodErrors=true;
        hasErrors=true;
    }
    if (hasErrors){
        data.date=date;
        data.quality=sleepQuality;
        data.time=sleepTime;
        data.mood=mood;
        data.study=study;
        data.regularity=regularity;
        data.errors=true;
    }
    else{
        const timestamp=new Date(date);
        const id=Number(String(uid) + timestamp.toISOString().substring(0,10).replace('-','').replace('-',''));
        await executeQuery(
            "INSERT INTO evenings (id,user_id, date, sports, reqularity,food,mood, study) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (id) DO UPDATE SET date=$3, sports=$4, reqularity=$5,food=$6, mood=$7, study=$8;",
            id,uid,date, sleepTime,regularity, sleepQuality, mood, study
        );
    }
    data.submitted=true;
    return data;
}
const getTodayStatus=async(uid)=>{
    const date= new Date();
    const datestr= date.toISOString().substring(0,10);
    const morning= await executeQuery("SELECT mood FROM mornings WHERE user_id=$1 AND date=$2",uid,datestr);
    const evening= await executeQuery("SELECT mood FROM evenings WHERE user_id=$1 AND date=$2",uid,datestr);
    const data={
        morning: '',
        evening: ''
    };
    if (typeof evening.rowsOfObjects()[0]!=='undefined'){
        data.evening="done";
    } if(typeof morning.rowsOfObjects()[0]!=='undefined'){
        data.morning="done";
    }
    return data;
}

const validateMorningData = async(document,uid, data)=>{
    const sleepQuality= Number(document.get('quality'));
    const mood= Number(document.get('mood'));
    const date = document.get('date');
    const sleepTime= Number( document.get('duration'));
    let hasErrors= false;
    const isDateValid= await validateDate(date);
    const isTimeValid=await validateTime(sleepTime);
    const isQualityValid= await validateQuality(sleepQuality);
    const isMoodValid= await validateQuality(mood);
    if (!isDateValid ){
        data.dateErrors=true;
        hasErrors=true;
    }
    if (!isTimeValid ){
        data.timeErrors=true;
        hasErrors=true;
    }
    if (!isQualityValid ){
        data.qualityErrors=true;
        hasErrors=true;
    }
    if (!isMoodValid){
        data.moodErrors=true;
        hasErrors=true;
    }
    if (hasErrors){
        data.date=date;
        data.quality=sleepQuality;
        data.time=sleepTime;
        data.mood=mood;
        data.errors=true;
    }
    else{
        const timestamp=new Date(date);
        const id=Number(String(uid) + timestamp.toISOString().substring(0,10).replace('-','').replace('-',''));
        await executeQuery(
            "INSERT INTO mornings (id,user_id, date, sleep, sleepQuality,mood) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO UPDATE SET date=$3, sleep=$4, sleepQuality=$5, mood=$6;",
            id,uid,date, sleepTime, sleepQuality, mood
        );
    }
    data.submitted=true;
    return data;
}



const validateQuality= async(quality)=>{
    const data={
        quality: quality
    };
    const [passes, errors] = await validate(data, validationRulesForQuality);
    if (passes)
        return true;
    else
        console.log(errors);
        return false;

}

const validateDate= async(date)=>{
    const data={
        date: date
    };
    const [passes, errors] = await validate(data, validationRulesForDate);
    if (passes)
        return true;
    else
        console.log(errors);
        return false;

}

const validateTime= async(time)=>{
    const data={
        time: time
    };
    const [passes, errors] = await validate(data, validationRulesForTime);
    if (passes)
        return true;
    else
        console.log(errors);
        return false;

}

export {validateTime, validateDate, validateQuality, validateMorningData, validateEveningData, validateEmail, validatePW, getTodayStatus};