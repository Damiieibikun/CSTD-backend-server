# CSTD Website API

## Overview
This is a robust and scalable backend API for the CSTD (Center for Satellite Technology Development) website, built with Node.js and the Express.js framework. It provides comprehensive content management capabilities, handling administrative tasks, dynamic page content, news, events, projects, publications, and user feedback, all powered by MongoDB for data persistence and Cloudinary for media storage.

## Features
*   ⚙️ **Admin Management**: Secure authentication, user roles (admin, webmaster, media), and CRUD operations for managing administrators.
*   📄 **Dynamic Page Content**: Flexible API for creating and managing website pages and their dynamic content sections.
*   📰 **News & Events Management**: Tools for publishing, retrieving, updating, and deleting news articles and event details with media support.
*   📚 **Projects & Publications**: Dedicated modules for showcasing organizational projects and research publications.
*   💬 **User Feedback System**: Collect and manage inquiries and feedback submitted by website visitors.
*   🦶 **Footer Configuration**: Dynamic management of website footer content, including links and social media.
*   ☁️ **Cloud Media Storage**: Seamless integration with Cloudinary for efficient image and video management.
*   🔒 **Robust Validation**: Utilizes Zod for strict schema validation, ensuring data integrity and security.

## Getting Started

### Installation
To get this project up and running on your local machine, follow these steps:

*   **1. Clone the Repository:**
    ```bash
    git clone git@github.com:Damiieibikun/CSTD-backend-server.git
    cd CSTD-backend-server
    ```

*   **2. Install Dependencies:**
    ```bash
    npm install
    ```

### Environment Variables
Create a `.env` file in the root directory of the project and populate it with the following required environment variables:

```
PORT=8080
DB_URL=mongodb://localhost:27017/cstd_website
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

*   `PORT`: The port on which the server will run.
*   `DB_URL`: The MongoDB connection string.
*   `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name for media storage.
*   `CLOUDINARY_API_KEY`: Your Cloudinary API key.
*   `CLOUDINARY_API_SECRET`: Your Cloudinary API secret.

### Running the Project
Once the dependencies are installed and environment variables are configured, you can start the server:

```bash
npm run dev
```
The server will start on the port specified in your `.env` file (e.g., `http://localhost:8080`).

## API Documentation

### Base URL
The base URL for all API endpoints is: `http://localhost:[PORT]/api/CSTDsite` (replace `[PORT]` with your configured port).

### Endpoints

---
#### Admin Endpoints

#### GET /admin/alladmins
Retrieves a list of all administrators, excluding webmasters and sensitive information like passwords.

**Request**:
No request body required.

**Response**:
```json
{
  "success": true,
  "message": "Admin Fetched successfully!",
  "data": [
    {
      "_id": "65b7d9c0e5b7e9f0a7c6d5b4",
      "firstname": "John",
      "lastname": "Doe",
      "phone": "08012345678",
      "email": "john.doe@example.com",
      "role": "admin",
      "approved": true,
      "status": "approved",
      "createdAt": "2024-01-29T12:00:00.000Z",
      "updatedAt": "2024-01-29T12:00:00.000Z"
    }
  ]
}
```

**Errors**:
- `500 Internal Server Error`: Could not Fetch admin details.

---
#### POST /admin/createadmin
Creates a new administrative user with a specified role.

**Request**:
```json
{
  "firstname": "Jane",
  "lastname": "Smith",
  "phone": "09012345678",
  "email": "jane.smith@example.com",
  "password": "SecurePassword123!",
  "role": "media"
}
```
**Required Fields**: `firstname`, `lastname`, `phone`, `email`, `password`. `role` is optional, defaults to 'admin'.

**Response**:
```json
{
  "success": true,
  "message": "Admin Created successfully!"
}
```

**Errors**:
- `401 Unauthorized`: Validation error (e.g., invalid email, weak password), Admin already exists.
- `500 Internal Server Error`: Could not create Admin.

---
#### POST /admin/createwebmaster
Creates a new webmaster user. This role is automatically approved.

**Request**:
```json
{
  "firstname": "Web",
  "lastname": "Master",
  "phone": "07011223344",
  "email": "web.master@example.com",
  "password": "WebmasterPass123!"
}
```
**Required Fields**: `firstname`, `lastname`, `phone`, `email`, `password`. `role` is automatically set to 'webmaster' and `approved` to `true`.

**Response**:
```json
{
  "success": true,
  "message": "Admin Created successfully!"
}
```

**Errors**:
- `401 Unauthorized`: Validation error, Admin already exists.
- `500 Internal Server Error`: Could not create Admin.

