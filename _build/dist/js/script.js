(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var win = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
    var doc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

    // 半角英数字文字列を全角文字列に変換する
    String.prototype.toTwoByteAlphaNumeric = function () {
        return this.replace(/[A-Za-z0-9]/g, function (s) {
            return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
        });
    };

    var Main = function () {
        function Main() {
            _classCallCheck(this, Main);

            this.SLOT_NUM = $('.contents__slot__inner').size();
            this.is_stop = [];

            this.is_sp = false;

            this.$body = $('body');
            this.$slot = [];
            this.$slot_txt = [];
            this.$slot_click = [];

            this.$contents = $('.contents');
            this.$contents_again = $('.contents__btn__again');
            this.$contents_btn = $('.contents__btn');
            this.$btn = $('.contents__btn');
            this.$slot_inner = $('.contents__slot__inner');
            this.$footer = $('.footer');

            this.URL = $('meta[property="og:url"]').attr('content');

            this.exec();
        }

        _createClass(Main, [{
            key: 'exec',
            value: function exec() {
                var _this = this;

                /*-----------------------------------
                 * EVENT LISTENER
                 -----------------------------------*/
                $(window).on('resize', $.throttle(500, function () {
                    _this.resize();
                }));

                /*-----------------------------------
                 * INIT
                 -----------------------------------*/
                this.getData().then(function (words) {
                    _this.startSlot(words);
                });

                if (navigator.userAgent.match(/iphone|ipod|ipad/i)) {
                    this.is_sp = true;
                    document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=640, minimum-scale=0.25, maximum-scale=1.6, user-scalable=no');
                } else if (navigator.userAgent.match(/android/i)) {
                    this.is_sp = true;
                }

                if (this.is_sp) {
                    this.$body.addClass('is-sp');
                } else {
                    this.$body.addClass('is-pc');
                }
                this.setSocial();
                this.resize();
            }
        }, {
            key: 'setSocial',
            value: function setSocial() {
                var _this2 = this;

                // facebook
                var fjs = document.getElementsByTagName("script")[0];
                var js = document.createElement('script');

                if (document.getElementById('facebook-jssdk')) return;
                js.id = 'facebook-jssdk';
                js.src = '//connect.facebook.net/ja_JP/sdk.js#xfbml=1&appId=' + $('meta[property="fb:app_id"]').attr('content') + '&version=v2.0';
                fjs.parentNode.insertBefore(js, fjs);

                $('.facebook').on('click', function () {
                    var name = '';
                    for (var i = 0; i < _this2.SLOT_NUM; i++) {
                        name += _this2.$slot_txt[i].text() + ' ';
                    }

                    name += ' #チョコ俳句スロット';

                    FB.ui({
                        method: 'feed',
                        link: _this2.URL,
                        picture: $('meta[property="og:image"]').attr('content'),
                        name: name,
                        description: $('title').text()
                    });
                });

                // twitter
                $('.twitter').on('click', function (e) {
                    e.preventDefault();

                    var dualScreenLeft = void 0;
                    var dualScreenTop = void 0;
                    var windowWidth = void 0;
                    var windowHeight = void 0;
                    var popupWidth = 650;
                    var popupHeight = 450;
                    var top = void 0;
                    var left = void 0;
                    var href = void 0;
                    var description = '';
                    var text_length = 0;

                    for (var i = 0; i < _this2.SLOT_NUM; i++) {
                        if (_this2.$slot_txt[i].text().length > text_length) {
                            text_length = _this2.$slot_txt[i].text().length;
                        }
                    }

                    for (var text_i = 0; text_i < text_length; text_i++) {
                        for (var slot_i = _this2.SLOT_NUM - 1; slot_i >= 0; slot_i--) {
                            if (_this2.$slot_txt[slot_i].text().length > text_i) {
                                if (_this2.$slot_txt[slot_i].text()[text_i] === 'ー') {
                                    description += '｜';
                                } else {
                                    description += _this2.$slot_txt[slot_i].text()[text_i].toTwoByteAlphaNumeric();
                                }
                            } else {
                                description += '　';
                            }
                            description += '　';
                        }
                        description += '\n';
                    }

                    description += '\n';

                    if (typeof window.screenLeft !== 'undefined') {
                        dualScreenLeft = window.screenLeft;
                        dualScreenTop = window.screenTop;
                    } else {
                        dualScreenLeft = window.screen.left;
                        dualScreenTop = window.screen.top;
                    }

                    if (typeof window.innerWidth !== 'undefined') {
                        windowWidth = window.innerWidth;
                        windowHeight = window.innerHeight;
                    } else if (typeof document.documentElement !== 'undefined' && typeof document.documentElement.clientWidth !== 'undefined') {
                        windowWidth = document.documentElement.clientWidth;
                        windowWidth = document.documentElement.clientHeight;
                    } else {
                        windowWidth = window.screen.width;
                        windowWidth = window.screen.height;
                    }

                    left = windowWidth / 2 - popupWidth / 2 + dualScreenLeft;
                    top = windowHeight / 2 - popupHeight / 2 + dualScreenTop;

                    href = 'http://twitter.com/share?url=' + _this2.URL + '&text=' + encodeURIComponent(description) + '&hashtags=' + encodeURIComponent('チョコ俳句スロット');

                    window.open(href, 'twitter', 'width=' + popupWidth + ', height=' + popupHeight + ', top=' + top + ', left=' + left);
                });
            }
        }, {
            key: 'resize',
            value: function resize() {
                if ($(window).height() > this.$contents.height() + 100) {
                    this.$footer.addClass('is-bottom');
                } else {
                    this.$footer.removeClass('is-bottom');
                }

                this.$contents.css({
                    marginTop: Math.max(($(window).height() - this.$contents.height()) / 2, 0)
                });
            }
        }, {
            key: 'getData',
            value: function getData() {
                var d = new $.Deferred();
                var src = 'https://spreadsheets.google.com/feeds/list/1Krary-8XNCwcH6LSe44A6gwCmmaKia97-4MYkRRFE2Q/ojc6izf/public/basic?alt=json-in-script';
                var CHOCO_EXP = [/(^|\ )chocofirst: (.*?)(,|$)/, /(^|\ )chocosecond: (.*?)(,|$)/, /(^|\ )chocothird: (.*?)(,|$)/];
                var EXP = [/(^|\ )first: (.*?)(,|$)/, /(^|\ )second: (.*?)(,|$)/, /(^|\ )third: (.*?)(,|$)/];
                var words = [];
                var re = /./g;
                for (var i = 0; i < EXP.length; i++) {
                    words[i] = [];
                }win.gdata = {};
                win.gdata.io = {};
                win.gdata.io.handleScriptLoaded = function (response) {
                    for (var _i = 0; _i < response.feed.entry.length; _i++) {
                        for (var exp_i = 0; exp_i < EXP.length; exp_i++) {
                            var result = void 0;

                            if (response.feed.entry[_i].content.$t.match(EXP[exp_i])) {
                                var span_text = '';
                                // spanで全文字を囲う
                                while (result = re.exec(response.feed.entry[_i].content.$t.match(EXP[exp_i])[2])) {
                                    if (result[0].match(/ー|【|】/)) {
                                        span_text += '<span class="is_vertical">' + result[0] + '</span>';
                                    } else {
                                        span_text += '<span>' + result[0] + '</span>';
                                    }
                                }

                                words[exp_i].push({
                                    is_choco: false,
                                    text: span_text
                                });
                            }
                            if (response.feed.entry[_i].content.$t.match(CHOCO_EXP[exp_i])) {
                                var _span_text = '';
                                // spanで全文字を囲う
                                while (result = re.exec(response.feed.entry[_i].content.$t.match(CHOCO_EXP[exp_i])[2])) {
                                    if (result[0].match(/ー|【|】/)) {
                                        _span_text += '<span class="is_vertical">' + result[0] + '</span>';
                                    } else {
                                        _span_text += '<span>' + result[0] + '</span>';
                                    }
                                }

                                words[exp_i].push({
                                    is_choco: true,
                                    text: _span_text
                                });
                            }
                        }
                    }
                    d.resolve(words);
                };
                $('head').append($('<script>').attr({ src: src }));
                return d.promise();
            }
        }, {
            key: 'checkFin',
            value: function checkFin() {
                var is_fin = true;

                for (var i = 0; i < this.SLOT_NUM; i++) {
                    if (!this.is_stop[i]) {
                        is_fin = false;
                        break;
                    }
                }

                if (is_fin) {
                    this.$contents_btn.show().animate({ opacity: 1 }, 500);
                }
            }
        }, {
            key: 'restartSlot',
            value: function restartSlot() {
                var _this3 = this;

                for (var i = 0; i < this.SLOT_NUM; i++) {
                    this.is_stop[i] = false;
                    this.$slot_click[i].removeClass('is-stop');
                }

                this.choco_id = Math.floor(Math.random() * 3);
                this.slot_data = [];

                this.$contents_btn.animate({ opacity: 0 }, 500, function () {
                    _this3.$contents_btn.hide();
                });

                window.ga('restart', 'event', 'button', 'click', 'restart');
            }
        }, {
            key: 'startSlot',
            value: function startSlot(words) {
                var _this4 = this;

                var click = 'click';

                if (this.is_sp) click = 'touchstart';

                for (var i = 0; i < this.SLOT_NUM; i++) {
                    this.$slot[i] = this.$slot_inner.filter('[data-id="' + i + '"]');
                    this.$slot_txt[i] = this.$slot[i].find('.contents__slot__inner__txt');
                    this.$slot_click[i] = this.$slot[i].find('.contents__slot__inner__click');
                }

                this.restartSlot();

                /*-----------------------------------
                 * EVENT LISTENER
                 -----------------------------------*/
                this.$slot_inner.find('.contents__slot__inner__click').on(click, function (e) {
                    var slot_i = parseInt($(e.target).parent().attr('data-id'));
                    _this4.is_stop[slot_i] = true;
                    $(e.target).addClass('is-stop');

                    // チョコワードと非チョコワードの制御
                    for (var _i2 = 0; _i2 < words[slot_i].length; _i2++) {
                        var word_i = (_this4.slot_data[slot_i].word_i + _i2) % words[slot_i].length;
                        if (slot_i === _this4.choco_id === words[slot_i][word_i].is_choco) {
                            _this4.$slot_txt[slot_i].html(words[slot_i][word_i].text);
                            break;
                        }
                    }

                    _this4.checkFin();
                });

                this.$contents_again.on(click, function () {
                    _this4.restartSlot();
                });

                /*-----------------------------------
                 * INIT
                 -----------------------------------*/
                if (location.search === '?yukkuri') {
                    createjs.Ticker.setFPS(3);
                } else if (location.search === '?hayaku') {
                    createjs.Ticker.setFPS(60);
                } else {
                    createjs.Ticker.setFPS(12);
                }

                createjs.Ticker.addEventListener('tick', function (e) {
                    for (var _i3 = 0; _i3 < _this4.SLOT_NUM; _i3++) {
                        if (!_this4.is_stop[_i3]) {
                            var word_i = Math.floor(e.runTime % words[_i3].length);
                            _this4.slot_data[_i3] = {
                                word_i: word_i,
                                is_choco: words[_i3][word_i].is_choco
                            };
                            _this4.$slot_txt[_i3].html(words[_i3][Math.floor(e.runTime % words[_i3].length)].text);
                        }
                    }
                });
            }
        }]);

        return Main;
    }();

    new Main();
})();

},{}]},{},[1]);
