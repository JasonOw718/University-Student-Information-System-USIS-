# University Student Information System (USIS)

A Spring Boot REST API for managing university student information, course registrations, and academic records.

## Features

### **1. Authentication & Security**

* **Sign Up & Login**: Secure registration and login for both Students and Admins.
* **JWT-based Authentication**: Stateless session management.
* **Role-Based Access Control (RBAC)**: Distinct permissions for Students and Lecturers/Admins.
* **Secure Password Hashing**: Uses BCrypt for credential protection.

### **2. Student Module**

* **Profile Management**: View and **Update** personal profile information.
* **Course Management**:
  * **View Available Courses**.
  * Register for Courses.
  * Drop Courses (Pending approval).
* **Academic Records**: View Grades and CGPA.

### **3. Admin/Lecturer Module**

* **Course Management**:
  * Add & Delete Courses.
  * **View Available Courses**.
* **Student Management**:
  * Update Student Grades.
  * View Students enrolled in specific courses.
* **Registration Handling**:
  * View Pending Registrations.
  * Approve or Reject Course Registrations.

---

## Tech Stack

* **Java 17+**
* **Spring Boot 3.x**
* **Spring Security** (JWT Authentication)
* **Spring Data JPA**
* **Microsoft SQL Server** (Database)
* **Lombok** (Boilerplate reduction)

---

## Database Setup (Virtual Machine)

Since the database is hosted on a Virtual Machine (VM), follow these steps strictly to ensure connectivity and proper permission configuration.

### Phase 1: VM Network Configuration

1. **Set Network Adapter to Bridged Mode**:
   * **VirtualBox**: *Settings > Network > Adapter 1*. Set "Attached to" to **Bridged Adapter**.
   * **VMware**: *Player > Manage > Virtual Machine Settings > Network Adapter*. Select **Bridged: Connected directly to the physical network**.

2. **Enable Remote Connections (Inside VM)**:
   * Open **SQL Server Configuration Manager**.
   * Go to **SQL Server Network Configuration > Protocols for MSSQLSERVER**.
   * Enable **TCP/IP**.
   * Right-click **TCP/IP > Properties > IP Addresses**. Scroll to **IPAll** and set "TCP Port" to `1433`.
   * Restart the "SQL Server (MSSQLSERVER)" service.

3. **Open Firewall Port (Inside VM)**:
   * Open **Windows Defender Firewall with Advanced Security**.
   * Create a new **Inbound Rule** for **Port 1433 (TCP)**.
   * Allow the connection for Domain, Private, and Public networks.

---

### Phase 2: Connectivity Test

Before configuring the database, ensure your host machine can reach the VM.

1. Inside the VM, open Command Prompt and run `ipconfig`. Note the **IPv4 Address** (e.g., `192.168.3.237`).
2. On your **Host Machine**, open a terminal and ping the VM:

```bash
ping 192.168.3.237
```

3. **If the ping is successful**, proceed to Phase 3. If it fails, check your Firewall/Network settings.

---

### Phase 3: Database Initialization (SQL Developer Edition)

Perform the following steps inside **SQL Server Management Studio (SSMS)** on the VM using the **SQL Server Developer Edition**.

#### 1. Create Database

Login as Admin (Windows Auth or `sa`) and execute:

```sql
CREATE DATABASE [USIS_Project]
GO
```

#### 2. Create Tables

1. Open the SQL script located in your project folder: `/sql/create_tables.sql`.
2. Ensure the target database is set to **USIS_Project** in the SSMS toolbar.
3. **Execute** the script to create the tables (and the `university` schema if included in your script).

#### 3. Create Login & Assign Permissions

Once the database and tables are ready, create the specific application user and assign permissions.

```sql
-- 1. Create the Login (Default DB set to USIS_Project)
USE [master]
GO
CREATE LOGIN [webServer] WITH PASSWORD=N'webServer123', DEFAULT_DATABASE=[USIS_Project], CHECK_EXPIRATION=OFF, CHECK_POLICY=OFF
GO

-- 2. Create User and Grant Permissions
USE [USIS_Project]
GO

-- Create User linked to the Login
CREATE USER [webServer] FOR LOGIN [webServer]
GO

-- Grant permissions on the 'university' schema
GRANT SELECT, UPDATE, DELETE, EXECUTE ON SCHEMA::[university] TO [webServer]
GO
```

---

### Phase 4: Update Application Configuration

1. Open `src/main/resources/application.yaml` in the project.
2. Update the `url` with your VM's IP address.

```yaml
spring:
  datasource:
    # Replace 192.168.3.237 with your VM's IP Address
    url: jdbc:sqlserver://192.168.3.237:1433;databaseName=USIS_Project;encrypt=true;trustServerCertificate=true;
    username: webServer
    password: webServer123
  jpa:
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.SQLServerDialect
```

---

## Setup & Installation

1. **Clone the repository**:

```bash
git clone <repository-url>
cd project
```

2. **Build the project**:

```bash
./mvnw clean install
```

3. **Run the application**:

```bash
./mvnw  spring-boot:run
```

The server will start on port `8080` (default).

---

## API Documentation & Testing

You can explore and test the API endpoints (Signup, Login, Course Registration, etc.) using the provided Postman Collection.

**Important Notes on Authorization:**

* **JWT Token Required**:
  For **all API requests except Login and Sign Up**, you must include a valid JWT token.

* **How to Add the Token**:
  After a successful **Login or Sign Up**, a JWT token will be returned in the response message.
  Copy this token and add it under the **Authorization** tab in Postman:

  * Type: `Bearer Token`
  * Token: `<your-jwt-token>`

* **Without a Token**:
  Requests **will not proceed** and will be rejected by the server.

* **Role-Based Access Control**:

  * **Students** can only access **Student-related APIs**.
  * **Lecturers/Admins** can only access **Lecturer/Admin-related APIs**.
  * Accessing endpoints outside your role will result in an **Unauthorized / Forbidden** response.

**[View Postman Collection](https://www.google.com/search?q=https://postman.co/workspace/My-Workspace~d1e40ac2-fc42-44c0-888f-824a511c163b/request/37119317-359edb16-8d0a-4afa-a0ce-f9a44d7df900%3Faction%3Dshare%26creator%3D37119317%26ctx%3Ddocumentation)**

## UI MOCKUP
**[UI MOCKUP](https://JasonOw718.github.io/USIS_MOCKUP/)**

---

## Frontend

### Tech Stack

*   **React 19**: A JavaScript library for building user interfaces.
*   **Vite**: Fast frontend build tool.
*   **TypeScript**: Strongly typed programming language that builds on JavaScript.
*   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
*   **React Router DOM**: Declarative routing for React web applications.
*   **Axios**: Promise-based HTTP client for the browser.
*   **Lucide React**: Beautiful & consistent icon toolkit.

### Getting Started

To get the frontend running locally:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start the Development Server**:
    ```bash
    npm run dev
    ```
    The server typically starts at [http://localhost:5173](http://localhost:5173).

### Available Scripts

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the app for production.
*   `npm run lint`: Runs ESLint to check for code quality issues.
*   `npm run preview`: Locally preview the production build.

## SQL Server Implementation
Link to steps: https://www.notion.so/Assignment-1-2dea7ab1371e80ab9842f8b4665930bc?source=copy_link 
