package visualmserver.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import visualmserver.exceptions.AuthenticationException;
import visualmserver.exceptions.InvalidDataException;
import visualmserver.exceptions.PreConditionException;
import visualmserver.exceptions.TokenException;
import visualmserver.models.Token;
import visualmserver.models.User;
import visualmserver.repositories.TokenRepository;
import visualmserver.repositories.UserRepository;
import visualmserver.services.EmailSenderService;
import visualmserver.util.JWTokenUtils;

import javax.validation.Valid;
import java.net.URI;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private JWTokenUtils tokenUtils;

    @Autowired
    private EmailSenderService emailSenderService;

    private BCryptPasswordEncoder bC = new BCryptPasswordEncoder(31);

    @Value("${frontend.url}")
    private String frontendUrl;

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User user) {
        User foundUser = this.userRepository.getUserByEmail(user.getEmail());

        if (foundUser == null) {
            throw new AuthenticationException("Invalid user and/or password");
        }

        if (!bC.matches(user.getPassword(), foundUser.getPassword())) {
            throw new AuthenticationException("Invalid user and/or password");
        }

        String token = this.tokenUtils.encode(String.valueOf(foundUser.getId()), foundUser.getEmail(), foundUser.isAdmin());

        return ResponseEntity.accepted().header(HttpHeaders.AUTHORIZATION, "Bearer " + token).body(foundUser);
    }


    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestBody @Valid User user, Errors errors) {
        if (errors.hasErrors()) {
            System.out.println(errors.toString());
            throw new InvalidDataException("Incorrect value types.");
        }

        user.setPassword(bC.encode(user.getPassword()));
        User savedUser = this.userRepository.save(user);

        if (!savedUser.isVerified()) {
            Token verificationToken = Token.generateToken(savedUser, LocalDateTime.now().plusMinutes(30));
            this.tokenRepository.save(verificationToken);

            String html = "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'><html data-editor-version='2' class='sg-campaigns' xmlns='http://www.w3.org/1999/xhtml'><head> <meta http-equiv='Content-Type' content='text/html; charset=utf-8'> <meta name='viewport' content='width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1'> <meta http-equiv='X-UA-Compatible' content='IE=Edge'> <style type='text/css'> body, div, p{font-family: inherit; font-size: 14px}body{color: #000}body a{color: #1188e6; text-decoration: none}p{margin: 0; padding: 0}table.wrapper{width: 100% !important; table-layout: fixed; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -moz-text-size-adjust: 100%; -ms-text-size-adjust: 100%}img.max-width{max-width: 100% !important}.column.of-2{width: 50%}.column.of-3{width: 33.333%}.column.of-4{width: 25%}@media screen and (max-width: 480px){.footer .rightColumnContent, .preheader .rightColumnContent{text-align: left !important}.footer .rightColumnContent div, .footer .rightColumnContent span, .preheader .rightColumnContent div, .preheader .rightColumnContent span{text-align: left !important}.preheader .leftColumnContent, .preheader .rightColumnContent{font-size: 80% !important; padding: 5px 0}table.wrapper-mobile{width: 100% !important; table-layout: fixed}img.max-width{height: auto !important; max-width: 100% !important}a.bulletproof-button{display: block !important; width: auto !important; font-size: 80%; padding-left: 0 !important; padding-right: 0 !important}.columns{width: 100% !important}.column{display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; margin-left: 0 !important; margin-right: 0 !important}}</style> <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'> <style>body{font-family: 'Roboto', sans-serif;}</style></head><body><center class='wrapper' data-link-color='#1188E6' data-body-style='font-size:14px; font-family:inherit; color:#000000; background-color:#FFFFFF;'> <div class='webkit'> <table cellpadding='0' cellspacing='0' border='0' width='100%' class='wrapper' bgcolor='#FFFFFF'> <tbody> <tr> <td valign='top' bgcolor='#FFFFFF' width='100%'> <table width='100%' role='content-container' class='outer' align='center' cellpadding='0' cellspacing='0' border='0'> <tbody> <tr> <td width='100%'> <table width='100%' cellpadding='0' cellspacing='0' border='0'> <tbody> <tr> <td> <table width='100%' cellpadding='0' cellspacing='0' border='0' style='width:100%; max-width:600px;' align='center'> <tbody> <tr> <td role='modules-container' style='padding:0px 0px 0px 0px; color:#000000; text-align:left;' bgcolor='#FFFFFF' width='100%' align='left'> <table class='module preheader preheader-hide' role='module' data-type='preheader' border='0' cellpadding='0' cellspacing='0' width='100%' style='display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;'> <tbody> <tr> <td role='module-content'> <p></p></td></tr></tbody> </table> <table border='0' cellpadding='0' cellspacing='0' align='center' width='100%' role='module' data-type='columns' style='padding:30px 20px 30px 20px;' bgcolor='#f6f6f6'> <tbody> <tr role='module-content'> <td height='100%' valign='top'> <table class='column' width='540' style='width:540px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 10px;' cellpadding='0' cellspacing='0' align='left' border='0' bgcolor=''> <tbody> <tr> <td style='padding:0px;margin:0px;border-spacing:0;'> <table class='module' role='module' data-type='text' border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;' data-muid='948e3f3f-5214-4721-a90e-625a47b1c957' data-mc-module-version='2019-10-22'> <tbody> <tr> <div style='font-family: inherit; text-align: center'> <span style='font-size: 43px; color: #00bcd4; font-weight: bold;'>Visualm5</span> </div><td style='padding:50px 30px 18px 30px; line-height:36px; text-align:inherit; background-color:#ffffff;' height='100%' valign='top' bgcolor='#ffffff' role='module-content'> <div> <div style='font-family: inherit; text-align: center'> <span style='font-size: 43px'>Thanks for signing up, " + savedUser.getFirstname() + "&nbsp;</span> </div><div></div></div></td></tr></tbody> </table> <table class='module' role='module' data-type='text' border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;' data-muid='a10dcb57-ad22-4f4d-b765-1d427dfddb4e' data-mc-module-version='2019-10-22'> <tbody> <tr> <td style='padding:18px 30px 18px 30px; line-height:22px; text-align:inherit; background-color:#ffffff;' height='100%' valign='top' bgcolor='#ffffff' role='module-content'> <div> <div style='font-family: inherit; text-align: center'> <span style='font-size: 18px'>Please verify your email address to</span><span style='color: #000000; font-size: 18px; font-family: arial,helvetica,sans-serif'> get access and create beautiful labels</span><span style='font-size: 18px'>.</span> </div><div style='font-family: inherit; text-align: center'> <span style='color: #00bcd4; font-size: 18px'><strong>Thank you!&nbsp;</strong></span> </div><div></div></div></td></tr></tbody> </table> <table class='module' role='module' data-type='spacer' border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;' data-muid='7770fdab-634a-4f62-a277-1c66b2646d8d'> <tbody> <tr> <td style='padding:0px 0px 20px 0px;' role='module-content' bgcolor='#ffffff'> </td></tr></tbody> </table> <table border='0' cellpadding='0' cellspacing='0' class='module' data-role='module-button' data-type='button' role='module' style='table-layout:fixed;' width='100%' data-muid='d050540f-4672-4f31-80d9-b395dc08abe1'> <tbody> <tr> <td align='center' bgcolor='#ffffff' class='outer-td' style='padding:0px 0px 0px 0px;'> <table border='0' cellpadding='0' cellspacing='0' class='wrapper-mobile' style='text-align:center;'> <tbody> <tr> <td align='center' bgcolor='#ffbe00' class='inner-td' style='border-radius:6px; font-size:16px; text-align:center; background-color:inherit;'> <a href='" + this.frontendUrl + "/verify-email?token=" + verificationToken.getTokenValue() + "' style='background-color:#00bcd4; box-shadow: 0 0.5rem 20px rgba(0, 188, 212, 0.5); color:#FFFFFF; border-radius: 50px; padding: 15px 50px; width: 100%; text-decoration:none;' target='_blank'>Verify your email now</a> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class='module' role='module' data-type='spacer' border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;' data-muid='7770fdab-634a-4f62-a277-1c66b2646d8d.1'> <tbody> <tr> <td style='padding:0px 0px 50px 0px;' role='module-content' bgcolor='#ffffff'> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </table> </div></center></body></html>";
            this.emailSenderService.sendMail("Visualm5", savedUser.getEmail(), "Verify your email", html);
        }

        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(savedUser.getId()).toUri();
        return ResponseEntity.created(uri).body(savedUser);
    }

    @GetMapping("/verify")
    public Token getVerificationToken(@RequestParam String token) {
        Token foundToken = this.tokenRepository.findByTokenValue(token);

        if (foundToken == null) {
            throw new TokenException("The token provided is invalid");
        }


        if (foundToken.isExpired()) {
            throw new TokenException(String.format("Token %s has expired", token));
        }

        return foundToken;
    }

    @PostMapping("/verify/resend")
    public void resendVerificationToken(@RequestBody User user) {
        if (!user.isVerified()) {
            Token existingToken = this.tokenRepository.findByUser(user);

            // Update current verification Token with new values
            Token verificationToken = Token.generateToken(user, LocalDateTime.now().plusMinutes(30));

            if (existingToken != null) {
                verificationToken.setId(existingToken.getId());
            }

            this.tokenRepository.save(verificationToken);


            String html = "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'><html data-editor-version='2' class='sg-campaigns' xmlns='http://www.w3.org/1999/xhtml'><head> <meta http-equiv='Content-Type' content='text/html; charset=utf-8'> <meta name='viewport' content='width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1'> <meta http-equiv='X-UA-Compatible' content='IE=Edge'> <style type='text/css'> body, div, p{font-family: inherit; font-size: 14px}body{color: #000}body a{color: #1188e6; text-decoration: none}p{margin: 0; padding: 0}table.wrapper{width: 100% !important; table-layout: fixed; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -moz-text-size-adjust: 100%; -ms-text-size-adjust: 100%}img.max-width{max-width: 100% !important}.column.of-2{width: 50%}.column.of-3{width: 33.333%}.column.of-4{width: 25%}@media screen and (max-width: 480px){.footer .rightColumnContent, .preheader .rightColumnContent{text-align: left !important}.footer .rightColumnContent div, .footer .rightColumnContent span, .preheader .rightColumnContent div, .preheader .rightColumnContent span{text-align: left !important}.preheader .leftColumnContent, .preheader .rightColumnContent{font-size: 80% !important; padding: 5px 0}table.wrapper-mobile{width: 100% !important; table-layout: fixed}img.max-width{height: auto !important; max-width: 100% !important}a.bulletproof-button{display: block !important; width: auto !important; font-size: 80%; padding-left: 0 !important; padding-right: 0 !important}.columns{width: 100% !important}.column{display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; margin-left: 0 !important; margin-right: 0 !important}}</style> <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'> <style>body{font-family: 'Roboto', sans-serif;}</style></head><body><center class='wrapper' data-link-color='#1188E6' data-body-style='font-size:14px; font-family:inherit; color:#000000; background-color:#FFFFFF;'> <div class='webkit'> <table cellpadding='0' cellspacing='0' border='0' width='100%' class='wrapper' bgcolor='#FFFFFF'> <tbody> <tr> <td valign='top' bgcolor='#FFFFFF' width='100%'> <table width='100%' role='content-container' class='outer' align='center' cellpadding='0' cellspacing='0' border='0'> <tbody> <tr> <td width='100%'> <table width='100%' cellpadding='0' cellspacing='0' border='0'> <tbody> <tr> <td> <table width='100%' cellpadding='0' cellspacing='0' border='0' style='width:100%; max-width:600px;' align='center'> <tbody> <tr> <td role='modules-container' style='padding:0px 0px 0px 0px; color:#000000; text-align:left;' bgcolor='#FFFFFF' width='100%' align='left'> <table class='module preheader preheader-hide' role='module' data-type='preheader' border='0' cellpadding='0' cellspacing='0' width='100%' style='display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;'> <tbody> <tr> <td role='module-content'> <p></p></td></tr></tbody> </table> <table border='0' cellpadding='0' cellspacing='0' align='center' width='100%' role='module' data-type='columns' style='padding:30px 20px 30px 20px;' bgcolor='#f6f6f6'> <tbody> <tr role='module-content'> <td height='100%' valign='top'> <table class='column' width='540' style='width:540px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 10px;' cellpadding='0' cellspacing='0' align='left' border='0' bgcolor=''> <tbody> <tr> <td style='padding:0px;margin:0px;border-spacing:0;'> <table class='module' role='module' data-type='text' border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;' data-muid='948e3f3f-5214-4721-a90e-625a47b1c957' data-mc-module-version='2019-10-22'> <tbody> <tr> <div style='font-family: inherit; text-align: center'> <span style='font-size: 43px; color: #00bcd4; font-weight: bold;'>Visualm5</span> </div><td style='padding:50px 30px 18px 30px; line-height:36px; text-align:inherit; background-color:#ffffff;' height='100%' valign='top' bgcolor='#ffffff' role='module-content'> <div> <div style='font-family: inherit; text-align: center'> <span style='font-size: 43px'>Thanks for signing up, " + user.getFirstname() + "&nbsp;</span> </div><div></div></div></td></tr></tbody> </table> <table class='module' role='module' data-type='text' border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;' data-muid='a10dcb57-ad22-4f4d-b765-1d427dfddb4e' data-mc-module-version='2019-10-22'> <tbody> <tr> <td style='padding:18px 30px 18px 30px; line-height:22px; text-align:inherit; background-color:#ffffff;' height='100%' valign='top' bgcolor='#ffffff' role='module-content'> <div> <div style='font-family: inherit; text-align: center'> <span style='font-size: 18px'>Please verify your email address to</span><span style='color: #000000; font-size: 18px; font-family: arial,helvetica,sans-serif'> get access and create beautiful labels</span><span style='font-size: 18px'>.</span> </div><div style='font-family: inherit; text-align: center'> <span style='color: #00bcd4; font-size: 18px'><strong>Thank you!&nbsp;</strong></span> </div><div></div></div></td></tr></tbody> </table> <table class='module' role='module' data-type='spacer' border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;' data-muid='7770fdab-634a-4f62-a277-1c66b2646d8d'> <tbody> <tr> <td style='padding:0px 0px 20px 0px;' role='module-content' bgcolor='#ffffff'> </td></tr></tbody> </table> <table border='0' cellpadding='0' cellspacing='0' class='module' data-role='module-button' data-type='button' role='module' style='table-layout:fixed;' width='100%' data-muid='d050540f-4672-4f31-80d9-b395dc08abe1'> <tbody> <tr> <td align='center' bgcolor='#ffffff' class='outer-td' style='padding:0px 0px 0px 0px;'> <table border='0' cellpadding='0' cellspacing='0' class='wrapper-mobile' style='text-align:center;'> <tbody> <tr> <td align='center' bgcolor='#ffbe00' class='inner-td' style='border-radius:6px; font-size:16px; text-align:center; background-color:inherit;'> <a href='" + this.frontendUrl + "/verify-email?token=" + verificationToken.getTokenValue() + "' style='background-color:#00bcd4; box-shadow: 0 0.5rem 20px rgba(0, 188, 212, 0.5); color:#FFFFFF; border-radius: 50px; padding: 15px 50px; width: 100%; text-decoration:none;' target='_blank'>Verify your email now</a> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class='module' role='module' data-type='spacer' border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;' data-muid='7770fdab-634a-4f62-a277-1c66b2646d8d.1'> <tbody> <tr> <td style='padding:0px 0px 50px 0px;' role='module-content' bgcolor='#ffffff'> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </table> </div></center></body></html>";
            this.emailSenderService.sendMail("Visualm5", user.getEmail(), "Verify your email", html);
        }
    }


    @PutMapping("/verify/{id}")
    public User verifyUserByToken(@PathVariable int id, @RequestBody Token token) {
        if (token.getUser().getId() != id) {
            throw new PreConditionException(String.format("User-ID=%d from Token does not match with path parameter=%d",
                    token.getUser().getId(), id));
        }

        if (token.isExpired()) {
            throw new TokenException(String.format("Token %s has expired", token));
        }

        User foundUser = this.userRepository.getUserById(id);
        foundUser.setVerified(true);

        this.tokenRepository.deleteTokenByTokenValueAndUser(token.getTokenValue(), foundUser);

        return this.userRepository.save(foundUser);
    }

    @PostMapping("/reset-password")
    public Boolean resetPassword(@RequestBody User user) {

        User foundUser = this.userRepository.getUserByEmail(user.getEmail());

        if (foundUser != null) {

            Token verificationToken = Token.generateToken(foundUser, LocalDateTime.now().plusMinutes(30));
            this.tokenRepository.save(verificationToken);

            String html = "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'><html data-editor-version='2' class='sg-campaigns' xmlns='http://www.w3.org/1999/xhtml'><head> <meta http-equiv='Content-Type' content='text/html; charset=utf-8'> <meta name='viewport' content='width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1'> <meta http-equiv='X-UA-Compatible' content='IE=Edge'> <style type='text/css'> body, div, p{font-family: inherit; font-size: 14px}body{color: #000}body a{color: #1188e6; text-decoration: none}p{margin: 0; padding: 0}table.wrapper{width: 100% !important; table-layout: fixed; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -moz-text-size-adjust: 100%; -ms-text-size-adjust: 100%}img.max-width{max-width: 100% !important}.column.of-2{width: 50%}.column.of-3{width: 33.333%}.column.of-4{width: 25%}@media screen and (max-width: 480px){.footer .rightColumnContent, .preheader .rightColumnContent{text-align: left !important}.footer .rightColumnContent div, .footer .rightColumnContent span, .preheader .rightColumnContent div, .preheader .rightColumnContent span{text-align: left !important}.preheader .leftColumnContent, .preheader .rightColumnContent{font-size: 80% !important; padding: 5px 0}table.wrapper-mobile{width: 100% !important; table-layout: fixed}img.max-width{height: auto !important; max-width: 100% !important}a.bulletproof-button{display: block !important; width: auto !important; font-size: 80%; padding-left: 0 !important; padding-right: 0 !important}.columns{width: 100% !important}.column{display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; margin-left: 0 !important; margin-right: 0 !important}}</style> <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'> <style>body{font-family: 'Roboto', sans-serif;}</style></head><body><center class='wrapper' data-link-color='#1188E6' data-body-style='font-size:14px; font-family:inherit; color:#000000; background-color:#FFFFFF;'> <div class='webkit'> <table cellpadding='0' cellspacing='0' border='0' width='100%' class='wrapper' bgcolor='#FFFFFF'> <tbody> <tr> <td valign='top' bgcolor='#FFFFFF' width='100%'> <table width='100%' role='content-container' class='outer' align='center' cellpadding='0' cellspacing='0' border='0'> <tbody> <tr> <td width='100%'> <table width='100%' cellpadding='0' cellspacing='0' border='0'> <tbody> <tr> <td> <table width='100%' cellpadding='0' cellspacing='0' border='0' style='width:100%; max-width:600px;' align='center'> <tbody> <tr> <td role='modules-container' style='padding:0px 0px 0px 0px; color:#000000; text-align:left;' bgcolor='#FFFFFF' width='100%' align='left'> <table class='module preheader preheader-hide' role='module' data-type='preheader' border='0' cellpadding='0' cellspacing='0' width='100%' style='display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;'> <tbody> <tr> <td role='module-content'> <p></p></td></tr></tbody> </table> <table border='0' cellpadding='0' cellspacing='0' align='center' width='100%' role='module' data-type='columns' style='padding:30px 20px 30px 20px;' bgcolor='#f6f6f6'> <tbody> <tr role='module-content'> <td height='100%' valign='top'> <table class='column' width='540' style='width:540px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 10px;' cellpadding='0' cellspacing='0' align='left' border='0' bgcolor=''> <tbody> <tr> <td style='padding:0px;margin:0px;border-spacing:0;'> <table class='module' role='module' data-type='text' border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;' data-muid='948e3f3f-5214-4721-a90e-625a47b1c957' data-mc-module-version='2019-10-22'> <tbody> <tr> <div style='font-family: inherit; text-align: center'> <span style='font-size: 43px; color: #00bcd4; font-weight: bold;'>Visualm5</span> </div><td style='padding:50px 30px 18px 30px; line-height:36px; text-align:inherit; background-color:#ffffff;' height='100%' valign='top' bgcolor='#ffffff' role='module-content'> <div> <div style='font-family: inherit; text-align: center'> <span style='font-size: 43px'>Reset your password&nbsp;</span> </div><div></div></div></td></tr></tbody> </table> <table class='module' role='module' data-type='text' border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;' data-muid='a10dcb57-ad22-4f4d-b765-1d427dfddb4e' data-mc-module-version='2019-10-22'> <tbody> <tr> <td style='padding:18px 30px 18px 30px; line-height:22px; text-align:inherit; background-color:#ffffff;' height='100%' valign='top' bgcolor='#ffffff' role='module-content'> <div> <div style='font-family: inherit; text-align: center'> <span style='font-size: 18px'>To reset your password click the link below.</span><span style='color: #000000; font-size: 18px; font-family: arial,helvetica,sans-serif'></span><span style='font-size: 18px'></span> </div><div style='font-family: inherit; text-align: center'> <span style='color: #00bcd4; font-size: 18px'><strong>&nbsp;</strong></span> </div><div></div></div></td></tr></tbody> </table> <table class='module' role='module' data-type='spacer' border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;' data-muid='7770fdab-634a-4f62-a277-1c66b2646d8d'> <tbody> <tr> <td style='padding:0px 0px 20px 0px;' role='module-content' bgcolor='#ffffff'> </td></tr></tbody> </table> <table border='0' cellpadding='0' cellspacing='0' class='module' data-role='module-button' data-type='button' role='module' style='table-layout:fixed;' width='100%' data-muid='d050540f-4672-4f31-80d9-b395dc08abe1'> <tbody> <tr> <td align='center' bgcolor='#ffffff' class='outer-td' style='padding:0px 0px 0px 0px;'> <table border='0' cellpadding='0' cellspacing='0' class='wrapper-mobile' style='text-align:center;'> <tbody> <tr> <td align='center' bgcolor='#ffbe00' class='inner-td' style='border-radius:6px; font-size:16px; text-align:center; background-color:inherit;'> <a href='" + this.frontendUrl + "/reset-password?token=" + verificationToken.getTokenValue() + "' style='background-color:#00bcd4; box-shadow: 0 0.5rem 20px rgba(0, 188, 212, 0.5); color:#FFFFFF; border-radius: 50px; padding: 15px 50px; width: 100%; text-decoration:none;' target='_blank'>Reset your password</a> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class='module' role='module' data-type='spacer' border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;' data-muid='7770fdab-634a-4f62-a277-1c66b2646d8d.1'> <tbody> <tr> <td style='padding:0px 0px 50px 0px;' role='module-content' bgcolor='#ffffff'> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </table> </div></center></body></html>";
            this.emailSenderService.sendMail("Visualm5", user.getEmail(), "Reset your password", html);

            return true;
        } else {
            throw new PreConditionException("Email is not found");
        }
    }

    @PutMapping("/reset-password")
    public Boolean resetPassword(@RequestBody User user, @RequestParam String token) {

        Token foundToken = this.tokenRepository.findByTokenValue(token);

        if (foundToken == null) {
            throw new TokenException("Token provided is null");
        }

        if (foundToken.isExpired()) {
            throw new TokenException("Token is expired");
        }

        if (bC.matches(user.getPassword(), foundToken.getUser().getPassword())) {
            throw new PreConditionException("Can not have the same password");
        }

        user.setPassword(bC.encode(user.getPassword()));
        this.userRepository.save(user);
        return true;

    }
}
