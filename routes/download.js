require('dotenv').config();
const router = require('express').Router();
// const { APP_BASE_URL } = require('../keys/keys');
const File = require('../models/file');

router.get('/:uuid', async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });

        if (!file) {
            return res.render('download', {
                error: 'Download link has expired'
            });
        }

        const filePath = `${__dirname}/../${file.path}`;
        console.log(file.path);
        console.log(filePath);
        res.download(filePath);

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

module.exports = router;