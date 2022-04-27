Set Up Mongo Database:
  connect to cluster in MongoCompass (connection link: mongodb+srv://websci22:wBTafSVIyYnZMPrn@cluster0.v7p54.mongodb.net/test)

Set Up Code:
git clone
open 2 command prompt windows
window 1:
  cd rpi-connect
  npm i
  ng build --watch
window 2:
  npm i
  node server
  
  *NOTE: to test the functionality of the discord button and bot, navigate to the server.js file and uncomment line 30.  Further instructions are included in the server file itself.  Also, if needed, when changing out the token for the discord bot, you will need to navigate to config.json and simply delete the old token and paste the new one
 
