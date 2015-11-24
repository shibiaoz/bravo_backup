$(function  () {

    var $jumpListWraper = $('#jump-list-wraper');
    $jumpListWraper.on('click', '#add-plan', function () {
        var url = '/channel';
        window.open(url, '_blank');
    });

});
