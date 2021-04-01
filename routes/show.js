const router = require('express').Router();
const File = require('../models/file');
// const { APP_BASE_URL } = require('../config/keys');

router.get('/:uuid', async (req, res) => {

    try {
        const file = await File.findOne({ uuid: req.params.uuid });

        //validation 
        if (!file) {
            return res.render('download', { error: "Link has expired." });
        }

        return res.render('download', {
            uuid: file.uuid,
            fileName: file.filename,
            fileSize: file.size,
            downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
        });
    }
    catch (err) {
        return res.render('download', { error: "Something went wrong." });
    }
});

module.exports = router;