# Task Manager API

A simple RESTful API for managing users and tasks, built with Node.js, Express, and PostgreSQL.  
Supports user registration, authentication (JWT), and CRUD operations for tasks.

---

## Features

- **User Registration & Login**  
	Secure registration and login endpoints with password hashing (bcrypt) and JWT authentication.

- **Task Management**  
	Authenticated users can create, view, update, and delete their own tasks.

- **Authorization**  
	All task routes require a valid JWT token.

- **Error Handling**  
	Consistent JSON error responses for API clients.

---

## Endpoints

### User Endpoints

- `POST /users/register`  
	Register a new user.  
	**Body:**  
	```json
	{
		"email": "user@example.com",
		"password": "yourpassword"
	}
	```

- `POST /users/login`  
	Login and receive a JWT token.  
	**Body:**  
	```json
	{
		"email": "user@example.com",
		"password": "yourpassword"
	}
	```
	**Response:**  
	```json
	{
		"success": true,
		"data": {
			"token": "JWT_TOKEN",
			"user": { "user_id": "...", "email": "..." }
		}
	}
	```

### Task Endpoints (Require JWT)

Add header:  
`Authorization: Bearer YOUR_JWT_TOKEN`

- `POST /tasks`  
	Create a new task.  
	**Body:**  
	```json
	{
		"title": "Task title",
		"description": "Task description"
	}
	```

- `GET /tasks`  
	Get all tasks for the authenticated user.

- `GET /tasks/:id`  
	Get a single task by ID.

- `PUT /tasks/:id`  
	Update a task (e.g., status, title, description).  
	**Body:**  
	```json
	{
		"status": "completed"
	}
	```

- `DELETE /tasks/:id`  
	Delete a task.

---

## Setup

1. **Clone the repository**
	 ```sh
	 git clone https://github.com/yourusername/task-manager.git
	 cd task-manager
	 ```

2. **Install dependencies**
	 ```sh
	 npm install
	 ```

3. **Configure environment variables**  
	 Create a `.env` file in the root directory:
	 ```
	 JWT_SECRET=your-strong-secret
	 DATABASE_URL=postgres://user:password@localhost:5432/taskmanager
	 ```

4. **Set up PostgreSQL database**  
	 Create tables for `users` and `tasks` (see below).

5. **Start the server**
	 ```sh
	 npm start
	 ```

---

## Database Schema

**Users Table**
```sql
CREATE TABLE users (
	user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	email VARCHAR(255) UNIQUE NOT NULL,
	password_hash VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Tasks Table**
```sql
CREATE TABLE tasks (
	task_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
	title VARCHAR(255) NOT NULL,
	description TEXT,
	status VARCHAR(50) DEFAULT 'waiting',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Example Usage

**Register a user**
```sh
curl -X POST http://localhost:3000/users/register \
	-H "Content-Type: application/json" \
	-d '{"email":"john@example.com","password":"password123"}'
```

**Login**
```sh
curl -X POST http://localhost:3000/users/login \
	-H "Content-Type: application/json" \
	-d '{"email":"john@example.com","password":"password123"}'
```

**Create a task**
```sh
curl -X POST http://localhost:3000/tasks \
	-H "Content-Type:/json" \
	-H "Authorization: Bearer YOUR_JWT_TOKEN" \
	-d '{"title":"My Task","description":"Details"}'
```

---

## Project Structure

```
task-manager/
├── app.js
├── bin/
├── src/
│   ├── controllers/
│   │   ├── UserController.js
│   │   └── TaskController.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── users.js
│   │   └── tasks.js
│   ├── services/
│   │   ├── UserService.js
│   │   └── TaskService.js
│   └── config/
│       └── database.js
├── public/
├── package.json
└── README.md
```

---

## Security Notes

- Always use a strong `JWT_SECRET` in production.
- Keep dependencies updated and run `npm audit fix` regularly.
- Never expose sensitive information in error messages.

---

**Contributions welcome!**
