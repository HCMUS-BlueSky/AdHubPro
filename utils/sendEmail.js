const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.sendinblue.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_LOGIN,
    pass: process.env.SMTP_PASS
  }
});


const sendEmail = async (email, subject, content) => {
  const mailOptions = {
    from: '"AdHubPro" adhubpro@gmail.com',
    to: email,
    subject: subject,
    html: content
  };
  await transporter.sendMail(mailOptions);
};

const genProcessingTemplate = (report) => {
  const template = `
  <!doctype html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <title>
        
      </title>
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <!--<![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style type="text/css">
        #outlook a { padding:0; }
        body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
        table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
        img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
        p { display:block;margin:13px 0; }
      </style>
      <!--[if mso]>
      <noscript>
      <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
      </xml>
      </noscript>
      <![endif]-->
      <!--[if lte mso 11]>
      <style type="text/css">
        .mj-outlook-group-fix { width:100% !important; }
      </style>
      <![endif]-->
      
        <!--[if !mso]><!-->
          <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700" rel="stylesheet" type="text/css">
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet" type="text/css">
          <style type="text/css">
            @import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700);
  @import url(https://fonts.googleapis.com/css?family=Roboto:300,400,500,700);
          </style>
        <!--<![endif]-->

      
      
      <style type="text/css">
        @media only screen and (min-width:480px) {
          .mj-column-per-25 { width:25% !important; max-width: 25%; }
  .mj-column-per-75 { width:75% !important; max-width: 75%; }
  .mj-column-per-100 { width:100% !important; max-width: 100%; }
        }
      </style>
      <style media="screen and (min-width:480px)">
        .moz-text-html .mj-column-per-25 { width:25% !important; max-width: 25%; }
  .moz-text-html .mj-column-per-75 { width:75% !important; max-width: 75%; }
  .moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }
      </style>
      
    
      <style type="text/css">
      
      

      @media only screen and (max-width:480px) {
        table.mj-full-width-mobile { width: 100% !important; }
        td.mj-full-width-mobile { width: auto !important; }
      }
    
      </style>
      <style type="text/css">
      
      </style>
      
    </head>
    <body style="word-spacing:normal;background-color:#eeeeee;">
      
      
        <div
          style="background-color:#eeeeee;"
        >
          
        
        <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#343a40" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      
        
        <div  style="background:#343a40;background-color:#343a40;margin:0px auto;max-width:600px;">
          
          <table
            align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#343a40;background-color:#343a40;width:100%;"
          >
            <tbody>
              <tr>
                <td
                  style="direction:ltr;font-size:0px;padding:0px;text-align:center;"
                >
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:150px;" ><![endif]-->
              
        <div
          class="mj-column-per-25 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;"
        >
          
        <table
          border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%"
        >
          <tbody>
            
                <tr>
                  <td
                    align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <table
          border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"
        >
          <tbody>
            <tr>
              <td  style="width:100px;">
                
          <a
            href="#" target="_blank"
          >
            
        <img
          height="auto" src="https://firebasestorage.googleapis.com/v0/b/adhubpro-d78fc.appspot.com/o/AdHubPro.png?alt=media&token=cf02490c-df71-4f88-b9e8-b2dd92d093c6" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="100"
        />
      
          </a>
        
              </td>
            </tr>
          </tbody>
        </table>
      
                  </td>
                </tr>
              
          </tbody>
        </table>
      
        </div>
      
            <!--[if mso | IE]></td><td class="" style="vertical-align:middle;width:450px;" ><![endif]-->
              
        <div
          class="mj-column-per-75 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;"
        >
          
        <table
          border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%"
        >
          <tbody>
            
                <tr>
                  <td
                    align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
          style="font-family:Montserrat, Segoe UI, Roboto, Open Sans, Helvetica Neue;font-size:26px;font-weight:600;line-height:1;text-align:center;color:#ffffff;"
        >Báo cáo đang được xử lí</div>
      
                  </td>
                </tr>
              
          </tbody>
        </table>
      
        </div>
      
            <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
          
        </div>
      
        
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      
        
        <div  style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
          
          <table
            align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"
          >
            <tbody>
              <tr>
                <td
                  style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
                >
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              
        <div
          class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
        >
          
        <table
          border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
        >
          <tbody>
            
                <tr>
                  <td
                    align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
          style="font-family:Montserrat, Segoe UI, Roboto, Open Sans, Helvetica Neue;font-size:14px;font-weight:500;line-height:1;text-align:left;color:#555555;"
        >Xin chào ${report.reporter.name},</div>
      
                  </td>
                </tr>
              
                <tr>
                  <td
                    align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
          style="font-family:Montserrat, Segoe UI, Roboto, Open Sans, Helvetica Neue;font-size:14px;font-weight:500;line-height:22px;text-align:left;color:#555555;"
        >Báo cáo của bạn về ${
          report.type == 'Bảng quảng cáo'
            ? 'bảng quảng cáo tại địa chỉ ' + report.location.address
            : 'địa điểm quảng cáo (' + report.location.address + ")"
        } đang được xử lí.</div>
      
                  </td>
                </tr>
              
                <tr>
                  <td
                    align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
          <div
          style="font-family:Montserrat, Segoe UI, Roboto, Open Sans, Helvetica Neue;font-size:14px;font-weight:500;line-height:1;text-align:left;color:#555555;"
        >Nội dung báo cáo:</div>
      
                  </td>
                </tr>
              
                <tr>
                  <td
                    align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
          style="font-family:Montserrat, Segoe UI, Roboto, Open Sans, Helvetica Neue;font-size:14px;font-weight:700;line-height:22px;text-align:left;color:#555555;"
        >${report.content}</div>
      
                  </td>
                </tr>
              
                <tr>
                  <td
                    align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >            
        <div
          style="font-family:Montserrat, Segoe UI, Roboto, Open Sans, Helvetica Neue;font-size:14px;font-weight:500;line-height:1;text-align:left;color:#555555;"
        >Nội dung xử lí báo cáo:</div>
      
                  </td>
                </tr>
              
                <tr>
                  <td
                    align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
          style="font-family:Montserrat, Segoe UI, Roboto, Open Sans, Helvetica Neue;font-size:14px;font-weight:700;line-height:22px;text-align:left;color:#555555;"
        >${report.response}</div>
      
                  </td>
                </tr>
              
                <tr>
                  <td
                    align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
          style="font-family:Montserrat, Segoe UI, Roboto, Open Sans, Helvetica Neue;font-size:14px;font-weight:500;line-height:1;text-align:left;color:#555555;"
        >Thân ái,</div>
      
                  </td>
                </tr>
              
                <tr>
                  <td
                    align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
          style="font-family:Montserrat, Segoe UI, Roboto, Open Sans, Helvetica Neue;font-size:14px;font-weight:700;line-height:1;text-align:left;color:#555555;"
        >AdHubPro.</div>
      
                  </td>
                </tr>
              
          </tbody>
        </table>
      
        </div>
      
            <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
          
        </div>
      
        
        <!--[if mso | IE]></td></tr></table><![endif]-->
      
      
        </div>
      
    </body>
  </html>
  `;
  return template
}

