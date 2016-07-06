## Driveway

#### Purpose of the site
Allow people who are going to events with poor parking opportunities to reserve driveways that are close to that event.
####  Signing in and out; signing up<br>
The user has the ability to sign up with a specified username, email address, and password - all are checked with   the database to make sure the existing username is not already in the database, and the email address is not being used by somebody else.  After signing up, the user is automatically redirected to their profile page, which lets them add new driveways and edit existing driveways.  Signing in and out is as easy as clicking a sign in button and filling in the username and password, signing out is as easy as clicking the sign out button

#### Resetting a forgotten password<br>
When logging in, the user has the option of clicking a link to reset their password.  This sends them to a form that asks for their username and their email address. The code checks to make sure that the username exists, and if it exists, the email they entered is the email associated with their account.  After submitting that form, it then sends them an email with a link attached to it.  The link takes them back to the website which allows them to choose their new password.  

#### Home page
The home page is designed to capture a viewers attention - there is functionality to enter in an address of choice and click Go! which directs them to the Reserve Parking page which places a marker on the map to show what driveways are being rented out in the vicinity of the location.

#### Profile page; Add/Edit/Delete driveways
Every user has a profile page that lists their username and email on the top of the page, and two little blocks below that shows what driveways they have listed under their account and what reservations they have.  Next to each driveway there is an option to edit/delete that current driveway.  When clicking on edit/delete, it takes them to a form which allows the user to explicitly edit any part of their driveway they want to.  This includes the times they want to rent it out, the fee, the amount of cars that can fit on the driveway, and the address of the driveway.

#### Reserve Parking Page; view/rent driveways <br/>
Users don't have to login to view the map and search for driveways to rent. The map allows for users to select an address, date, and time of an event and then rent any of the available driveways. Driveways are represented by green markers and can be clicked on to pop up a window with information and a button to rent the driveway. The event location (address the user entered) is represented by a red marker. Driveways that appear on the map are filtered based on the supplied date as well as location. Driveways which have been reserved will not appear on the map.

#### Stripe Payment<br/>
Once users select their desired address they can click pay. This button will launch a checkout form that asks for a credit card number and billing address. When the user clicks pay on this dialog box it charges their card and reserves their parking spot. Due to the fact that we do not have an SSL certificate we cannot make actual charges currently. However Stipe has provided a list of credit card numbers that are valid and will process. The expiration date must be in the future or credit card will decline. Below is a list of the card numbers that are accepted in the demo phase. <br/>
4242424242424242	Visa<br/>
4012888888881881	Visa<br/>
4000056655665556	Visa (debit)<br/>
5555555555554444	MasterCard<br/>
378282246310005	American Express<br/>
6011111111111117	Discover<br/>

#### Order Confirmation Page <br/>
Upon successfully charging the buyers card, the user will be redirected to an order confirmation page. This page contains the details of the order such as price, address reserved, etc. Also, at the bottom of the page is an email confirmation form. The user can enter an email address and send their order confirmation. This allows them to have easy access to it.

#### Order Lookup Page <br/>
This page allows users to lookup their most recent order in case they happened to forget the details of their order. The Page first prompts the user to enter the email address and the last 4 digits of the credit card they used to reserve the parking spot. Upon entering these details the user will be redirected to their order confirmation page. This page also has the option to send the confirmation to their email. This option is found at the bottom of the page. 

#### Learn Page <br/>
This page contains information about our website and how to properly use our product. It has the answers to a few common questions that people may have. Also, this page has a comment box at the bottom of the page. This box allows customers to email us any questions or concerns they may have. 


## Database Schema

#### Driveways
{ _id, username, address, zip, city, state, numCars, times}
* _id is the automatically generated unique key by mongo
* username is the unique identifier we use that points the user to their driveway (if we had more time we would use the user's _id as the unique identifier)
* address is the address of the driveway
* zip is the zip code of the driveway
* city is the city of the driveway
* state is the state of the driveway
* numCars is the amount of cars that can be parked on a driveway at a given time, the user can only choose 1, 2, or 3 cars
* times is an array of times that has a day of the week, start time, and end time in each element, the user can add as many as they want.  We prevent them from adding duplicates and an end time that is before a start time.

#### Users
{_id, username, email, password}
* _id is the automatically generated unique key by mongo, used when resetting a user's password
* username is the unique identifier that we use to grab the email when needed, we also use this username to grab the corresponding driveway's that have the same username attached
* email is used to send emails when resetting passwords, making orders, or making reservations
* password is their authentication token when logging in, it is hashed

#### order
{_id, email, name1, last4, address, city, cardType, state, zip, price, reservationDate, reservationDuration, reservationTime, stripeTokenId}
* _id is the automatically generated unique key by mongo, used to retrieve orders
* name1 stores the name of the person that created the order, used to create their receipt
* last4 last 4 digits of the credit card they used to pay for the parking spot, used to create their receipt
* address is the location of the parking spot they ordered, used to create their receipt
* city is city of the parking spot they reserved, used to retrieve orders
* cardType is the type of credit card they used to pay for the spot ie american express. This is stores the name of the used to create their receipt
* State is the state of the parking spot they reserved, used to create their receipt
* zip is the zip code of the parking spot they reserved, used to create their receipt 
* price is the price of the parking spot they reserved, used to create their receipt
* reservationDate is the date of for which they reserved the parking spot, used to create their receipt
* reservationDuration is the length for which they reserved the parking spot, used to create their receipt
* reservationTime is the time at which they reserved the parking spot, used to create their receipt
* stripeTokenId this is the id from token used to charge their card

#### reservation
{_id, owner, buyer, drivewayId, date, time}
* _id is the automatically generated unique key by mongo, used when resetting a user's password
* owner is the owner of the driveway rented, used to update user profile  
* buyer is the buyer of the driveway rented, used to update user profile
* drivewayId unique id for a driveway, helps us populate the map properly
* time is that the parking spot is reserved for, helps us populate the map properly


 
 


##Future work
#### Signing in and out; signing up<br>
* We would add professional authentication to the website, such as CAS or LDAP, rather than hashing the password.
* We  would "thwart" users from trying to login too many times

#### Home page <br>
The home page would have more content on it, like testimonials, a footer which contains social media links, marketing tools...

#### Profile page; add/edit/delete driveways <br>
* The profile page would allow a user to have a first and last name stored and more information about themselves so people would feel more comfortable reserving a driveway through them.  
* Storing driveways would allow a person to choose a certain date or specific event to reserve for, also it would allow the user to store a picture of the driveway.  

#### Reserve Parking Page <br>
* The map should allow for filtering by time.
* Driveways could have different colored markers if they are partially full or owned by a user who is logged in. 
* Driveways are currently filtered out if they are reserved, a better method would be to only filter out driveways which are reserved for the current event date being searched. That way they still show up for other dates.

#### General things<br>
* People renting out their driveways that have multiple car spots could rent out to multiple people
* The front page would have location services that would look up events that are happening in the near future
* Users could rate their experience


