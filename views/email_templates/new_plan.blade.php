<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Plan Receipt</title>
</head>

<body style="padding: 0;margin: 0;font-family:Arial, sans-serif;">
<table class="wrapper" bgcolor="#ECEEF1" style="background-color:#ECEEF1;width:100%;">
    <tr>
        <td>
            <!-- HEADER -->
            <table class="head-wrap" style="margin: 0 auto;">
                <tr>
                    <td></td>
                    <td class="header container logo" style="font-family:Source Sans Pro, Helvetica, sans-serif;color:#6f6f6f;display:block;margin:0 auto;max-width:600px;padding:5px">
                        <div class="content logo" style="display:block;margin:0 auto;max-width:650px;-webkit-font-smoothing:antialiased;padding:20px">
                            <table>
                                <tr>
                                    <td>
                                        <img alt="our wonderful wistia logo" border="0" class="wistia-logo" src="https://simplyloose.com/assets/images/email/logo_email.png" width="230" style="display:block">
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </td>
                    <td></td>
                </tr>
            </table>
            <!-- /HEADER -->
            <!-- BODY -->
            <table class="body-wrap" style="margin:0 auto;margin-bottom: 80px;">
                <tr>
                    <td></td>
                    <td class="container transaction-mailer" bgcolor="#FFFFFF" style="font-family:Arial, sans-serif;color:#6f6f6f;display:block;max-width:600px;margin:0 auto;padding:0 10px;border-top: 5px solid #317eeb;">
                        <div class="content" style="display:block;margin:0 auto;max-width:650px;padding:20px;-webkit-font-smoothing:antialiased">
                            <div class="receipt">
                                <div class="head">

                                    <h1 class="light title" style="margin:0;font-family:Arial, sans-serif;padding:0;margin-bottom:10px;font-weight:700;line-height:130%;-webkit-font-smoothing:antialiased;color:#ccc;font-size:26px;text-align:left">Invoice</h1>

                                </div>
                                <div class="divider" style="margin-top:10px;padding-top:10px;border-top:1px solid #CCC">
                                    <div class="message">

                                        <h1 class="emphasis" style="margin:0;padding:0;margin-bottom:10px;font-weight:500;margin-top:10px;-webkit-font-smoothing:antialiased;font-size:21px;line-height:130%;text-align:left;">Hi <span style="color:#317eeb;">{{$user_name}}</span></h1>

                                        <p style="color:#434343;text-align:left;line-height:150%;padding:0;font-weight:400;font-size:17px">
                                            Thanks for choose us. This email serves as a receipt for your new plan purchase.
                                        </p>

                                        <p style="color:#434343;text-align:left;line-height:150%;padding:0;font-weight:400;font-size:17px">
                                            Please retain this email receipt for your records.
                                        </p>
                                    </div>
                                </div>
                                <div class="billing">
                                    <h6 style="font-weight: 500;font-size: 20px;margin: 20px 0 0; color: #000;">Billing details</h6>
                                    <div class="details"  style="margin-top: 10px; border-top: 1px solid rgb(204, 204, 204); border-bottom: 1px solid rgb(204, 204, 204); padding: 15px;">
                                        <div class="divider" >
                                            <span style="color:#595959;display:inline-block;font-size:18px;margin-bottom:5px;font-weight: 400; width: 130px;">Username:</span>
                                            <span class="total" style="margin-top:5px;color:black;display:inline-block;margin-bottom:5px;font-size:18px;font-weight: 500;">{{$user_name}}</span>
                                        </div>
                                        <div class="divider" >
                                            <span style="color:#595959;display:inline-block;font-size:18px;margin-bottom:5px;font-weight: 400; width: 130px;">Email address:</span>
                                            <span class="total" style="margin-top:5px;color:black;display:inline-block;margin-bottom:5px;font-size:18px;font-weight: 500;text-transform: lowercase;">{{$email}}</span>
                                        </div>
                                        <div class="divider" >
                                            <span style="color:#595959;display:inline-block;font-size:18px;margin-bottom:5px;font-weight: 400; width: 130px;">Plan name:</span>
                                            <span class="total" style="margin-top:5px;color:black;display:inline-block;margin-bottom:5px;font-size:18px;font-weight: 500;">{{$plan_name}}</span>
                                        </div>
                                        <div class="divider" >
                                            <span style="color:#595959;display:inline-block;font-size:18px;margin-bottom:5px;font-weight: 400; width: 130px;">Plan price:</span>
                                            <span class="total" style="margin-top:5px;color:black;display:inline-block;margin-bottom:5px;font-size:18px;font-weight: 500;">{{$price}}/month</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="foot">

                                    <p style="color:#434343;text-align:left;line-height:150%;padding:0;font-weight:400;font-size:18px">
                                        If you have any questions, please <a href="https://simplyloose.com/contact-us" style="text-decoration: none;color: #317eeb">
                                            Contact Us</a>
                                </div>
                            </div>
                        </div>
                        <!-- /content -->
                    </td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                </tr>
            </table>
            <!-- /BODY -->
        </td>
    </tr>
</table>
<!-- /wrapper -->

</body>

</html>