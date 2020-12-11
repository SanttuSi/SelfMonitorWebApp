import {getUserInfo} from "../../services/userService.js";
import {getLastDays} from "../../services/summaryService.js";
const getRoot=async({render,session})=>{
    const user=await getUserInfo(session);
    const data = await getLastDays();
    data.user=user;
    render("index.ejs", data);
}


export{getRoot};