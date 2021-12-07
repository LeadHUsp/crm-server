import { CourierClient } from '@trycourier/courier';

const courier = CourierClient({ authorizationToken: 'pk_prod_NQ5D8PFQMT47WVJTMKJG1ZBZS05F' });

class MailServices {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
        // this.courier = CourierClient({ authorizationToken: 'pk_prod_NQ5D8PFQMT47WVJTMKJG1ZBZS05F' });
    }
    async sendActivationMail(email, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта на ' + process.env.API,
            text: '',
            html: `
                    <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `,
        });
    }
    //     const res = await courier.send({
    //         eventId: 'courier-quickstart',
    //         recipientId: 'bodvinukr@gmail.com',
    //         data: {
    //             favoriteAdjective: 'awesomeness',
    //         },
    //         profile: {
    //             email: 'bodvinukr@gmail.com',
    //         },
    //     });
    //     console.log(res);
    // }
}

module.exports = new MailServices();
