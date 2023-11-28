## Form to PDF Generator

# Setup:
1. open terminal and run 'npm i'
2. create a .env file and fill the following in it:
    1. MONGODB_CONNECT_URL
    2. CLIENT_ID
    3. CLIENT_SECRET
    4. REDIRECT_URL
    5. REFRESH_TOKEN
3. run the nodemon by 'npm run dev' or the server by 'npm start'

Teams pdf will be generatd and stored in teams folder by default, if you want you can change it in routes/price-page.js Line 122
Uploaded profile images will be stored in uploads folder by default, if you want you can change it in utils/multerUtil.js
Uploaded payment screenshots will be stored in uploads/paymentSS by default, if you want you can change it in routes/price-page.js Line 12