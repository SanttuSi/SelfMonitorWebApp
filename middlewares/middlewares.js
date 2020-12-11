import {send} from "../deps.js"
const errorMiddleware = async(context, next) => {
    try {
      await next();
    } catch (e) {
      console.log(e);
    }
}
const requestTimeAndMethod = async({ request,session }, next) => {
    const auth=await session.get('authenticated');
    let user="anonymous";
    if (auth){
      user=await session.get('user');
      user= user.id;
    }
    const start =Date.now();
    const stamp = Date();
    await next();
    const finished =Date.now();
    console.log(`${request.method} ${request.url.pathname} - ${finished-start} ms at ${stamp} by id: ${user}`);
}
const serveStaticFiles = async (context, next) => {
  if (context.request.url.pathname.startsWith('/static')) {
    const path = context.request.url.pathname.substring(7);
    await send(context, path, {
      root: `${Deno.cwd()}/static`
    });
  } else {
    await next();
  }
}

const limitAccessMiddleware = async(context, next) => {
  if (context.request.url.pathname===('/')  || context.request.url.pathname.startsWith('/auth') || context.request.url.pathname.startsWith('/api')) {
    await next();
  } else {
    const res=await context.session.get('authenticated');
    if (res) {
      await next();
    } else {
      context.response.redirect("/auth/login");
    };
  }
}

  
export { errorMiddleware, requestTimeAndMethod, serveStaticFiles,limitAccessMiddleware };