const express = require("express");
const axios = require("axios");
const winston = require("winston");
const formidable = require("express-formidable");

const app = express();
const port = 3000;

// === CẤU HÌNH ===
const BITRIX_WEBHOOK_URL = "https://viethung.bitrix24.vn/rest/1/spnbkec83ljwt9g3/crm.contact.add.json";

// Logger: ghi log ra file + console
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}] ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "app.log" })
  ],
});

// Middleware nhận mọi dạng dữ liệu từ webhook Jotform
app.use(formidable());

// === Hàm ánh xạ field từ Jotform sang Bitrix24 ===
function mapFields(jotformData) {
  let formData = {};
  if (jotformData.rawRequest) {
    try {
      formData = JSON.parse(jotformData.rawRequest);
    } catch (e) {
      logger.error("Không parse được rawRequest: " + e.message);
    }
  }

  logger.info(`Dữ liệu parse từ rawRequest: ${JSON.stringify(formData, null, 2)}`);

  return {
    fields: {
      NAME: formData.q3_fullname || "",
      PHONE: formData.q5_phoneNumber && formData.q5_phoneNumber.full 
        ? [{ VALUE: formData.q5_phoneNumber.full, VALUE_TYPE: "WORK" }]
        : [],
      EMAIL: formData.q6_email 
        ? [{ VALUE: formData.q6_email, VALUE_TYPE: "WORK" }]
        : []
    }
  };
}

// === Endpoint nhận webhook từ Jotform ===
app.post("/webhook", async (req, res) => {
  try {
    const jotformData = req.fields; // dùng req.fields với express-formidable
    logger.info(`Nhận dữ liệu từ Jotform: ${JSON.stringify(jotformData, null, 2)}`);

    const contactData = mapFields(jotformData);

    // Gọi API Bitrix24 để tạo Contact
    const response = await axios.post(BITRIX_WEBHOOK_URL, contactData);
    logger.info(`Tạo Contact thành công: ${JSON.stringify(response.data)}`);

    res.status(200).send({ success: true, bitrix_response: response.data });
  } catch (error) {
    logger.error(`Lỗi gửi sang Bitrix24: ${error.message}`);
    res.status(500).send({ success: false, error: error.message });
  }
});

// === Chạy server ===
app.listen(port, () => {
  logger.info(`Server đang chạy tại http://localhost:${port}`);
});
