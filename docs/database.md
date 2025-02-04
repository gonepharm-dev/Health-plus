# Health Plus Database Architecture

## Overview
This document provides a detailed explanation of the **PocketHost data schema** used in the **Health Plus** telehealth MVP developed by **Gonep Pharmaceuticals**. It describes the database collections, fields, and relationships necessary for managing users, appointments, payments, video consultations, and chat messages.

## Collections & Schema Details
### 1. Users Collection
Manages all users in the system, including doctors, patients, and admins.

| Field Name       | Type      | Required | Unique | Description |
|-----------------|----------|----------|--------|-------------|
| username        | Text     | Yes      | No     | User's display name |
| email           | Email    | Yes      | Yes    | User's email address |
| password        | Password | Yes      | No     | Encrypted password |
| role            | Select   | Yes      | No     | User role: doctor, patient, or admin |
| full_name       | Text     | Yes      | No     | User's full name |
| profile_picture | File     | No       | No     | Profile image |
| specialization  | Text     | No       | No     | Only for doctors, area of specialization |
| contact_number  | Number   | No       | No     | Phone number |

---
### 2. Appointments Collection
Stores patient-doctor appointment details.

| Field Name         | Type      | Required | Description |
|-------------------|----------|----------|-------------|
| appointment_date  | Date     | Yes      | Scheduled date and time |
| status           | Select   | Yes      | Appointment status: scheduled, completed, or cancelled |
| doctor_id        | Relation | Yes      | Linked to the **Users** collection (Doctor) |
| patient_id       | Relation | Yes      | Linked to the **Users** collection (Patient) |
| notes            | Text     | No       | Additional notes |
| consultation_type| Select   | Yes      | Type of consultation: video or in-person |

---
### 3. Patient Records Collection
Stores a patient’s medical records, prescriptions, and history.

| Field Name       | Type      | Required | Description |
|-----------------|----------|----------|-------------|
| patient_id      | Relation | Yes      | Linked to **Users** (Patient) |
| record_date     | Date     | Yes      | Date of record entry |
| diagnosis       | Text     | Yes      | Diagnosis details |
| prescription    | Text     | No       | Prescribed medication |
| attachments     | File     | No       | Medical images or reports |

---
### 4. Payments Collection
Manages financial transactions for medical consultations.

| Field Name          | Type      | Required | Description |
|--------------------|----------|----------|-------------|
| patient_id        | Relation | Yes      | Linked to **Users** (Patient) |
| appointment_id    | Relation | No       | Linked to **Appointments** |
| payment_date      | Date     | Yes      | Date of transaction |
| amount           | Number   | Yes      | Amount paid |
| payment_status   | Select   | Yes      | Payment status: pending, completed, failed |
| payment_method   | Select   | Yes      | Method used: M-Pesa or card |
| transaction_reference | Text  | Yes      | Unique transaction reference |

---
### 5. Video Sessions Collection
Handles video consultation session details.

| Field Name      | Type      | Required | Description |
|---------------|----------|----------|-------------|
| appointment_id| Relation | Yes      | Linked to **Appointments** |
| session_start | Date     | Yes      | Start time of the session |
| session_end   | Date     | No       | End time of the session |
| session_url   | URL      | Yes      | WebRTC session link |

---
### 6. Chat Messages Collection
Stores messages exchanged between users in real-time.

| Field Name  | Type      | Required | Description |
|------------|----------|----------|-------------|
| sender_id  | Relation | Yes      | Linked to **Users** (Sender) |
| receiver_id| Relation | Yes      | Linked to **Users** (Receiver) |
| message    | Text     | Yes      | Message content |
| sent_at    | Date     | Yes      | Timestamp |
| read_status| Boolean  | No       | Read/unread flag |

## Deployment Steps
To implement this **PocketHost schema**, follow these steps:

1. **Install PocketHost:**
   ```sh
   wget https://github.com/pocketbase/pocketbase/releases/download/v0.20.0/pocketbase_0.20.0_linux_amd64.zip
   unzip pocketbase_0.20.0_linux_amd64.zip
   chmod +x pocketbase
   ./pocketbase serve --port=<YOUR_NEW_PORT>
   ```

2. **Set Up Collections:**
   - Navigate to the **PocketHost admin panel** (`http://<YOUR_DOMAIN>:<YOUR_NEW_PORT>/_/`)
   - Manually create the **collections** with the fields above
   - Configure **relations and constraints** as needed

3. **Implement Role-Based Access Control (RBAC):**
   - Define access rules per collection
   - Restrict patient records visibility to only assigned doctors
   - Ensure only **admin users** can manage payments

4. **Integrate PocketHost API with Frontend (SvelteKit):**
   - Use `fetch` or `pocketbase-js-sdk` to interact with the database
   - Example: Fetch all appointments for a doctor
     ```js
     import PocketBase from 'pocketbase';
     const pb = new PocketBase('http://<YOUR_DOMAIN>:<YOUR_NEW_PORT>');
     const appointments = await pb.collection('appointments').getList();
     console.log(appointments);
     ```

5. **Deploy PocketHost to Production:**
   - Use **Docker** or deploy on a cloud VM (AWS, DigitalOcean, etc.)
   - Set up a **reverse proxy** (Nginx) for security

