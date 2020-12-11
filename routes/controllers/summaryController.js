import {getUserInfo} from "../../services/userService.js";
import { getLastMonth, getLastWeek,validateISOData} from "../../services/summaryService.js";
const getISOWeek = async(tm)=> {
    let date = new Date(tm.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                          - 3 + (week1.getDay() + 6) % 7) / 7);
  }


const getSummary= async({render,session})=>{
    const user=await getUserInfo(session);
    const uid= user.id;
    const date=new Date();
    const week = await getISOWeek(date);
    const year= date.getFullYear();
    const yearMonth= date.toISOString().substring(0,7);
    const yearWeek= String(year) +'-W'+ String(week);
    const weekData= await getLastWeek(uid, yearWeek);
    const monthData= await getLastMonth(uid, yearMonth);
    render("summary.ejs",{weekData:weekData, monthData:monthData,user:user});
}

const postSummary= async({render, request,session})=>{
    const user=await getUserInfo(session);
    const uid= user.id;
    const body= request.body();
    const doc = await body.value;
    const date=doc.get("week");
    const month= doc.get("month");
    let passesW=false;
    let passesM=false;
    if (date && typeof date === 'string'){
        const year= date.substring(0,4);
        const week = date.substring(6,8);
        const val= await validateISOData({year: Number(year), week: Number(week)});
        if(val)
            passesW =true
    } if (month && typeof month=== 'string'){
        const yr= month.substring(0,4);
        const mn =month.substring(6,8);
        const val= await validateISOData({year: Number(yr), week: Number(mn)});
        if(val)
            passesM =true
    }
    const dateT=new Date();
    const weekT = await getISOWeek(dateT);
    const yearT= dateT.getFullYear();
    const yearMonth= dateT.toISOString().substring(0,7);
    const yearWeek= String(yearT) +'-W'+ String(weekT);
    let data={};
    if (passesW){
        data.weekData= await getLastWeek(uid, date);
        data.monthData=await getLastMonth(uid,yearMonth);
    }else if (passesM){
        data.monthData= await getLastMonth(uid,month);
        data.weekData= await getLastWeek(uid,yearWeek);
    }
    else{
        data= {errors: "Invalid input in the week field" }
    }
    data.user=user;

    render("summary.ejs", data);

}

export{getSummary,postSummary};