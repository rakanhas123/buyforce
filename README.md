Project Name: BuyForce
Overview

A full-stack platform consisting of AdminWeb and Mobile apps for managing and interacting with Groups, Products, and Users. This platform allows admins to efficiently manage user groups, monitor progress, and handle payments while providing users with an intuitive experience on mobile for browsing, joining groups, and making payments.

Table of Contents

AdminWeb

Features

Setup

Development

Mobile

Features

Setup

Development

Technologies

Contributing

License

AdminWeb
Features

Dashboard: Overview of all groups, members, and activities.

Group Management: Create, update, and manage groups.

User Management: View and manage users within the platform.

Payments: Track payments and handle transactions.

Notifications: Admin can send notifications to users about important events or updates.

Setup
1. Clone the repository
git clone https://github.com/YOUR_USERNAME/AdminWeb.git

2. Install dependencies
cd AdminWeb
npm install

3. Environment Configuration

Copy the .env.example to .env and configure the following variables:

REACT_APP_API_URL=http://localhost:3000
REACT_APP_FRONTEND_URL=http://localhost:3001

4. Run the app
npm start


AdminWeb will run on http://localhost:3001.

Development

Start the development server

npm start


Run tests

npm test

Mobile
Features

Group Browsing: Users can explore, search, and filter available groups.

Join Groups: Users can join groups based on product interests.

Payment Integration: Supports in-app payments through PayPal or other payment gateways.

Notifications: Users get push notifications about group updates or promotions.

User Profile: Users can update their profiles, view groups, and track progress.

Setup
1. Clone the repository
git clone https://github.com/YOUR_USERNAME/Mobile.git

2. Install dependencies
cd Mobile
npm install

3. Environment Configuration

Create an .env file and configure:

EXPO_PUBLIC_API_BASE_URL=http://localhost:3000

4. Run the app
npm start


This will open Expo DevTools. Follow the instructions to run on a device or simulator.

Development

Start the development server

npm start


Run tests

npm test

Technologies
AdminWeb

Frontend: React, React Router

UI Framework: Material UI

State Management: Redux, Context API

API: REST API via Axios

Mobile

Framework: React Native, Expo

Navigation: React Navigation

State Management: React Context API / Redux

Payment: PayPal SDK, Stripe API (if integrated)

Backend (Common for both)

Backend: Node.js, Express

Database: PostgreSQL (or MongoDB)

Authentication: JWT (JSON Web Tokens)
Docker

Build:
docker build -t buyforce-backend ./BuyForce-Backend

Run:
docker run -p 3000:3000 buyforce-backend