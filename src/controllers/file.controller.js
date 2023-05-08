const fs = require('fs');
const path = require('path')
const multer = require('multer');
const excel = require("exceljs");

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, './files');
    },
    filename: (req, file, cb) => {

        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

exports.upload = upload.single('file');
exports.fileHandle = (req, res) => {
    try {
        const words = req.file.originalname.split('.');
        const fileType = words[words.length - 1];

        const _now = new Date();
        const fileName = `${_now.getTime()}.${fileType}`

        // let workbookReader = new excel.stream.xlsx.WorkbookReader(`./files/${req.params.fileName}`);

        //     for (const worksheetReader of workbookReader) {
        //         worksheetReader
        //     }

        fs.rename('./files/' + req.file.originalname, './files/' + fileName, function (err) {
            if (err) {
                return res.status(200).json({ status: "errors", message: err })
            }
            return res.send({
                fileName: fileName
            });
        });
    } catch (err) {
        console.log(err)
        return res.status(500).send();
    }

}

exports.getFile = (req, res) => {

    var url = path.join(__dirname, '../../files/')
    res.sendFile(`${url}/${req.params.fileName}`);
}

exports.getAllFiles = (req, res) => {
    fs.readdir(`./files/`, (err, files) => {
        if (err) {
            return res.send([])
        }

        let result = [];
        for (let i = 0; i < files.length; i++) {
            result.push({
                id: i,
                name: files[i],
                count: 0,
                status: files[i].includes("-sent"),
                label: files[i].split("-sent")[0]
            })
        }
        return res.send(result);

    });

}

exports.delete = (req, res) => {
    fs.unlink(`./files/${req.params.fileName}`, (err) => {
        if (err) return res.status(200).send(err);
        return res.status(200).send('success');
    })
}


