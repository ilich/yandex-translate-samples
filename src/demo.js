import translator from 'translator'

const chromeLangs = {
    'en': 'en-US',
    'de': 'de-DE',
    'fr': 'fr-FR',
    'es': 'es-ES',
    'ru': 'ru-RU'
};

function isSupportedBrowser() {
    return 'webkitSpeechRecognition' in window;
};

function Demo() {
    this.dirs = null;
    this.speech = new webkitSpeechRecognition();
    this.isRecording = false;
}

Demo.prototype.canTranslate = function (trKey) {
    if (!this.dirs) {
        console.error('Supported languages have not been loaded yet.');
        false;
    }

    return this.dirs.indexOf(trKey) > -1;
};

Demo.prototype.translate = function (langFrom, langTo, text) {
    var self = this;

    return new Promise((resolve, reject) => {
        let trKey = `${langFrom}-${langTo}`;
        if (!self.canTranslate(trKey)) {
            let error = `'${langFrom}' to '${langTo}' translation is not supported`;
            reject(error);
            return;
        }

        translator.translate(trKey, text)
            .then((translated) => resolve(translated))
            .catch((error) => reject(error));
    });
};

Demo.prototype.speak = function (lang, text) {
    // Note: voices are loaded in a few seconds after the first window.speechSynthesis.getVoices() call
    // A workaround is to use intervals.

    let voicesHandler = setInterval(() => {
        let voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
            return;
        }

        clearInterval(voicesHandler);

        // Find voice
        let voiceLang = chromeLangs[lang];
        let voice = null;
        for (let v of voices) {
            if (v.lang === voiceLang) {
                voice = v;
                break;
            }
        }

        if (voice === null) {
            return;
        }

        // Speak
        var msg = new SpeechSynthesisUtterance(text);
        msg.voice = voice;
        window.speechSynthesis.speak(msg);
    }, 200);
};

Demo.prototype.recording = function (lang, handler) {
    let self = this;

    return new Promise(function (resolve, reject) {
        if (self.isRecording) {
            self.speech.stop();
        } else {
            self.speech.lang = lang;
            self.speech.onresult = (e) => {
                let text = [];
                for (let result of e.results) {
                    for (let alternative of result) {
                        text.push(alternative.transcript);
                    }
                }

                handler(text.join('\n'));
            };

            self.speech.start();
        }

        self.isRecording = !self.isRecording;
        resolve(self.isRecording);
    });
};

$(document).ready(function () {
    if (!isSupportedBrowser()) {
        alert('Please use Google Chrome or Mozilla Firefox to test Web Speech API');
        window.location.href = 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API';
        return;
    }

    const $langFrom = $('#lang-from');
    const $langTo = $('#lang-to');
    const $textFrom = $('#text-from');
    const $textTo = $('#text-to');
    const $record = $('#record');
    const demo = new Demo();

    translator.loadLanguages().then((lang) => {
        demo.dirs = lang.dirs;

        for (let l in lang.langs) {
            if (chromeLangs.hasOwnProperty(l)) {
                $langFrom.append($('<option>', {value: l, text: lang.langs[l]}));
                $langTo.append($('<option>', {value: l, text: lang.langs[l]}));
            }
        }

        $langFrom.val('en');
        $langTo.val('fr');
    });

    $('#translate').click(() => {
        let langFrom = $langFrom.val();
        let langTo = $langTo.val();
        let text = $textFrom.val();

        demo.translate(langFrom, langTo, text).then((translated) => {
            $textTo.val(translated);
        }).catch((error) => {
            alert(error);
        });
    });

    $record.click(() => {
        if (!demo.isRecording) {
            $textFrom.val('');
        }

        var lang = $langFrom.val();
        lang = chromeLangs[lang];

        demo.recording(lang, (text) => {
            $textFrom.val(text);
        }).then((isRecording) => {
            $record.text(`${isRecording ? 'Stop' : 'Start'} Recording`);
        });
    });

    $('#read').click(() => {
        let lang = $langTo.val();
        let text = $textTo.val();

        demo.speak(lang, text);
    });
});