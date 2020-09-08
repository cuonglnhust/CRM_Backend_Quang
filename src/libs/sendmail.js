var ejs = require('ejs');
var path = require('path');
import {MidDistributor } from '../models/middle'

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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");

export const sendMailWithTemplate = (htmlStr ,email, subject) => {
  return new Promise((resolve, reject) => {
    const msg = {
      to: email,
      from: 'KickEnglish <no-reply@skystudio.tv>',
      subject: subject,
      html: htmlStr
    };

    sgMail
    .send(msg)
    .then(() => {}, error => {
      if (error.response) {
        return reject(error.response.body)
      }

      resolve('Success')
    });
  })
}

export const sendMailActiveOrder = async(data) => {
  let dataEmail = {
    distributor: '',
    license_key: data.license_key,
    packageName: ''
  };

  // const customerData = await MidCustomer.getCustomerByCondition({ id: data.userid });
  // if (!customerData) {
  //   return;
  // }

  if (data.distributor_id) {
    const distributorData = await MidDistributor.getDistributorById(data.distributor_id);
    dataEmail.distributor = distributorData || "";
  }

  if (data.package_id == 1) {
    dataEmail.packageName = 'VIP 1 THÁNG';
  } else if (data.package_id == 2) {
    dataEmail.packageName = 'VIP 3 THÁNG';
  } else if (data.package_id == 3) {
    dataEmail.packageName = 'VIP 1 NĂM';
  } else if (data.package_id == 4) {
    dataEmail.packageName = 'VIP TRỌN ĐỜI';
  }

  let pathFile = path.join(__dirname, '../views/email/activeOrder.ejs');
  ejs.renderFile(pathFile, dataEmail, function (err, html) {
    if (err) {
      console.log('++++++++++', err)
    }
    return sendMailWithTemplate(html, customerData.email, 'KickEnglish Kích hoạt key');
  });
}

export const sendMailForgotPassword = async(data) => {

  let dataEmail = {
    productName: "KickEnglish",
    name: data.name,
    email: data.email,
    hostVerify: data.hostVerify,
    hostWeb: data.hostWeb
  };

  let pathFile = path.join(__dirname, '../views/email/forgotPassword.ejs');

  ejs.renderFile(pathFile, dataEmail, function (err, html) {
    if (err) {
      console.log('++++++++++', err)
    }
    return sendMailWithTemplate(html, dataEmail.email, 'KickEnglish lấy lại mật khẩu');
  });
}

