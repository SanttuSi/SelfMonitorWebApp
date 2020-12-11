import { executeQuery } from "../database/database.js";
import {validate, required, isNumber, isInt, isDate, isEmail, numberBetween } from "../deps.js";

const validationRulesForISOData ={
    year:[required, isInt, numberBetween(2000,2500)],
    week: [required, isInt, numberBetween(0,53)]
};

const validateISOData= async(data)=>{
    const [passes,errors]= await validate(data, validationRulesForISOData);
    if (passes){
        return true
    } else{
        console.log(errors);
        return false;
    }
}
const getSetDate= async(date)=>{
    const result= await executeQuery("SELECT AVG(sleep) FROM mornings WHERE date= $1 \
    UNION ALL SELECT AVG(sleepquality) as quality FROM mornings WHERE date= $1 \
    UNION ALL SELECT AVG(mood) AS mood FROM (SELECT mood FROM evenings  WHERE date= $1 \
    UNION ALL SELECT mood FROM mornings WHERE date= $1) AS subquery\
    UNION ALL SELECT AVG(sports) FROM evenings WHERE date= $1 \
    UNION ALL SELECT AVG(food) FROM evenings WHERE  date= $1\
    UNION ALL SELECT AVG(reqularity) FROM evenings WHERE date= $1 \
    UNION ALL SELECT AVG(study) FROM evenings WHERE date= $1;",date);
    const objects= result.rowsOfObjects();
    const data={
        sleepTime: Number(typeof objects[0]!=='undefined' ?  objects[0].avg:("") ),
        sleepQuality: Number(typeof objects[1]!=='undefined' ?  objects[1].avg:("") ),
        mood: Number(typeof objects[2]!=='undefined' ?  objects[2].avg:("") ),
        sports:Number(typeof objects[3]!=='undefined' ?  objects[3].avg:("") ),
        food: Number(typeof objects[4]!=='undefined' ?  objects[4].avg:("") ),
        reqularity: Number(typeof objects[5]!=='undefined' ?  objects[5].avg:("") ),
        study: Number(typeof objects[6]!=='undefined' ?  objects[6].avg:("")),
    }
    return data;

}
const getPrevWeek= async() =>{
    const result =await executeQuery(
    "SELECT AVG(sleep) FROM mornings WHERE date BETWEEN NOW() - interval '7 days' AND NOW() \
    UNION ALL SELECT AVG(sleepquality) as quality FROM mornings WHERE date BETWEEN NOW() - interval '7 days' AND NOW() \
    UNION ALL SELECT AVG(mood) AS mood FROM (SELECT mood FROM evenings  WHERE date BETWEEN NOW() - interval '7 days' AND NOW() \
    UNION ALL SELECT mood FROM mornings WHERE date BETWEEN NOW() - interval '7 days' AND NOW()) AS subquery\
    UNION ALL SELECT AVG(sports) FROM evenings WHERE date BETWEEN NOW() - interval '7 days' AND NOW() \
    UNION ALL SELECT AVG(food) FROM evenings WHERE  date BETWEEN NOW() - interval '7 days' AND NOW()\
    UNION ALL SELECT AVG(reqularity) FROM evenings WHERE date BETWEEN NOW() - interval '7 days' AND NOW() \
    UNION ALL SELECT AVG(study) FROM evenings WHERE date BETWEEN NOW() - interval '7 days' AND NOW();");
    const objects= result.rowsOfObjects();
    const data={
        sleepTime: Number(typeof objects[0]!=='undefined' ?  objects[0].avg:("") ),
        sleepQuality: Number(typeof objects[1]!=='undefined' ?  objects[1].avg:("") ),
        mood: Number(typeof objects[2]!=='undefined' ?  objects[2].avg:("") ),
        sports:Number(typeof objects[3]!=='undefined' ?  objects[3].avg:("") ),
        food: Number(typeof objects[4]!=='undefined' ?  objects[4].avg:("") ),
        reqularity: Number(typeof objects[5]!=='undefined' ?  objects[5].avg:("") ),
        study: Number(typeof objects[6]!=='undefined' ?  objects[6].avg:("")),
    }
    return data;
}

const getLastDays= async()=>{
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const today= new Date();
    const result = await executeQuery("SELECT AVG(mood) FROM (SELECT mood FROM evenings WHERE date=$1  \
    UNION ALL SELECT mood FROM mornings WHERE date=$1) AS subquery\
    UNION ALL SELECT AVG(mood) FROM (SELECT mood FROM evenings WHERE date=$2\
    UNION ALL SELECT mood FROM mornings WHERE date=$2) AS subquery;",(yesterday.toISOString()), (today.toISOString()));
    const objects=result.rowsOfObjects();
    const data={
        yesterday: Number(typeof objects[0]!=='undefined' ?  objects[0].avg:("")),
        today: Number(typeof objects[1]!=='undefined' ?  objects[1].avg:(""))
    };

    return data;
}

