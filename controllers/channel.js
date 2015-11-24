function channelPage (req, res, next) {
    var renderObj = {
        page: 'channel',
        title: 'Express'
    };
    res.render('channel', renderObj);
}
exports.channel = channelPage;


