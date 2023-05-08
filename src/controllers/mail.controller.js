const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sender = require("../config/index").sender;
const excel = require("exceljs");
const fs = require('fs');

exports.sendEmail = async (req, res) => {

    try {

        // let workbookReader = new excel.stream.xlsx.WorkbookReader(`./files/2023-05-08.xlsx`);
        let workbookReader = new excel.stream.xlsx.WorkbookReader(`./files/${req.params.fileName}`);

        for await (const worksheetReader of workbookReader) {
            for await (const row of worksheetReader) {
                const msg = {
                    to: row.values[1],
                    from: sender, // Use the email address or domain you verified above
                    subject: row.values[2],
                    text: row.values[3],
                    // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
                };

                console.log(msg)

                // //ES8
                // try {
                //     await sgMail.send(msg);
                // } catch (error) {
                //     console.error(error);

                //     if (error.response) {
                //         console.error(error.response.body)
                //     }
                    
                // }
            }
        }
        
        const fileName = `${req.params.fileName.split('.')[0]}-sent.${req.params.fileName.split('.')[1]}`

        fs.rename('./files/' + req.params.fileName, './files/' + fileName, function (err) {
            if (err) {
                return res.status(500).json({ status: "errors", message: err })
            }
    
            return res.send({
                fileName: fileName
            });
        });

    } catch (err) {
        console.log(err)
        return res.status(500).send(err);
    }
}

