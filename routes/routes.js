import { Router } from "../deps.js";
import * as reportingController from "./controllers/reportingController.js";
import * as userController from "./controllers/userController.js";
import * as summaryController from "./controllers/summaryController.js";
import * as controller from "./controllers/controller.js";
import * as api from "./apis/api.js";


const router = new Router();

router.get("/behavior/reporting",reportingController.report);
router.get("/behavior/reporting/morning",reportingController.getMorning);
router.get("/behavior/reporting/evening",reportingController.getEvening);
router.get("/behavior/summary",summaryController.getSummary);
router.get("/auth/registration", userController.getRegister);
router.get("/auth/login", userController.getLogin);
router.get("/", controller.getRoot);
router.get("/auth/logout", userController.logOut);
router.get("/api/summary",api.getWeek);
router.get("/api/summary/:year/:month/:day",api.getDay);

router.post("/", controller.getRoot);
router.post("/auth/login", userController.postLogin);
router.post("/auth/registration", userController.postRegister);
router.post("/behavior/reporting/evening",reportingController.postEvening);
router.post("/behavior/summary",summaryController.postSummary);
router.post("/behavior/reporting/morning", reportingController.postMorning);

export { router };