function getDateOfISOWeek(w, y) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}

const getLastWeek= async(id, ISOWeek)=>{
    const week = ISOWeek.substring(0,5)+ ISOWeek.substring(6,8);
    const result= await executeQuery(
        "SELECT AVG(sleep) FROM mornings WHERE user_id=$1 AND to_char(date,'IYYY-IW')=$2 \
        UNION ALL\
        SELECT AVG(sleepquality) as quality FROM mornings WHERE user_id=$1 AND to_char(date,'IYYY-IW')=$2 \
        UNION ALL SELECT AVG(mood) AS mood FROM (SELECT mood FROM evenings WHERE user_id=$1 AND to_char(date,'IYYY-IW')=$2 \
        UNION ALL SELECT mood FROM mornings WHERE user_id=$1 AND to_char(date,'IYYY-IW')=$2) AS subquery\
        UNION ALL SELECT AVG(sports) FROM evenings WHERE user_id=$1 AND to_char(date,'IYYY-IW')=$2 \
        UNION ALL SELECT AVG(food) FROM evenings WHERE user_id=$1 AND to_char(date,'IYYY-IW')=$2 \
        UNION ALL SELECT AVG(reqularity) FROM evenings WHERE user_id=$1 AND to_char(date,'IYYY-IW')=$2 \
        UNION ALL SELECT AVG(study) FROM evenings WHERE user_id=$1 AND to_char(date,'IYYY-IW')=$2;", id,week);
        const objects=result.rowsOfObjects();
        const data={
            sleepTime: Number(typeof objects[0]!=='undefined' ?  objects[0].avg:("") ),
            sleepQuality: Number(typeof objects[1]!=='undefined' ?  objects[1].avg:("") ),
            mood: Number(typeof objects[2]!=='undefined' ?  objects[2].avg:("") ),
            sports:Number(typeof objects[3]!=='undefined' ?  objects[3].avg:("") ),
            food: Number(typeof objects[4]!=='undefined' ?  objects[4].avg:("") ),
            reqularity: Number(typeof objects[5]!=='undefined' ?  objects[5].avg:("") ),
            study: Number(typeof objects[6]!=='undefined' ?  objects[6].avg:("")),
            week: ISOWeek,
            errors:""
        }

    return data;

}

const getLastMonth= async(id, yearMonth)=>{

    const result= await executeQuery(
        "SELECT AVG(sleep) FROM mornings WHERE user_id=$1 AND to_char(date, 'YYYY-MM')=$2 \
        UNION ALL\
        SELECT AVG(sleepquality) as quality FROM mornings WHERE user_id=$1 AND to_char(date, 'YYYY-MM')=$2 \
        UNION ALL SELECT AVG(mood) AS mood FROM (SELECT mood FROM evenings WHERE user_id=$1 AND to_char(date, 'YYYY-MM')=$2 \
        UNION ALL SELECT mood FROM mornings WHERE user_id=$1 AND to_char(date, 'YYYY-MM')=$2) AS subquery\
        UNION ALL SELECT AVG(sports) FROM evenings WHERE user_id=$1 AND to_char(date, 'YYYY-MM')=$2 \
        UNION ALL SELECT AVG(food) FROM evenings WHERE user_id=$1 AND to_char(date, 'YYYY-MM')=$2 \
        UNION ALL SELECT AVG(reqularity) FROM evenings WHERE user_id=$1 AND to_char(date, 'YYYY-MM')=$2 \
        UNION ALL SELECT AVG(study) FROM evenings WHERE user_id=$1 AND to_char(date, 'YYYY-MM')=$2;", id,yearMonth);
        const objects=result.rowsOfObjects();
        const data={
            sleepTime: Number(typeof objects[0]!=='undefined' ?  objects[0].avg:("") ),
            sleepQuality: Number(typeof objects[1]!=='undefined' ?  objects[1].avg:("") ),
            mood: Number(typeof objects[2]!=='undefined' ?  objects[2].avg:("") ),
            sports:Number(typeof objects[3]!=='undefined' ?  objects[3].avg:("") ),
            food: Number(typeof objects[4]!=='undefined' ?  objects[4].avg:("") ),
            reqularity: Number(typeof objects[5]!=='undefined' ?  objects[5].avg:("") ),
            study: Number(typeof objects[6]!=='undefined' ?  objects[6].avg:("")),
            month:yearMonth,
            errors:""
        }

    return data;

}

export {getLastWeek, getDateOfISOWeek,validateISOData, getLastMonth,getPrevWeek, getLastDays, getSetDate};