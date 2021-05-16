# Pizza delivery documentation

## installation

This works in a swagger envronment

First install swagger on your environment. See https://www.npmjs.com/package/swagger

After cloning the git you should run the following commands:

* npm install 
* swagger project start
* swagger project edit . See the documentation there of how to run the api.

You can run the tests by swagger project test. Notice that server should be down while running the tests.

## Some comments

### Database
I used SqlLite3 in order to make it runnable without using a "serious" db server. In real life I would have used here mySql or mongo db.

I also did not add some general fields that I would in real world case like create_time and modified_time although it is really needed in this application if some real Pizza delivery will take it.

### Unit tests
I would have improve and enhance them but I reached my time limit and I wasn't sure it is worthwhile.

### Stripe
Stripe is supported on checkout service. I did not implemented the mailgun@com due to time limitations.

### Login users
I implemented the login users on a server dictionary in memory. I know that it has the limitation that upon server restart all login users are erased. I would overcome this one by using persistent redis or adding a login flag to users table and loading this data on service raise. Again I did not implement that due to time limit.


