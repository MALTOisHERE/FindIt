# Large Sorted List Web Application

This project is a web application that efficiently loads and displays a large sorted list of user names (up to 10 million entries) without freezing the browser. It includes a backend (Node.js) for data processing and a frontend (React) for user interaction.

## Features

- Backend:

    Preprocesses a large users.txt file to create an index (index.json).

    Provides an API to fetch users by their starting letter (A-Z).

- Frontend:

    Displays alphabet buttons to select a letter.

    Shows a virtualized list of users (only renders visible items for performance).

    Automatically loads more users as you scroll.


## Technologies Used

- *Backend:* Node.js, Express

- *Frontend:* React, react-window

- *File Handling*: fs, readline (Node.js modules)


## Project Structure

```bash 
large-list-app/
├── backend/
│   ├── preprocess.js       # Preprocesses users.txt to create index.json
│   ├── server.js           # Backend API to fetch users
│   ├── users.txt           # Sample user names (one per line)
│   └── index.json          # Generated index file (created by preprocess.js)
├── frontend/
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── App.css         # Styles for the app
│   │   └── index.js        # Entry point for the React app
│   ├── package.json        # Frontend dependencies
│   └── README.md           # Frontend documentation
└── README.md               # Project documentation (this file)
```

## Setup Instructions

### 1. Prerequisites

Install Node.js (includes npm).

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install express
```

Preprocess the users.txt file:

```bash
node preprocess.js
```

Start the backend server:

```bash
node server.js
```

The backend will run on ```http://localhost:3001```.

### 3. Frontend Setup

Navigate to the ```frontend``` folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React app:

```bash
npm start
```

The frontend will run on ```http://localhost:3000```.

## How It Works

### Backend

#### Preprocessing:

    Reads users.txt line by line.

    Creates an index (index.json) with metadata for each letter (A-Z):

    _startOffset:_ Starting position of the letter in the file.

    _endOffset:_ Ending position of the letter in the file.

    _count:_ Number of users for the letter.

#### API Endpoints:

    */api/count/:letter:* Returns the total number of users for a letter.

    */api/users:* Fetches users for a letter (supports pagination).

### Frontend

#### Alphabet Menu:

    Displays buttons for each letter (A-Z).

    Clicking a button fetches users starting with that letter.

#### Search Bar:

    Filters the displayed users by name in real-time.

    Works locally (no additional API calls).

#### Virtualized List:

    Uses react-window to render only visible rows (saves memory for large lists).

    Automatically loads more users as you scroll.














