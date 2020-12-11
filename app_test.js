import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import { assertEquals } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import {executeQuery} from "./database/database.js";
import {app} from "./app.js";





Deno.test({
    name: "get to /, should return 200 and and the landing page.", 
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/").expect(200).expect('Content-Type', new RegExp("text/html; charset=utf-8"));
    },
    sanitizeResources: false,
    sanitizeOps: false
});


Deno.test({
    name: "get to /behavior, should return 200 and and the login page.", 
    async fn() {
        const testClient = await superoak(app);
        const resp=await testClient.get("/behavior").expect(200).expect('Content-Type', new RegExp("text/html; charset=utf-8"));
        assertEquals(resp.text.includes('Login'),true);

    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "registration.", 
    async fn() {
        const testClient = await superoak(app);
        const resp=await testClient.post("/auth/registration").send("email=testbot@test.fi&password=1234&verification=1234").expect(200).expect('Content-Type', new RegExp("text/html; charset=utf-8"));
    },
    sanitizeResources: false,
    sanitizeOps: false
});


Deno.test({
    name: "login.", 
    async fn() {
        const testClient = await superoak(app);
        const resp=await testClient.post("/auth/login").send("email=testbot%40test.fi&password=1234");
        const cookie = resp.headers['set-cookie']
        assertEquals(cookie.includes('sid='),true);
    },
    sanitizeResources: false,
    sanitizeOps: false
});
Deno.test({
    name: "if API works with good inputs.", 
    async fn() {
        const testClient = await superoak(app);
        const resp=await testClient.get("/api/summary").expect('Content-Type', new RegExp('application/json'));
        const testClient2 = await superoak(app);
        const resp2=await testClient2.get("/api/summary/2020/01/01").expect('Content-Type', new RegExp('application/json'));
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "if API works with bad inputs.", 
    async fn() {
        const testClient = await superoak(app);
        const resp=await testClient.get("/api/summary/ffffff").expect(404);
        const testClient2 = await superoak(app);
        const resp2=await testClient2.get("/api/summary/2020/01/444444444").expect('Content-Type', new RegExp('application/json'));
        assertEquals(resp2.text, '{}');
    },
    sanitizeResources: false,
    sanitizeOps: false
});





