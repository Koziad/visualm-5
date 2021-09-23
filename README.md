<p align="center">
  <img width="460" src="http://149.210.144.77:8080/assets/images/LOGO.png">
</p>
The Material Sample Management Tool is an application to archive  alternative design materials that are renewable and compostable.
This tool makes it easier to keep track of the new materials and view its information.

***

<p align="center">
  <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" style="font-size: 20px; font-weight: bold">License</a> &bull;
  <a href="http://149.210.144.77:8080/#/about" style="font-size: 20px; font-weight: bold">About</a>
  <br><br>
</p>

***
### Requirements
| Technologies | Version |
|-------|-------|
| Node.js | 12.19.0 or higher |
| NPM | 6.14.0 or higher |
| Angular | 10.1 or higher |
| Java | 15 |
| Maven | 3.1 or higher |
| MySQL | 5.7 or higher |

***
### Configuration
Follow the instructions below if you want to install the Material Sample Management Tool using Git.
```bash
git clone https://github.com/Koziad/visualm-5.git
```

## Frontend configuration
***
### Bitly
This project makes use of the Bitly API to generate short links for the sources of labels. To get the conversion working,
it is important to create a Bitly account and generate an OAuth access token. 
This can be generated by following this [guide](https://support.bitly.com/hc/en-us/articles/230647907-How-do-I-generate-an-OAuth-access-token-for-the-Bitly-API-).

After generating your OAuth token you are required to make a `GET` request with your access token in the Authorization header to the following url:
https://api-ssl.bitly.com/v4/groups. Here you will find the `group_guid` in the response which you will need later for the environment variables in Angular

    
### Angular
**Dependencies:**

To install the dependencies for the frontend of the application,
 navigate to the `/visualmfrontend` directory in the terminal and run the `npm install` command. 

**Environment variables:**
```typescript
// visualmfrontend/src/environments/
export const environment = {
  production: false,
  backend_url: 'host:port of the spring boot restful api',
  env_name: 'development',
  bitly_key: 'your Bitly OAuth access token',
  bitly_group_guid: 'group guid based of your bitly api key'
};
```

**SSL:**

To enable SSL for Angular, set the ssl attribute in the `visualmfrontend/angular.json` to `true`. 
Also add the SSL certifcate and the SSL key in the `visualmfrontend/ssl` directory.
```json
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "options": {
    "browserTarget": "visualm:build",
    "ssl": true,
    "sslCert": "ssl/server.crt",
    "sslKey": "ssl/server.key"
  }
```

## Server/Backend configuration
***
### Spring Boot
**Dependencies:**

To install the dependencies for the backend of the application,
navigate to the `/visualmserver` directory in the terminal and run the `mvn install` command. 

Another dependency which is mostly external, like the Bitly API key, is the setup for e-mail service within the application.
Make sure to create an account which will be sending the emails on behalf of the application. 
In the next section it is described which properties are required to set this up.


**Application.properties:**

Below there is a set of properties that are required to be configured to get the REST API server working.
The `application.properties` file is location in the `visualmserver/src/main/resources/` directory.

Be sure to change the `spring.jpa.hibernate.ddl-auto` property to `validate` when deploying the application to prevent unwanted changes to the database.
Use the `update` attribute during the setup or when developing further on the application.
```yaml
# Database settings
spring.datasource.url=jdbc:mysql://domain:3306/database?Timezone=UTC&autoReconnect=true
spring.datasource.username=db-username
spring.datasource.password=db-user-password
spring.jpa.hibernate.ddl-auto=update

# SMTP Settings
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=server.email@gmail.com
spring.mail.password=server-email-password

# SMTP SSL
spring.mail.properties.mail.smtp.socketFactory.port = 465
spring.mail.properties.mail.smtp.socketFactory.class = javax.net.ssl.SSLSocketFactory

# JWT configuration
jwt.issuer=msmtools
jwt.pass-phrase=a secret passphrase for the jwt token

frontend.url=https://url-to-frontend.com
```

**SSL:**

To enable SSL for the Spring Boot REST API, configure the following in the `application.properties`:
```yaml
# Format used for the keystore. Options: PKCS12 or JKS
server.ssl.key-store-type=PKCS12 
# Path to keystore with certificate
server.ssl.key-store=classpath:keystore/file.p12
server.ssl.key-store-password=password
server.ssl.key-alias=alias-used-in-certificate

server.ssl.enabled=true
```
Also add the certificate file in the `visualmserver/src/main/resources/keystore/` directory.

**AppConfig Table**
 
The `app_config` table holds frontend configuration for certain parts of the application. 
An example being the email suffix that is required while registering a new account. 
The default values can be configured in de `data.sql` file, which is located in the same directory as the `application.properties` file.

```sql
INSERT INTO `app_config` (`key_name`, `value`) VALUES ('email_suffix', 'tmp.nl');
INSERT INTO `app_config` (`key_name`, `value`) VALUES ('organisation', 'Github');
INSERT INTO `app_config` (`key_name`, `value`) VALUES ('logo_path', 'assets/images/HvAlogo.png');
```
The configuration can later be changed in the admin panel of the application in the frontend.
***
### Members
The application was developed by second year Software Engineering students at the University of Applied Sciences of Amsterdam.

| Contributors |
|-------|
| [Alec Wouda](https://github.com/Wauwda) |
| [Jarno van der Velde](https://github.com/Jarnovdvelde) |
| [Kostas Mylothridis](https://github.com/Koziad) |
| [Mitchell de Vries](https://github.com/MitchelldeVrees) |
| [Sam Overheul](https://github.com/SamOver10) |