---
#### POST /admin/login
Authenticates an administrator.

**Request**:
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```
**Required Fields**: `email`, `password`.

**Response**:
```json
{
  "success": true,
  "message": "Logged in successfully!",
  "data": {
    "id": "65b7d9c0e5b7e9f0a7c6d5b4",
    "firstname": "John",
    "lastname": "Doe",
    "role": "admin",
    "email": "john.doe@example.com",
    "phone": "08012345678"
  }
}
```

**Errors**:
- `401 Unauthorized`: Validation error, Incorrect Password!, *Unable to log in, Please Contact Admin for further assistance (if admin is not approved).
- `404 Not Found`: Admin not Found.
- `500 Internal Server Error`: Error in logging in Admin.

---
#### PUT /admin/approve/:id
Approves a pending administrator account.

**Request**:
No request body required.
`id`: Admin ID to approve, provided as a URL parameter.

**Response**:
```json
{
  "success": true,
  "message": "Admin approved successfully",
  "data": {
    "_id": "65b7d9c0e5b7e9f0a7c6d5b4",
    "firstname": "John",
    "lastname": "Doe",
    "phone": "08012345678",
    "email": "john.doe@example.com",
    "password": "hashed_password",
    "role": "admin",
    "approved": true,
    "status": "approved",
    "createdAt": "2024-01-29T12:00:00.000Z",
    "updatedAt": "2024-01-29T12:00:00.000Z"
  }
}
```

**Errors**:
- `401 Unauthorized`: Admin ID is required, Admin cannot be approved (if webmaster).
- `404 Not Found`: Admin does not exist.
- `500 Internal Server Error`: Error in approving Admin.

---
#### PUT /admin/deny/:id
Denies a pending administrator account.

**Request**:
No request body required.
`id`: Admin ID to deny, provided as a URL parameter.

**Response**:
```json
{
  "success": true,
  "message": "Admin Denied successfully",
  "data": {
    "_id": "65b7d9c0e5b7e9f0a7c6d5b4",
    "firstname": "John",
    "lastname": "Doe",
    "phone": "08012345678",
    "email": "john.doe@example.com",
    "password": "hashed_password",
    "role": "admin",
    "approved": false,
    "status": "denied",
    "createdAt": "2024-01-29T12:00:00.000Z",
    "updatedAt": "2024-01-29T12:00:00.000Z"
  }
}
```

**Errors**:
- `401 Unauthorized`: Admin ID is required, Admin cannot be Denied (if webmaster).
- `404 Not Found`: Admin does not exist.
- `500 Internal Server Error`: Error in denying Admin.

---
#### PUT /admin/changePwdAdmin
Changes an administrator's password.

**Request**:
```json
{
  "id": "65b7d9c0e5b7e9f0a7c6d5b4",
  "currentPassword": "SecurePassword123!",
  "newPassword": "NewSecurePassword456!",
  "passwordConfirm": "NewSecurePassword456!"
}
```
**Required Fields**: `id`, `currentPassword`, `newPassword`, `passwordConfirm`. `newPassword` and `passwordConfirm` must match.

**Response**:
```json
{
  "success": true,
  "message": "Password updated successfully!",
  "data": {
    "id": "65b7d9c0e5b7e9f0a7c6d5b4",
    "firstname": "John",
    "lastname": "Doe",
    "role": "admin",
    "email": "john.doe@example.com",
    "phone": "08012345678"
  }
}
```

**Errors**:
- `401 Unauthorized`: Validation error, ID is required, Invalid Password!
- `500 Internal Server Error`: Could not change admin password.

---
#### PUT /admin/editAdmin
Edits an administrator's details (firstname, lastname, email, phone).

**Request**:
```json
{
  "id": "65b7d9c0e5b7e9f0a7c6d5b4",
  "firstname": "Jonathan",
  "lastname": "Doe",
  "email": "jonathan.doe@example.com",
  "phone": "08011223344"
}
```
**Required Fields**: `id`, `firstname`, `lastname`, `email`, `phone`.

**Response**:
```json
{
  "success": true,
  "message": "Admin updated successfully!",
  "data": {
    "id": "65b7d9c0e5b7e9f0a7c6d5b4",
    "firstname": "Jonathan",
    "lastname": "Doe",
    "role": "admin",
    "email": "jonathan.doe@example.com",
    "phone": "08011223344"
  }
}
```

**Errors**:
- `401 Unauthorized`: Validation error, ID is required, Admin Not Found or does not exist!
- `500 Internal Server Error`: Could not change admin password (controller message).

---
#### DELETE /admin/delete/:id
Deletes an administrator account.

**Request**:
No request body required.
`id`: Admin ID to delete, provided as a URL parameter.

**Response**:
```json
{
  "success": true,
  "message": "Deleted Successfully!"
}
```

**Errors**:
- `401 Unauthorized`: Admin ID is required.
- `404 Not Found`: Admin not Found.
- `500 Internal Server Error`: Could not delete Admin.

---
#### Events Endpoints

#### POST /events/createevent
Creates a new event.

**Request**:
```json
{
  "title": "Annual CSTD Conference",
  "description": "A conference discussing sustainable technologies.",
  "date": "2024-10-26",
  "time": "09:00",
  "location": "Lagos, Nigeria",
  "flyer": "https://example.com/event_flyer.jpg"
}
```
**Required Fields**: `title`, `description`, `date` (YYYY-MM-DD), `time` (HH:MM), `location`, `flyer` (URL or base64 string).

**Response**:
```json
{
  "success": true,
  "message": "Event Created successfully!"
}
```

**Errors**:
- `401 Unauthorized`: Validation error (e.g., invalid date/time format, missing fields).
- `500 Internal Server Error`: Could not post event.

---
#### GET /events/fetchevents
Retrieves all events.

**Request**:
No request body required.

**Response**:
```json
{
  "success": true,
  "message": "Events fetched successfully!",
  "data": [
    {
      "_id": "65b7d9c0e5b7e9f0a7c6d5b5",
      "title": "Annual CSTD Conference",
      "description": "A conference discussing sustainable technologies.",
      "date": "2024-10-26T00:00:00.000Z",
      "time": "09:00",
      "location": "Lagos, Nigeria",
      "flyer": "https://example.com/event_flyer.jpg",
      "createdAt": "2024-01-29T12:00:00.000Z",
      "updatedAt": "2024-01-29T12:00:00.000Z"
    }
  ]
}
```

**Errors**:
- `500 Internal Server Error`: Could not fetch news (controller message).

---
#### DELETE /events/delete/:id
Deletes an event by its ID.

**Request**:
No request body required.
`id`: Event ID to delete, provided as a URL parameter.

**Response**:
```json
{
  "success": true,
  "message": "Event Deleted successfully!"
}
```

**Errors**:
- `404 Not Found`: Event not found.
- `500 Internal Server Error`: Could not delete event.

---
#### PUT /events/edit/:id
Updates an existing event's details.

**Request**:
```json
{
  "title": "Revised CSTD Conference",
  "description": "An updated description of the conference.",
  "date": "2024-10-27",
  "time": "10:00",
  "location": "Abuja, Nigeria",
  "flyer": "https://example.com/new_event_flyer.jpg"
}
```
**Required Fields**: `title`, `description`, `date`, `time`, `location`, `flyer`.
`id`: Event ID to edit, provided as a URL parameter.

**Response**:
```json
{
  "success": true,
  "message": "Event edited successfully!"
}
```

**Errors**:
- `401 Unauthorized`: Validation error.
- `404 Not Found`: Could not edit event.
- `500 Internal Server Error`: Could not edit event.

---
#### Footer Endpoints

#### GET /footer/getfooter
Retrieves the website footer content.

**Request**:
No request body required.

**Response**:
```json
{
  "success": true,
  "message": "Footer fetched successfully!",
  "data": [
    {
      "_id": "65b7d9c0e5b7e9f0a7c6d5b6",
      "logo": "https://example.com/logo.png",
      "description": "CSTD is dedicated to...",
      "copyright": "© 2024 CSTD. All rights reserved.",
      "columns": [
        {
          "id": 1,
          "title": "Quick Links",
          "links": [
            {"id": 1, "text": "About Us", "url": "/about"},
            {"id": 2, "text": "Contact", "url": "/contact"}
          ]
        }
      ],
      "socialLinks": [
        {"id": 1, "platform": "facebook", "url": "https://facebook.com/cstd"}
      ],
      "createdAt": "2024-01-29T12:00:00.000Z",
      "updatedAt": "2024-01-29T12:00:00.000Z"
    }
  ]
}
```

**Errors**:
- `500 Internal Server Error`: Could not fetch Footer.

---
#### POST /footer/addfooter
Adds new footer content. This is typically a one-time operation to initialize the footer.

**Request**:
```json
{
  "logo": "https://example.com/logo.png",
  "description": "A brief description of the organization.",
  "copyright": "© 2024 CSTD. All rights reserved.",
  "columns": [
    {
      "id": 1,
      "title": "About",
      "links": [
        {"id": 1, "text": "Our Mission", "url": "/mission"}
      ]
    }
  ],
  "socialLinks": [
    {"id": 1, "platform": "twitter", "url": "https://twitter.com/cstd"}
  ]
}
```
**Required Fields**: `id`, `text`, `url` for links; `id`, `title` for columns; `id`, `platform`, `url` for social links. `logo`, `description`, `copyright`, `columns`, `socialLinks` are optional or can be empty arrays.

**Response**:
```json
{
  "success": true,
  "message": "Footer added!",
  "data": {
    "_id": "65b7d9c0e5b7e9f0a7c6d5b6",
    "logo": "https://example.com/logo.png",
    "description": "A brief description of the organization.",
    "copyright": "© 2024 CSTD. All rights reserved.",
    "columns": [...],
    "socialLinks": [...],
    "createdAt": "2024-01-29T12:00:00.000Z",
    "updatedAt": "2024-01-29T12:00:00.000Z"
  }
}
```

**Errors**:
- `401 Unauthorized`: Validation error.
- `500 Internal Server Error`: Could not add Footer.

---
#### PUT /footer/updatefooter/:id
Updates existing footer content.

**Request**:
```json
{
  "logo": "https://example.com/new_logo.png",
  "description": "Updated description for the organization.",
  "columns": [
    {
      "id": 1,
      "title": "About CSTD",
      "links": [
        {"id": 1, "text": "Our Mission", "url": "/mission"},
        {"id": 2, "text": "Our Vision", "url": "/vision"}
      ]
    }
  ]
}
```
**Required Fields**: `id`, `text`, `url` for links; `id`, `title` for columns; `id`, `platform`, `url` for social links.
`id`: Footer document ID to update, provided as a URL parameter.

**Response**:
```json
{
  "success": true,
  "message": "Footer updated successfully!",
  "data": {
    "_id": "65b7d9c0e5b7e9f0a7c6d5b6",
    "logo": "https://example.com/new_logo.png",
    "description": "Updated description for the organization.",
    "copyright": "© 2024 CSTD. All rights reserved.",
    "columns": [...],
    "socialLinks": [...],
    "createdAt": "2024-01-29T12:00:00.000Z",
    "updatedAt": "2024-01-29T12:00:00.000Z"
  }
}
```

**Errors**:
- `401 Unauthorized`: ID is required, Validation error.
- `404 Not Found`: Footer not found.
- `500 Internal Server Error`: Could not update Footer.

---
#### News Endpoints

#### POST /news/createnews
Creates a new news article, including media files.

**Request**:
`Content-Type`: `multipart/form-data`

**Body Fields**:
- `title` (string, required): Title of the news article.
- `date` (string, required): Date of the news article (e.g., "2024-01-29").
- `brief` (string, required): A brief description or summary of the news.
- `content` (string, required): Full content of the news article.
- `me dia` (file[], optional): Array of image or video files (up to 10).

**Response**:
```json
{
  "success": true,
  "message": "News Created successfully!"
}
```

**Errors**:
- `400 Bad Request`: Validation error, Missing required files: media.
- `500 Internal Server Error`: Could not post news.

---
#### GET /news/fetchnews
Retrieves all news articles.

**Request**:
No request body required.

**Response**:
```json
{
  "success": true,
  "message": "News fetched successfully!",
  "data": [
    {
      "_id": "65b7d9c0e5b7e9f0a7c6d5b7",
      "title": "CSTD New Initiative",
      "date": "January 29, 2024",
      "brief": "A brief overview of the new initiative.",
      "content": "Detailed content about the new initiative...",
      "media": [
        {
          "type": "image",
          "url": "https://res.cloudinary.com/damiieibikun/image/upload/v1706505600/news-arrayposts/image1.jpg",
          "thumbnail": "https://res.cloudinary.com/damiieibikun/image/upload/v1706505600/news-arrayposts/image1.jpg",
          "public_id": "news-arrayposts/image1"
        }
      ],
      "createdAt": "2024-01-29T12:00:00.000Z",
      "updatedAt": "2024-01-29T12:00:00.000Z",
      "formattedDate": "January 29, 2024"
    }
  ]
}
```

**Errors**:
- `500 Internal Server Error`: Could not fetch news.

---
#### DELETE /news/delete/:id
Deletes a news article by its ID, including associated media from Cloudinary.

**Request**:
No request body required.
`id`: News article ID to delete, provided as a URL parameter.

**Response**:
```json
{
  "success": true,
  "message": "News Deleted successfully!"
}
}
```

**Errors**:
- `404 Not Found`: News not found.
- `500 Internal Server Error`: Could not delete news.

---
#### PUT /news/edit/:id
Updates an existing news article, including handling new or existing media files.

**Request**:
`Content-Type`: `multipart/form-data`

**Body Fields**:
- `title` (string, required): Updated title.
- `date` (string, required): Updated date.
- `brief` (string, required): Updated brief description.
- `content` (string, required): Updated full content.
- `media` (file[] or JSON string, optional):
    - If new files are uploaded, include them as `file[]`. Existing media associated with the article will be replaced.
    - If no new files, and you want to keep existing media or remove some, send a JSON string of the *remaining* media objects (including `public_id`) as a string:
    `"media": "[{\"type\":\"image\",\"url\":\"...\",\"public_id\":\"...\"}]"`

**Response**:
```json
{
  "success": true,
  "message": "News edited successfully!",
  "data": {
    "_id": "65b7d9c0e5b7e9f0a7c6d5b7",
    "title": "CSTD Updated Initiative",
    "date": "February 1, 2024",
    "brief": "An updated brief overview.",
    "content": "Updated detailed content...",
    "media": [
      {
        "type": "image",
        "url": "https://res.cloudinary.com/damiieibikun/image/upload/v1706505601/news-arrayposts/new_image.jpg",
        "thumbnail": "https://res.cloudinary.com/damiieibikun/image/upload/v1706505601/news-arrayposts/new_image.jpg",
        "public_id": "news-arrayposts/new_image"
      }
    ],
    "createdAt": "2024-01-29T12:00:00.000Z",
    "updatedAt": "2024-01-29T13:00:00.000Z",
    "formattedDate": "February 1, 2024"
  }
}
```

**Errors**:
- `400 Bad Request`: Validation error.
- `404 Not Found`: News not found, Could not edit news.
- `500 Internal Server Error`: Could not edit news.

---
#### Pages Endpoints

#### POST /pages/create
Creates a new static page link for navigation with an associated `pageId`.

**Request**:
```json
{
  "pageId": "about-us",
  "pageName": "About Us",
  "pageType": "Main",
  "icon": "fa:FaInfoCircle",
  "path": "/about"
}
```
**Required Fields**: `pageId`, `pageName`, `pageType`, `path`. `icon` is optional.

**Response**:
```json
{
  "success": true,
  "message": "Link created successfully!",
  "data": {
    "_id": "65b7d9c0e5b7e9f0a7c6d5b8",
    "pageId": "about-us",
    "pageName": "About Us",
    "pageType": "Main",
    "icon": "fa:FaInfoCircle",
    "path": "/about",
    "children": [],
    "content": {},
    "createdAt": "2024-01-29T12:00:00.000Z",
    "updatedAt": "2024-01-29T12:00:00.000Z"
  }
}
```

**Errors**:
- `400 Bad Request`: Page already exists.
- `401 Unauthorized`: Validation error.
- `500 Internal Server Error`: Could not Create page.

---
#### GET /pages/links
Retrieves all configured page links for navigation.

**Request**:
No request body required.

**Response**:
```json
{
  "success": true,
  "message": "Page Links Fetched successfully",
  "data": [
    {
      "_id": "65b7d9c0e5b7e9f0a7c6d5b8",
      "pageId": "about-us",
      "pageName": "About Us",
      "pageType": "Main",
      "icon": "fa:FaInfoCircle",
      "path": "/about",
      "children": [],
      "content": {},
      "createdAt": "2024-01-29T12:00:00.000Z",
      "updatedAt": "2024-01-29T12:00:00.000Z"
    }
  ]
}
```

**Errors**:
- `500 Internal Server Error`: Could not Create page (controller message).

---
#### PUT /pages/update/:id
Updates the details of a specific page link.

**Request**:
```json
{
  "pageName": "About Our Organization",
  "path": "/our-story"
}
```
**Required Fields**: `pageId`, `pageName`, `pageType`, `path`. Other fields (`icon`, `children`, `content`) are optional and can be updated.
`id`: Page document ID to update, provided as a URL parameter.

**Response**:
```json
{
  "success": true,
  "message": "Link updated successfully!",
  "data": {
    "_id": "65b7d9c0e5b7e9f0a7c6d5b8",
    "pageId": "about-us",
    "pageName": "About Our Organization",
    "pageType": "Main",
    "icon": "fa:FaInfoCircle",
    "path": "/our-story",
    "children": [],
    "content": {},
    "createdAt": "2024-01-29T12:00:00.000Z",
    "updatedAt": "2024-01-29T13:00:00.000Z"
  }
}
```

**Errors**:
- `401 Unauthorized`: ID is required, Validation error.
- `404 Not Found`: Link not found.
- `500 Internal Server Error`: Could not update Link.

---
#### DELETE /pages/delete/:id
Deletes a page link by its ID.

**Request**:
No request body required.
`id`: Page document ID to delete, provided as a URL parameter.

**Response**:
```json
{
  "success": true,
  "message": "Page deleted successfully!"
}
```

**Errors**:
- `401 Unauthorized`: Could not delete Page (ID is required).
- `404 Not Found`: Page not found!
- `500 Internal Server Error`: Could not delete page.

---
#### GET /pages/:pageId
Retrieves the dynamic content for a specific page.

**Request**:
No request body required.
`pageId`: The unique identifier of the page (e.g., "about-us"), provided as a URL parameter.

**Response**:
```json
{
  "success": true,
  "message": "Page Fetched successfully!",
  "data": {
    "id": "65b7d9c0e5b7e9f0a7c6d5b8",
    "content": {
      "heroSection": {
        "title": "Welcome to CSTD",
        "description": "Advancing sustainable technology."
      },
      "missionSection": {
        "heading": "Our Mission",
        "text": "To foster innovation..."
      }
    }
  }
}
```

**Errors**:
- `401 Unauthorized`: Page ID is required.
- `404 Not Found`: Page Not Found.
- `500 Internal Server Error`: Could not fetch research page (controller message).

---
#### PUT /pages/updatepage/:pageId
Updates the dynamic content of a specific page. This allows adding, updating, or deleting content sections.

**Request**:
```json
{
  "content": {
    "heroSection": {
      "title": "Updated Welcome Message",
      "imageUrl": "https://example.com/hero_image.jpg"
    },
    "newSection": {
      "heading": "New Content",
      "text": "This is a new section."
    },
    "missionSection": {
      "delete": true
    }
  }
}
```
**Required Fields**: `content` (object).
`pageId`: The unique identifier of the page, provided as a URL parameter.
The `content` object can include new sections, update existing ones, or delete sections by setting `{ "sectionKey": { "delete": true } }`.

**Response**:
```json
{
  "success": true,
  "message": "Page updated successfully!",
  "content": {
    "heroSection": {
      "title": "Updated Welcome Message",
      "imageUrl": "https://example.com/hero_image.jpg",
      "description": "Advancing sustainable technology."
    },
    "newSection": {
      "heading": "New Content",
      "text": "This is a new section."
    }
  }
}
```

**Errors**:
- `400 Bad Request`: Content must be a valid object, Invalid content format for section "sectionKey".
- `401 Unauthorized`: Page ID is required.
- `404 Not Found`: Page not found.
- `500 Internal Server Error`: Could not update page.

---
#### Projects Endpoints

#### POST /project/addupcomingproject
Adds a new upcoming project.

**Request**:
```json
{
  "title": "Renewable Energy Research",
  "objective": "To develop sustainable energy solutions.",
  "output": "Research papers, prototype",
  "partners": "University of Tech",
  "technology": "Solar, Wind",
  "importance": "Crucial for climate change"
}
```
**Required Fields**: `title`, `objective`. `output`, `partners`, `technology`, `importance` are optional. `category` is automatically set to 'upcoming'.

**Response**:
```json
{
  "success": true,
  "message": "Project added successfully!"
}
```

**Errors**:
- `401 Unauthorized`: Validation error.
- `500 Internal Server Error`: Could not add Project.

---
#### POST /project/addpastproject
Adds a new past project.

**Request**:
```json
{
  "title": "Water Purification Initiative",
  "objective": "To provide clean drinking water.",
  "output": "Water filtration systems",
  "partners": "Local NGOs",
  "technology": "Membrane filtration",
  "importance": "Improved community health"
}
```
**Required Fields**: `title`, `objective`. `output`, `partners`, `technology`, `importance` are optional. `category` is automatically set to 'past'.

**Response**:
```json
{
  "success": true,
  "message": "Project added successfully!"
}
```

**Errors**:
- `401 Unauthorized`: Validation error.
- `500 Internal Server Error`: Could not add Project.

---
#### GET /project/getprojects
Retrieves projects. Can filter by category.

**Request**:
No request body required.
**Query Parameters**:
- `cat` (string, optional): Filter by project category ('upcoming' or 'past').

**Response (without `cat` query)**:
```json
{
  "success": true,
  "message": "Project fetched successfully!",
  "data": [
    {
      "_id": "65b7d9c0e5b7e9f0a7c6d5b9",
      "title": "Renewable Energy Research",
      "objective": "To develop sustainable energy solutions.",
      "category": "upcoming",
      "createdAt": "2024-01-29T12:00:00.000Z",
      "updatedAt": "2024-01-29T12:00:00.000Z"
    }
  ]
}
```

**Errors**:
- `404 Not Found`: Projects not found (if `cat` is specified and no projects match).
- `500 Internal Server Error`: Could not get Projects.

---
#### DELETE /project/deleteproject/:id
Deletes a project by its ID.

**Request**:
No request body required.
`id`: Project ID to delete, provided as a URL parameter.

**Response**:
```json
{
  "success": true,
  "message": "Project deleted successfully!"
}
```

**Errors**:
- `404 Not Found`: Project not found.
- `500 Internal Server Error`: Could not delete project.

---
#### PUT /project/editproject/:id
Updates an existing project's details.

**Request**:
```json
{
  "title": "Updated Renewable Energy Research",
  "objective": "Refined objective for sustainable energy solutions.",
  "technology": "Advanced Solar, Wind Turbines"
}
```
**Required Fields**: `title`, `objective`. Other fields are optional.
`id`: Project ID to edit, provided as a URL parameter.

**Response**:
```json
{
  "success": true,
  "message": "Project edited successfully!"
}
```

**Errors**:
- `401 Unauthorized`: Validation error, ID is required.
- `404 Not Found`: Project not found.
- `500 Internal Server Error`: Could not edit Project.

---
#### Publications Endpoints

#### POST /pub/addpublication
Adds a new publication.

**Request**:
```json
{
  "title": "A Study on Climate Resilience",
  "summary": "This publication explores methods for enhancing climate resilience in urban areas.",
  "authors": "Dr. A. B. Smith, Prof. C. D. Jones",
  "link": "https://example.com/climate_resilience.pdf",
  "date": "2023-11-15"
}
```
**Required Fields**: `title`, `summary`, `authors` (comma-separated string), `link` (URL), `date` (YYYY-MM-DD).

**Response**:
```json
{
  "success": true,
  "message": "Publication added successfully!"
}
```

**Errors**:
- `401 Unauthorized`: Validation error.
- `500 Internal Server Error`: Could not add Publication.

---
#### GET /pub/getpublications
Retrieves all publications.

**Request**:
No request body required.

**Response**:
```json
{
  "success": true,
  "message": "Publications fetched successfully!",
  "data": [
    {
      "_id": "65b7d9c0e5b7e9f0a7c6d5ba",
      "title": "A Study on Climate Resilience",
      "summary": "This publication explores methods for enhancing climate resilience in urban areas.",
      "authors": ["Dr. A. B. Smith", "Prof. C. D. Jones"],
      "link": "https://example.com/climate_resilience.pdf",
      "date": "2023-11-15",
      "createdAt": "2024-01-29T12:00:00.000Z",
      "updatedAt": "2024-01-29T12:00:00.000Z"
    }
  ]
}
```

**Errors**:
- `500 Internal Server Error`: Could not get Publications.

---
#### DELETE /pub/deletepublication/:id
Deletes a publication by its ID.

**Request**:
No request body required.
`id`: Publication ID to delete, provided as a URL parameter.

**Response**:
```json
{
  "success": true,
  "message": "Publication deleted successfully!"
}
```

**Errors**:
- `404 Not Found`: Publication not found.
- `500 Internal Server Error`: Could not delete Publication.

---
#### PUT /pub/editpublication/:id
Updates an existing publication's details.

**Request**:
```json
{
  "title": "Revised Study on Climate Resilience",
  "summary": "Updated summary about climate resilience in urban areas.",
  "authors": "Dr. A. B. Smith, Prof. K. L. White",
  "link": "https://example.com/revised_climate_resilience.pdf",
  "date": "2023-12-01"
}
```
**Required Fields**: `title`, `summary`, `authors`, `link`, `date`.
`id`: Publication ID to edit, provided as a URL parameter.

**Response**:
```json
{
  "success": true,
  "message": "Publication Edited successfully!"
}
```

**Errors**:
- `401 Unauthorized`: Validation error.
- `404 Not Found`: Publication not found or could not be edited.
- `500 Internal Server Error`: Could not edit Publication.

---
#### User Feedback Endpoints

#### POST /contact/feedback
Sends a new user feedback message.

**Request**:
```json
{
  "name": "Alice Wonderland",
  "email": "alice@example.com",
  "phone": "08011223344",
  "message": "I have a question about your latest project."
}
```
**Required Fields**: `name`, `email`, `message`. `phone` is optional.

**Response**:
```json
{
  "success": true,
  "message": "FeedBack Sent successfully!"
}
```

**Errors**:
- `401 Unauthorized`: Validation error.
- `500 Internal Server Error`: Could not send Message.

---
#### GET /contact/feedback
Retrieves all user feedback messages.

**Request**:
No request body required.

**Response**:
```json
{
  "success": true,
  "message": "FeedBack Fetched successfully!",
  "data": [
    {
      "_id": "65b7d9c0e5b7e9f0a7c6d5bb",
      "name": "Alice Wonderland",
      "email": "alice@example.com",
      "phone": "08011223344",
      "message": "I have a question about your latest project.",
      "createdAt": "2024-01-29T12:00:00.000Z",
      "updatedAt": "2024-01-29T12:00:00.000Z"
    }
  ]
}
```

**Errors**:
- `500 Internal Server Error`: Could not send Message (controller message).

---
#### DELETE /contact/feedback/delete/:id
Deletes a single feedback message by its ID.

**Request**:
No request body required.
`id`: Feedback message ID to delete, provided as a URL parameter.

**Response**:
```json
{
  "success": true,
  "message": "FeedBack deleted successfully!"
}
```

**Errors**:
- `401 Unauthorized`: Feedback ID is required.
- `404 Not Found`: Feedback does not exist or has been deleted.
- `500 Internal Server Error`: Could not delete Message.

---
#### DELETE /contact/feedback/deletemany
Deletes multiple feedback messages by providing an array of IDs.

**Request**:
```json
{
  "ids": ["65b7d9c0e5b7e9f0a7c6d5bb", "65b7d9c0e5b7e9f0a7c6d5bc"]
}
```
**Required Fields**: `ids` (array of strings).

**Response**:
```json
{
  "success": true,
  "message": "2 feedback(s) deleted successfully!"
}
```

**Errors**:
- `400 Bad Request`: Array of feedback IDs is required.
- `404 Not Found`: No matching feedbacks found or they may have already been deleted.
- `500 Internal Server Error`: Could not delete feedback(s).

## Usage
This API serves as the central data hub for the CSTD website, providing content for the frontend. Here's how you might interact with it:

*   **Fetching Dynamic Content**: A frontend application would typically use `GET /api/CSTDsite/pages/:pageId` to retrieve structured content for specific website pages (e.g., "about-us", "research"). This content is then rendered dynamically.
*   **Managing News and Events**: Administrators can use the `/api/CSTDsite/news` and `/api/CSTDsite/events` endpoints to post new announcements, update details, or remove outdated information. Image and video files are uploaded via `multipart/form-data` requests.
*   **Submitting User Inquiries**: The website's contact form would send `POST` requests to `/api/CSTDsite/contact/feedback` to collect messages from visitors.
*   **Admin Dashboard Interaction**: An authenticated admin dashboard would utilize the `/api/CSTDsite/admin` endpoints for user management (creating, approving, denying, deleting admins) and for updating website-wide configurations like the footer content via `/api/CSTDsite/footer`.
*   **Populating Project & Publication Lists**: Frontend sections dedicated to projects and publications would fetch their data from `/api/CSTDsite/project/getprojects` and `/api/CSTDsite/pub/getpublications` respectively, optionally filtering projects by category.

## Technologies Used

| Technology | Purpose                               |
| :--------- | :------------------------------------ |
| `Node.js`  | JavaScript runtime environment        |
| `Express.js` | Web application framework             |
| `MongoDB`  | NoSQL database for data storage       |
| `Mongoose` | MongoDB object data modeling (ODM)    |
| `Zod`      | Schema validation library             |
| `bcryptjs` | Password hashing and security         |
| `Multer`   | Handling `multipart/form-data` uploads |
| `Cloudinary` | Cloud-based media management          |
| `CORS`     | Cross-Origin Resource Sharing control |
| `dotenv`   | Environment variable management       |

## Contributing
We welcome contributions to enhance this project! To contribute:

*   💡 **Fork the repository** and clone it to your local machine.
*   🌿 **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name`.
*   🛠️ **Make your changes** and test them thoroughly.
*   📝 **Commit your changes** with a clear and concise message: `git commit -m "feat: Add new feature"`.
*   ⬆️ **Push your branch** to your forked repository: `git push origin feature/your-feature-name`.
*   🤝 **Open a Pull Request** to the `main` branch of this repository, describing your changes in detail.

## License
This project is licensed under the ISC License. For more details, see the `package.json` file.

## Author Info
Developed by the CSTD team.

*   **LinkedIn**: [CSTD Team LinkedIn](https://www.linkedin.com/company/cstd) (Placeholder)
*   **Website**: [CSTD Official Website](https://www.example.com) (Placeholder)

---
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-800000?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com/)
[![Zod](https://img.shields.io/badge/Zod-3E67B6?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)