const genFinishedTemplate = (report) => {
  const template = `
  <!doctype html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <title>
        
      </title>
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <!--<![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style type="text/css">
        #outlook a { padding:0; }
        body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
        table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
        img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
        p { display:block;margin:13px 0; }
      </style>
      <!--[if mso]>
      <noscript>
      <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
      </xml>
      </noscript>
      <![endif]-->
      <!--[if lte mso 11]>
      <style type="text/css">
        .mj-outlook-group-fix { width:100% !important; }
      </style>
      <![endif]-->
      
        <!--[if !mso]><!-->
          <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700" rel="stylesheet" type="text/css">
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet" type="text/css">
          <style type="text/css">
            @import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700);
  @import url(https://fonts.googleapis.com/css?family=Roboto:300,400,500,700);
          </style>
        <!--<![endif]-->

      
      
      <style type="text/css">
        @media only screen and (min-width:480px) {
          .mj-column-per-25 { width:25% !important; max-width: 25%; }
  .mj-column-per-75 { width:75% !important; max-width: 75%; }
  .mj-column-per-100 { width:100% !important; max-width: 100%; }
        }
      </style>
      <style media="screen and (min-width:480px)">
        .moz-text-html .mj-column-per-25 { width:25% !important; max-width: 25%; }
  .moz-text-html .mj-column-per-75 { width:75% !important; max-width: 75%; }
  .moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }
      </style>
      
    
      <style type="text/css">
      
      

      @media only screen and (max-width:480px) {
        table.mj-full-width-mobile { width: 100% !important; }
        td.mj-full-width-mobile { width: auto !important; }
      }
    
      </style>
      <style type="text/css">
      
      </style>
      
    </head>
    <body style="word-spacing:normal;background-color:#eeeeee;">
      
      
        <div
          style="background-color:#eeeeee;"
        >
          
        
        <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#343a40" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      
        
        <div  style="background:#343a40;background-color:#343a40;margin:0px auto;max-width:600px;">
          
          <table
            align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#343a40;background-color:#343a40;width:100%;"
          >
            <tbody>
              <tr>
                <td
                  style="direction:ltr;font-size:0px;padding:0px;text-align:center;"
                >
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:middle;width:150px;" ><![endif]-->
              
        <div
          class="mj-column-per-25 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;"
        >
          
        <table
          border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%"
        >
          <tbody>
            
                <tr>
                  <td
                    align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <table
          border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"
        >
          <tbody>
            <tr>
              <td  style="width:100px;">
                
          <a
            href="#" target="_blank"
          >
            
        <img
          height="auto" src="https://firebasestorage.googleapis.com/v0/b/adhubpro-d78fc.appspot.com/o/AdHubPro.png?alt=media&token=cf02490c-df71-4f88-b9e8-b2dd92d093c6" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="100"
        />
      
          </a>
        
              </td>
            </tr>
          </tbody>
        </table>
      
                  </td>
                </tr>
              
          </tbody>
        </table>
      
        </div>
      
            <!--[if mso | IE]></td><td class="" style="vertical-align:middle;width:450px;" ><![endif]-->
              
        <div
          class="mj-column-per-75 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;"
        >
          
        <table
          border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%"
        >
          <tbody>
            
                <tr>
                  <td
                    align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
          style="font-family:Montserrat, Segoe UI, Roboto, Open Sans, Helvetica Neue;font-size:26px;font-weight:600;line-height:1;text-align:center;color:#ffffff;"
        >Báo cáo đã xử lí xong</div>
      
                  </td>
                </tr>
              
          </tbody>
        </table>
      
        </div>
      
            <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
          
        </div>
      
        
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      
        
        <div  style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
          
          <table
            align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"
          >
            <tbody>
              <tr>
                <td
                  style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
                >
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              
        <div
          class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
        >
          
        <table
          border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
        >
          <tbody>
            
                <tr>
                  <td
                    align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
          style="font-family:Montserrat, Segoe UI, Roboto, Open Sans, Helvetica Neue;font-size:14px;font-weight:500;line-height:1;text-align:left;color:#555555;"
        >Xin chào ${report.reporter.name},</div>
      
                  </td>
                </tr>
              
                <tr>
                  <td
                    align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
          style="font-family:Montserrat, Segoe UI, Roboto, Open Sans, Helvetica Neue;font-size:14px;font-weight:500;line-height:22px;text-align:left;color:#555555;"
        >Báo cáo của bạn về ${
          report.type == 'Bảng quảng cáo'
            ? 'bảng quảng cáo tại địa chỉ ' + report.location.address
            : 'địa điểm quảng cáo (' + report.location.address + ')'
        } đã xử lí xong.</div>
      
                  </td>
                </tr>
              
                <tr>
                  <td
                    align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
        <div
          style="font-family:Montserrat, Segoe UI, Roboto, Open Sans, Helvetica Neue;font-size:14px;font-weight:500;line-height:1;text-align:left;color:#555555;"
        >Nội dung báo cáo:</div>
      
                  </td>
                </tr>
              
                <tr>
                  <td
                    align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
          style="font-family:Montserrat, Segoe UI, Roboto, Open Sans, Helvetica Neue;font-size:14px;font-weight:700;line-height:22px;text-align:left;color:#555555;"
        >${report.content}</div>
      
                  </td>
                </tr>
              
                <tr>
                  <td
                    align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >              
        <div
          style="font-family:Montserrat, Segoe UI, Roboto, Open Sans, Helvetica Neue;font-size:14px;font-weight:500;line-height:1;text-align:left;color:#555555;"
        >Nội dung xử lí báo cáo:</div>
      
                  </td>
                </tr>
              
                <tr>
                  <td
                    align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
          style="font-family:Montserrat, Segoe UI, Roboto, Open Sans, Helvetica Neue;font-size:14px;font-weight:700;line-height:22px;text-align:left;color:#555555;"
        >${report.response}</div>
      
                  </td>
                </tr>
              
                <tr>
                  <td
                    align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
          style="font-family:Montserrat, Segoe UI, Roboto, Open Sans, Helvetica Neue;font-size:14px;font-weight:500;line-height:1;text-align:left;color:#555555;"
        >Thân ái,</div>
      
                  </td>
                </tr>
              
                <tr>
                  <td
                    align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
          style="font-family:Montserrat, Segoe UI, Roboto, Open Sans, Helvetica Neue;font-size:14px;font-weight:700;line-height:1;text-align:left;color:#555555;"
        >AdHubPro.</div>
      
                  </td>
                </tr>
              
          </tbody>
        </table>
      
        </div>
      
            <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
          
        </div>
      
        
        <!--[if mso | IE]></td></tr></table><![endif]-->
      
      
        </div>
      
    </body>
  </html>
  `;
  return template;
};


module.exports = {
  sendEmail,
  genProcessingTemplate,
  genFinishedTemplate
};