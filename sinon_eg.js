import chrome from 'sinon-chrome';

describe('file under test', function() {
    beforeAll(function () {
        global.chrome = chrome
    })
})