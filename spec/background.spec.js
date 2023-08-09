import chrome from 'sinon-chrome';
import BackgroundModule from '../src/background.js'


describe('background.js', function() {

    beforeAll(function () {
        global.chrome = chrome;
        this.background = new BackgroundModule();
    });

  

    it('should create context menu item', function (){
        expect(chrome.contextMenus.create.calledOnceWith({
            id: "getMarkdown",
            title: "getMarkdown",
            contexts: ["selection"],
          })).toBeTrue();
    });

    it('should add listener onClicked', function() {
        expect(chrome.contextMenus.onClicked.addListener.calledOnce).toBeTrue();
    })

    it('should send a message to the content script when the button is clicked', function() {
        expect(chrome.tabs.sendMessage.notCalled).toBeTrue();
        
        chrome.contextMenus.onClicked.trigger({info: 'info' }, { id: 1608580632} );
        expect(chrome.tabs.sendMessage.calledOnce).toBeTrue();
        expect(chrome.tabs.sendMessage.calledOnceWith(1608580632, {
            type: "get-html-select",
            target: "content",
            data: {},
          })).toBeTrue();
    })

    afterAll(function() {
        chrome.flush();
        delete global.chrome;
    })


})


const sampleTab = {
    "active": true,
    "audible": false,
    "autoDiscardable": true,
    "discarded": false,
    "favIconUrl": "https://webpack.js.org/favicon.a3dd58d3142f7566.ico",
    "groupId": -1,
    "height": 875,
    "highlighted": true,
    "id": 1608580632,
    "incognito": false,
    "index": 7,
    "mutedInfo": {
        "muted": false
    },
    "pinned": false,
    "selected": true,
    "status": "complete",
    "title": "Authoring Libraries | webpack",
    "url": "https://webpack.js.org/guides/author-libraries/",
    "width": 443,
    "windowId": 1608580496
}