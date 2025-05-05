import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendQRCodeEmail = async (userEmail, qrCodePath) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "🎟️ Tu registro al evento - Código QR",
      html: `
        <div style="font-family: 'Arial', sans-serif; background-color: #121212; padding: 40px; text-align: center; color: white;">
          <div style="max-width: 500px; background: #1E1E1E; padding: 30px; border-radius: 12px; margin: auto; box-shadow: 0 4px 10px rgba(255, 255, 255, 0.1);">
            <h2 style="color: #3369A4; font-size: 24px; margin-bottom: 10px;">¡Registro exitoso! 🎉</h2>
            <p style="font-size: 16px; color: #BBB;">Estamos ansiosos por recibirte.</p>
            <div style="background: #222; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <img src="cid:qrcode" alt="Código QR" style="width: 200px; height: auto; border-radius: 8px;"/>
            </div>
            <p style="font-size: 14px; color: #999;">Muestra este código QR para ingresar a la asamblea general.</p>
            <a href="https://www.asambleageneral2025.com/infoevento"
               style="display: inline-block; padding: 12px 24px; margin-top: 15px;
                      background-color: #3369A4; color: #FFFFFF; text-decoration: none;
                      font-weight: bold; border-radius: 6px; font-size: 16px;">
               Ver Detalles
            </a>
            <p style="font-size: 12px; color: #666; margin-top: 20px;">
              Guarda bien este código. Sin él no podrás acceder al evento.
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: "qrcode.png",
          path: qrCodePath,
          cid: "qrcode",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo con QR enviado a", userEmail);
  } catch (error) {
    console.error("Error enviando correo:", error);
  }
};