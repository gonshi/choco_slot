(function(win = window, doc = document){
    // 半角英数字文字列を全角文字列に変換する
    String.prototype.toTwoByteAlphaNumeric = function(){
        return this.replace(/[A-Za-z0-9]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
        });
    }

    class Main{
        constructor(){
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

        exec(){
            /*-----------------------------------
             * EVENT LISTENER
             -----------------------------------*/
            $(window).on('resize',
                $.throttle(500, () => {
                    this.resize();
                })
            );

            /*-----------------------------------
             * INIT
             -----------------------------------*/
            this.getData().
            then((words) => {
                this.startSlot(words);
            });

            if(navigator.userAgent.match(/iphone|ipod|ipad/i)){
              this.is_sp = true;
              document.querySelector('meta[name="viewport"]').setAttribute(
                  'content',
                  'width=640, minimum-scale=0.25, maximum-scale=1.6, user-scalable=no'
              );
            }
            else if(navigator.userAgent.match(/android/i)){
              this.is_sp = true;
            }

            if(this.is_sp){
                this.$body.addClass('is-sp');
            }
            else{
                this.$body.addClass('is-pc');
            }
            this.setSocial();
            this.resize();
        }

        setSocial(){
            // facebook
            var fjs = document.getElementsByTagName("script")[0];
            var js = document.createElement('script');

            if(document.getElementById('facebook-jssdk')) return;
            js.id = 'facebook-jssdk';
            js.src = `//connect.facebook.net/ja_JP/sdk.js#xfbml=1&appId=${$('meta[property="fb:app_id"]').attr('content')}&version=v2.0`;
            fjs.parentNode.insertBefore(js, fjs);

            $('.facebook').on('click', () => {
                let name = '';
                for(let i = 0; i < this.SLOT_NUM; i++){
                    name += `${this.$slot_txt[i].text()} `;
                }

                name += ' #チョコ俳句スロット';

                FB.ui({
                    method: 'feed',
                    link: this.URL,
                    picture: $('meta[property="og:image"]').attr('content'),
                    name: name,
                    description: $('title').text()
                });
            });

            // twitter
            $('.twitter').on('click', (e) => {
                e.preventDefault();

                let dualScreenLeft;
                let dualScreenTop;
                let windowWidth;
                let windowHeight;
                let popupWidth = 650
                let popupHeight = 450
                let top;
                let left;
                let href;
                let description = '';
                let text_length = 0;

                for(let i = 0; i < this.SLOT_NUM; i++){
                    if(this.$slot_txt[i].text().length > text_length){
                        text_length = this.$slot_txt[i].text().length;
                    }
                }

                for(let text_i = 0; text_i < text_length; text_i++){
                    for(let slot_i = this.SLOT_NUM - 1; slot_i >= 0; slot_i--){
                        if(this.$slot_txt[slot_i].text().length > text_i){
                            if(this.$slot_txt[slot_i].text()[text_i] === 'ー'){
                                description += '｜';
                            }
                            else{
                                description += this.$slot_txt[slot_i].text()[text_i].toTwoByteAlphaNumeric();
                            }
                        }
                        else{
                            description += '　';
                        }
                        description += '　';
                    }
                    description += '\n';
                }

                description += '\n';

                if(typeof window.screenLeft !== 'undefined'){
                    dualScreenLeft = window.screenLeft;
                    dualScreenTop = window.screenTop;
                }
                else{
                    dualScreenLeft = window.screen.left;
                    dualScreenTop = window.screen.top;
                }

                if(typeof window.innerWidth !== 'undefined'){
                    windowWidth = window.innerWidth;
                    windowHeight = window.innerHeight;
                }
                else if(typeof document.documentElement !== 'undefined' &&
                        typeof document.documentElement.clientWidth !== 'undefined'){
                    windowWidth = document.documentElement.clientWidth;
                    windowWidth = document.documentElement.clientHeight;
                }
                else{
                    windowWidth = window.screen.width;
                    windowWidth = window.screen.height;
                }

                left = ((windowWidth / 2) - (popupWidth / 2)) + dualScreenLeft;
                top = ((windowHeight / 2) - (popupHeight / 2)) + dualScreenTop;

                href = `http://twitter.com/share?url=${this.URL}&text=${encodeURIComponent(description)}&hashtags=${encodeURIComponent('チョコ俳句スロット')}`;

                window.open(href, 'twitter', `width=${popupWidth}, height=${popupHeight}, top=${top}, left=${left}`);
            });
        }

        resize(){
            if($(window).height() > this.$contents.height() + 300){
                this.$footer.addClass('is-bottom');
            }
            else{
                this.$footer.removeClass('is-bottom');
            }

            this.$contents.css({
                marginTop: Math.max(($(window).height() - this.$contents.height()) / 2, 0)
            });
        }

        getData(){
            var d = new $.Deferred;
            var src = 'https://spreadsheets.google.com/feeds/list/1Krary-8XNCwcH6LSe44A6gwCmmaKia97-4MYkRRFE2Q/ojc6izf/public/basic?alt=json-in-script';
            const CHOCO_EXP = [
                /(^|\ )chocofirst: (.*?)(,|$)/,
                /(^|\ )chocosecond: (.*?)(,|$)/,
                /(^|\ )chocothird: (.*?)(,|$)/
            ];
            const EXP = [
                /(^|\ )first: (.*?)(,|$)/,
                /(^|\ )second: (.*?)(,|$)/,
                /(^|\ )third: (.*?)(,|$)/
            ];
            var words = [];
            var re = /./g;
            for(let i = 0; i < EXP.length; i++) words[i] = [];

            win.gdata = {}
            win.gdata.io = {}
            win.gdata.io.handleScriptLoaded = (response) => {
                for(let i = 0; i < response.feed.entry.length; i++){
                    for(let exp_i = 0; exp_i < EXP.length; exp_i++){
                        let result;

                        if(response.feed.entry[i].content.$t.match(EXP[exp_i])){
                            let span_text = '';
                            // spanで全文字を囲う
                            while(result = re.exec(response.feed.entry[i].content.$t.match(EXP[exp_i])[2])){
                                if(result[0].match(/ー|【|】/)){
                                    span_text += `<span class="is_vertical">${result[0]}</span>`;
                                }
                                else{
                                    span_text += `<span>${result[0]}</span>`;
                                }
                            }

                            words[exp_i].push({
                                is_choco: false,
                                text: span_text
                            });
                        }
                        if(response.feed.entry[i].content.$t.match(CHOCO_EXP[exp_i])){
                            let span_text = '';
                            // spanで全文字を囲う
                            while(result = re.exec(response.feed.entry[i].content.$t.match(CHOCO_EXP[exp_i])[2])){
                                if(result[0].match(/ー|【|】/)){
                                    span_text += `<span class="is_vertical">${result[0]}</span>`;
                                }
                                else{
                                    span_text += `<span>${result[0]}</span>`;
                                }
                            }

                            words[exp_i].push({
                                is_choco: true,
                                text: span_text
                            });
                        }
                    }
                }
                d.resolve(words);
            };
            $('head').append($('<script>').attr({src: src}));
            return d.promise();
        }

        checkFin(){
            var is_fin = true;

            for(let i = 0; i < this.SLOT_NUM; i++){
                if(!this.is_stop[i]){
                    is_fin = false;
                    break;
                }
            }

            if(is_fin){
                this.$contents_btn.show().animate({opacity: 1}, 500);
            }
        }

        restartSlot(){
            for(let i = 0; i < this.SLOT_NUM; i++){
                this.is_stop[i] = false;
                this.$slot_click[i].removeClass('is-stop');
            }

            this.choco_id = Math.floor(Math.random() * 3);
            this.slot_data = [];

            this.$contents_btn.animate({opacity: 0}, 500, () => {
                this.$contents_btn.hide();
            });

            window.ga('restart', 'event', 'button', 'click', 'restart');
        }

        startSlot(words){
            var click = 'click';

            if(this.is_sp) click = 'touchstart';

            for(let i = 0; i < this.SLOT_NUM; i++){
                this.$slot[i] = this.$slot_inner.filter(`[data-id="${i}"]`);
                this.$slot_txt[i] = this.$slot[i].find('.contents__slot__inner__txt');
                this.$slot_click[i] = this.$slot[i].find('.contents__slot__inner__click');
            }

            this.restartSlot();

            /*-----------------------------------
             * EVENT LISTENER
             -----------------------------------*/
            this.$slot_inner.find('.contents__slot__inner__click').on(click, (e) => {
                let slot_i = parseInt($(e.target).parent().attr('data-id'));
                this.is_stop[slot_i] = true;
                $(e.target).addClass('is-stop');

                // チョコワードと非チョコワードの制御
                for(let i = 0; i < words[slot_i].length; i++){
                    let word_i = (this.slot_data[slot_i].word_i + i) % words[slot_i].length;
                    if((slot_i === this.choco_id) === words[slot_i][word_i].is_choco){
                        this.$slot_txt[slot_i].html(words[slot_i][word_i].text);
                        break;
                    }
                }

                this.checkFin();
            });

            this.$contents_again.on(click, () => {
                this.restartSlot();
            });

            /*-----------------------------------
             * INIT
             -----------------------------------*/
            if(location.search === '?yukkuri'){
                createjs.Ticker.setFPS(3);
            }
            else if(location.search === '?hayaku'){
                createjs.Ticker.setFPS(60);
            }
            else{
                createjs.Ticker.setFPS(12);
            }

            createjs.Ticker.addEventListener('tick', (e) => {
                for(let i = 0; i < this.SLOT_NUM; i++){
                    if(!this.is_stop[i]){
                        let word_i = Math.floor(e.runTime % words[i].length);
                        this.slot_data[i] = {
                            word_i: word_i,
                            is_choco: words[i][word_i].is_choco
                        };
                        this.$slot_txt[i].html(words[i][Math.floor(e.runTime % words[i].length)].text);
                    }
                }
            });
        }
    }

    new Main();
})();
