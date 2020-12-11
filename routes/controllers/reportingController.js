import * as reportingService from "../../services/reportingService.js";
import {getUserInfo} from "../../services/userService.js";
const dataFormat= {
    date:"",
    dateErrors: false,
    reqularity:"",
    regularityErrors:"",
    quality: "",
    qualityErrors: false,
    moodErrors:false,
    mood: "",
    time: "",
    study: "",
    studyErrors:"",
    timeErrors: false,
    errors: false,
    submitted:false
};

const report= async({render,session})=>{
    let data = JSON.parse(JSON.stringify(dataFormat));
    const user=await getUserInfo(session);
    const reports= await reportingService.getTodayStatus(user.id);
    data.user=user;
    data.morning=reports.morning;
    data.evening=reports.evening;
    render('report.ejs',data);
}
const getMorning = async({render, session} )=>{
    let data = JSON.parse(JSON.stringify(dataFormat));
    const user=await getUserInfo(session);
    data.user=user;
    render('morningReport.ejs', data);
}

const getEvening = async({render,session} )=>{
    let data = JSON.parse(JSON.stringify(dataFormat));
    const user=await getUserInfo(session);
    data.user=user;
    render('eveningReport.ejs', data);
}

const postMorning = async ({ request, render,session }) =>{
    const user=await getUserInfo(session);
    const uid=user.id;
    const body= request.body();
    const document= await body.value;
    let data = JSON.parse(JSON.stringify(dataFormat));
    data =await reportingService.validateMorningData(document, uid, data);
    data.user=user;
    render("morningReport.ejs", data);
}

const postEvening = async ({ request, render,session }) =>{
    const user=await getUserInfo(session);
    const uid=user.id;
    const body= request.body();
    const document= await body.value;
    let data = JSON.parse(JSON.stringify(dataFormat));
    data =await reportingService.validateEveningData(document, uid, data);
    data.user=user;
    render("eveningReport.ejs", data);
}



export { report, getMorning, postMorning, getEvening,postEvening };
