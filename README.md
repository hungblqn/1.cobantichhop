# 1.cobantichhop

1.Tải ngrok và source code<br/><br/>
2.Cài node modules bằng npm i, dùng ngrok http 3000 để chuyển hướng về server local<br/><br/>
3.Tạo biểu mẫu Jotform bằng cách vào Integrations -> See more -> Search webhook -> Add to form -> Create a form -> Add Webhook điền link ở chỗ chạy ngrok vào thêm đuôi /webhook. Tiếp theo chuyển sang build, cho element là short text, đổi thành fullname, tiếp theo cho phone number và email vào rồi lưu, thiết lập tất cả thành required và phonenumber thành 10 số.<br/><br/>
4.Ở bên bitrix24 vào phần Ứng dụng -> Tài nguyên cho nhà phát triển -> chọn Nhập và xuất dữ liệu -> Khác -> đổi phương thức thành crm.contact.add -> Lưu, bỏ link url vào trong app.js biến BITRIX_WEBHOOK_URL<br/><br/>
5.Nhập các trường vào jotform, submit và nó sẽ gửi dữ liệu đến server, server xử lý và bắn lại dữ liệu cho bitrix24 với crm.contacct.add và lưu vào phần contacts
