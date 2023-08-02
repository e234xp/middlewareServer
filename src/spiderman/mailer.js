const nodemailer = require('nodemailer');

// test
// const config = {
//   host: 'smtp.gmail.com',
//   port: 587,
//   security: 'TLS',
//   email: 'airaface20@gmail.com',
//   password: 'rtsegbssuusreynn',
//   to: ['sa871018@gmail.com', 'gavin.liao@aira.com.tw'],
//   subject: '測試郵件',
//   body: '這是一封測試郵件。',
// };
module.exports = () => {
  function send({
    host, port, security, email, password,
    to, subject, body,
  }) {
    const transporter = (() => {
      const config = {
        host,
        port, // 通常是465（SSL）或587（TLS）
        secure: security === 'SSL/TLS',
        requireTLS: security === 'TLS',
        auth: {
          user: email,
          pass: password,
        },
        tls: {
          rejectUnauthorized: false, // don't verify certificates
          ciphers: 'SSLv3',
        },
        debug: true, // show debug output
        logger: true, // log information in console
      };

      return nodemailer.createTransport(config);
    })();

    const mailOptions = {
      headers: {
        'X-Spam-Flag': 'yes',
        'X-Spam-Level': '******',
        'X-GND-Spam-Score': '100',
        'X-GND-Status': 'SPAM',
      },
      from: email,
      to: to.join(', '),
      subject,
      html: body,
      // todo attachments
      // attachments,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('郵件發送失敗：', error);
      } else {
        console.log('郵件已成功發送：', info.response);
      }
    });
  }

  return {
    send,
  };
};
