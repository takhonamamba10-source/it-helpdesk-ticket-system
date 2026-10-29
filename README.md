# IT Helpdesk Ticket System

A responsive, beginner-friendly IT helpdesk dashboard built with HTML, CSS, and vanilla JavaScript. This is a portfolio project demonstrating common IT support ticket workflows.

## Features

- Create, edit, and delete support tickets
- Ticket IDs generated automatically (for example, `HD-1004`)
- Requester, issue title, category, priority, status, description, and date
- Dashboard counts for total, open, in-progress, and resolved tickets
- Search tickets and filter by status or priority
- Demo tickets included
- Saves data in the browser using `localStorage`
- Responsive layout for phones and desktops
- No frameworks, package installs, or paid services required

## Files

- `index.html` — page structure and ticket form
- `style.css` — responsive design and styling
- `script.js` — ticket logic, filters, and browser storage

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. Create a ticket and test the edit, delete, search, and filter features.

## Publish with GitHub Pages

1. Create a public repository named `it-helpdesk-ticket-system`.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. Open the repository's **Settings**.
4. Select **Pages** in the sidebar.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select branch `main` and folder `/ (root)`, then save.
7. Wait for the deployment to finish. The Pages screen will show the published URL, usually:
   `https://YOUR-USERNAME.github.io/it-helpdesk-ticket-system/`

## Important limitations

This is a front-end demonstration. Tickets are stored in the current browser's local storage. They are not shared between users or devices and are not backed up to a server. Clearing browser data may remove tickets. There is no login or access control, so do not use it for confidential company data, passwords, or real customer information.

## Suggested future improvements

- Connect a database and secure authentication
- Add technician assignment and comments
- Add ticket activity history and SLA due dates
- Add CSV export and reporting
- Add automated tests and accessibility checks

## Portfolio description

**IT Helpdesk Ticket System** — Built a responsive ticket management dashboard using HTML, CSS, and JavaScript. Implemented ticket creation, editing, deletion, priority and status tracking, search, filtering, dashboard metrics, and browser-based persistence. Designed a mobile-friendly interface and documented deployment with GitHub Pages.
