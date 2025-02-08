import express from "express";

import { subscribeToAppointments } from "../controllers/Appointment";
import { createAppointment } from "../controllers/Appointment/createAppointment";
import { getSingleDoctorAppointments, getSinglePatientAppointments } from "../controllers/Appointment/singleAppointment";
import { protect, RestrictTo } from "../controllers/AuthController";
import { updateAppointment } from "../controllers/Appointment/updateAppointment";
import { deleteAppointment } from "../controllers/Appointment/deleteAppointment";
import { getAllAppointments } from "../controllers/Appointment/getAllAppointments";

const router = express.Router();

// Route to create an appointment
router
    .route('/')
        .post(protect, createAppointment)
        .get(protect, getAllAppointments)

// GET route for subscribing to real-time updates (SSE)
router.route("/appointments").get(subscribeToAppointments)

router
    .route('/:id')
        .get(protect,getSinglePatientAppointments)
        .get(protect,getSingleDoctorAppointments)
        .patch(protect, RestrictTo('doctor','patient'), updateAppointment)
        .delete(protect,RestrictTo('doctor','patient'),deleteAppointment)

export default router;