import { executeQuery } from "../../database/database.js";
import {validateEmail,validatePW } from "../../services/reportingService.js";
import {getUserInfo} from "../../services/userService.js";
import {bcrypt} from '../../deps.js'

const getRegister = async({render,session})=>{
    const user=await getUserInfo(session);
    const data= {
        emailError:'',
        pwError:'',
        submitMessage:''
    };
    data.user=user;
    render('register.ejs',data);
}

const getLogin=async({render, session})=>{
    const user=await getUserInfo(session);
    const data={submitMessage:''};
    data.user=user;
    render("login.ejs", data);
}
const logOut = async({request, response, session}) => {
    const body = request.body();
    const params = await body.value;
    await session.set('authenticated', false);
    await session.set('user', {id: "", email: "" });
    response.redirect("/");
};

const postLogin=async({request, response, session,render}) => {
    const user=await getUserInfo(session);
    const body = request.body();
    const params = await body.value;
  
    const email = params.get('email');
    const password = params.get('password');
  
    // check if the email exists in the database
    const res = await executeQuery("SELECT * FROM users WHERE email = $1;", email);
    if (res.rowCount === 0) {
        render('login.ejs', {submitMessage: "The password or email is incorrect.",user:user})
        return;
    }
      // take the first row from the results
    const userObj = res.rowsOfObjects()[0];

    const hash = userObj.password;

    const passwordCorrect = await bcrypt.compare(password, hash);
    if (!passwordCorrect) {
        render('login.ejs', {submitMessage: "The password or email is incorrect.", user:user})
        return;
    }

    await session.set('authenticated', true);
    await session.set('user', {
        id: userObj.id,
        email: userObj.email
    });
    response.redirect("/");
    
}


const postRegister = async({render, request,session})=>{
    const user=await getUserInfo(session);
    const data= {
        emailError:'',
        pwError:'',
        submitMessage:''
    };
    data.user=user;

    const body = request.body();
    const params = await body.value;
    const email = params.get('email');
    const password = params.get('password');
    const verification = params.get('verification');

    if (password !== verification) {
        data.pwError = 'The entered passwords did not match.';
    }
    const existingUsers = await executeQuery("SELECT * FROM users WHERE email = $1", email);
    if (existingUsers.rowCount > 0) {
        data.emailError = 'The email is already reserved.';
    }
    const passesE= await validateEmail({ email:email});
    const passesP= await validatePW({ password:password});
    if (!passesP){
        data.pwError=data.pwError+ "Password must contain 4-60 characters.";
    }
    if(!passesE){
        data.emailError=data.emailError+ "Email must be a valid email."
    }

    if(passesE &&passesP &&(password === verification) && existingUsers.rowCount === 0){
        const hash = await bcrypt.hash(password);
        await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2);", email, hash);
        render("onReg.ejs",data);
        return;
    }

    render('register.ejs', data); 

}
export {getRegister,postRegister,postLogin,getLogin,logOut};