import type { NextFunction, Request, Response } from "express";
import SSE from "express-sse";
import AppError from "../utils/AppError";
import DatabaseInstance from "../middlewares/database";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { EventSource } from "eventsource";

// Assign EventSource to global scope for PocketBase
(global as any).EventSource = EventSource;

// Create a single SSE instance
const sse = new SSE();

// Track active subscriptions
const activeSubscriptions = new Set<string>();

// Ensure global sseClients object exists
if (!(global as any).sseClients) {
  (global as any).sseClients = {};
}

// Initialize PocketBase subscription for appointments
const initializeAppointmentSubscription = async () => {
  try {
    //console.log("🔄 Initializing PocketBase subscription for appointments");

    await DatabaseInstance.collection("Appointments").subscribe(
      "*",
      function (event) {
        // console.log(`📢 Event Type: ${event.action}`);
        // console.log("Updated Record:", event.record);

        // Send update to connected clients
        Object.keys((global as any).sseClients).forEach((userId) => {
          const sendUpdate = (global as any).sseClients[userId];
          if (typeof sendUpdate === "function") {
            sendUpdate({
              action: event.action,
              record: event.record, // Updated appointment data
            });
          }
        });
      }
    );

    //console.log("✅ Successfully subscribed to PocketBase appointments");
  } catch (error) {
    console.error("❌ Error initializing PocketBase subscription:", error);
  }
};

// Initialize subscription when the server starts
initializeAppointmentSubscription();

export const subscribeToAppointments = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate auth header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return next(new AppError("Invalid authorization header", 401));
    }

    // Verify token and get user ID
    const token = authHeader.split(" ")[1];
    const { id: userId } = jwt.decode(token) as JwtPayload;

    if (!userId) {
      return next(new AppError("Unauthorized: Missing user ID in token", 401));
    }

    // Set headers for SSE
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });

    // Add client to tracking set
    activeSubscriptions.add(userId);
    console.log(`📡 Client ${userId} connected to SSE`);

    // Send initial connection message
    res.write(
      `data: ${JSON.stringify({
        type: "connection",
        message: "Connected to appointment updates",
      })}\n\n`
    );

    // Event listener for appointment updates
    const sendUpdate = (updateData: any) => {
      if (res.writableEnded) return;
      res.write(`data: ${JSON.stringify(updateData)}\n\n`);
    };

    // Ensure global.sseClients exists and store reference
    (global as any).sseClients[userId] = sendUpdate;

    // Handle client disconnection
    req.on("close", () => {
      activeSubscriptions.delete(userId);
      delete (global as any).sseClients[userId];
      // console.log(`❌ Client ${userId} disconnected from SSE`);
    });

    // Send heartbeat every 5 seconds
    const heartbeat = setInterval(() => {
      if (res.writableEnded) {
        clearInterval(heartbeat);
        return;
      }
      res.write(`: heartbeat\n\n`);
    }, 5000);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Invalid or expired token", 401));
    }
    console.error("❌ SSE connection error:", error);
    return next(new AppError("Error establishing SSE connection", 500));
  }
};

// Utility to check if a user has an active subscription
export const hasActiveSubscription = (userId: string): boolean => {
  return activeSubscriptions.has(userId);
};