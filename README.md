Adain Affiliate

Adain Affiliate is a Multi-Level Marketing (MLM) platform designed to manage and track affiliate marketing networks. Built using Node.js, Express, and EJS, and utilizing MongoDB as the database, this application follows the MVC (Model-View-Controller) architecture for modular and maintainable code.

Features
User Registration and Authentication: Secure sign-up, login, and session management.
Wallet Top-up and integration of payment gateways.
Affiliate Management: Manage and track affiliate relationships and commissions.
Dashboard: Real-time overview of affiliate activities and statistics.
Dynamic Content: Render dynamic content using EJS templates.
MongoDB Integration: Store and manage data with MongoDB.


Technologies
Node.js: JavaScript runtime for building scalable network applications.
Express: Web application framework for Node.js.
EJS: Templating engine for rendering HTML with embedded JavaScript.
MongoDB: NoSQL database for flexible and scalable data storage.
MVC Architecture: Model-View-Controller pattern for a clean separation of concerns.

Getting Started
Prerequisites
Node.js (v14 or later)
MongoDB (v4.2 or later)
npm (Node Package Manager)


Installation
Clone the repository:  [git clone](https://github.com/yourusername/adain-affiliate.git) cd adain-affiliate

npm install

Set up environment variables by creating the .env file:

Create a .env file in the root directory and add the following configuration:
PORT=3000
MONGO_URI=mongodb://localhost:27017/adain_affiliate
SESSION_SECRET=your_secret_key


### `npm start`

Project Structure
/models: Contains Mongoose schemas and models.
/views: EJS templates for rendering HTML.
/controllers: Contains the logic for handling requests and responses.
/routes: Defines the routes for the application.
/cloudinary: Configuration of files uploads, including database and server settings.
/public: Static assets like CSS, JavaScript, and images.
/Utils: Middleware functions for handling requests and responses.

### `API ROUTES`
/API Routes:

`adminRoutes`: for the admin
[login]('http://localhost:3500/api/admin/login')
[registeradmin]('http://localhost:3500/api/admin/registeradmin')
[getallusers]('http://localhost:3500/api/admin/getall')
[getuserprofiles]('http://localhost:3500/api/admin/getprofile')
[deleteuser]('http://localhost:3500/api/admin/remove/:id/delete')
[searchusers]('http://localhost:3500/api/admin/search')
###

### `NOTIFICATION ROUTES`
`notificationRoute`:
[create a notification]('http://localhost:3500/api/notify/notifications')
[getusernotification]('http://localhost:3500/api/notify/notifications/:userId')
[markasread]('http://localhost:3500/api/notify//notifications/:id/read')
###

### `PAYMENTROUTES`
`paymentRoute`:
[banktransfer]('http://localhost:3500/api/payment/banktransfer')
[withdraw]('http://localhost:3500/api/payment/withdraw')
[subscription]('http://localhost:3500/api/payment/subscription')
[referallsubscription]('http://localhost:3500/api/payment/subscription/referral')
[paymentcallback]('http://localhost:3500/api/payment/payment/callback')
[getallBanks]('http://localhost:3500/api/payment/getAllBanks')
###

##### `USERROUTES`
`userRoute`:
[loginroute]('http://localhost:3500/api/auth/login')
[registerroute]('http://localhost:3500/api/auth/register')
[updateroute]('http://localhost:3500/api/auth/update')
[messageroute]('http://localhost:3500/api/auth/message')
[passwordrestroute]('http://localhost:3500/api/auth/request-password-reset')

[resetpassword]('http://localhost:3500/api/auth/reset-password')
[updatepasswordroute]('http://localhost:3500/api/auth/update-password')
[dashboardroute]('http://localhost:3500/api/auth/dashboard/:userId')
[referalnetworkroute](''http://localhost:3500/api/auth/users/:userId/referred)
[profileroute]('http://localhost:3500/api/auth/users/profile/:userId)
[settingsroute]('http://localhost:3500/api/auth/users/settings-account/:userId')
[withdraw]('http://localhost:3500/api/auth//users/withdraw/:userId')
[buyairtimeroute]('http://localhost:3500/api/auth/buy/:userId')
[getreferalltokenroute]('http://localhost:3500/api/auth/getreferraltoken')
[signupwithreferallroute]('http://localhost:3500/api/auth/signupreferraltoken')
[subscriptionpopuproute]('http://localhost:3500/api/auth/subscriptionpop')
[subscriptionreferallroute]('http://localhost:3500/api/auth/subscriptionreferall')
### `USAGE`

`Usage`
User Management: Register and manage users through the provided routes.
Affiliate Tracking: View and manage affiliate networks and commission structures.
Dashboard: Monitor key metrics and activities via the dashboard interface.


`License`
This project is licensed under the MIT License - see the LICENSE file for details.


`Contact`
For any questions or support, please contact:

Author: Shazaniyu Gbadamosi
company: Adain Technologies Limited..
Team: 
[
    UI/UX:"zainab ekehide, wisdom obihosa",
    FrontEnd: "Destined Obihosa",
    BackEnd: "Shazaniyu Gbadamosi, Racheal Omiachi"
]
Links:
GitHub: [shazaniyu](https://github.com/Shazaniyu55/)
GitHub: [Destined](https://github.com/Shazaniyu55/)
GitHub: [Miss Zainab](https://github.com/Shazaniyu55/)
GitHub: [Miss racheal omiachi](https://github.com/Shazaniyu55/)
GitHub: [Wisdom obihosa](https://github.com/Shazaniyu55/)
