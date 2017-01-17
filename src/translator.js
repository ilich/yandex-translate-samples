import settings from 'settings'

export default {
    loadLanguages: () => {
        return new Promise((resolve, reject) => {
            $.post('https://translate.yandex.net/api/v1.5/tr.json/getLangs', {
                ui: 'en',
                key: settings.yandexTranslate
            }, (lang) => {
                resolve(lang);
            }, 'json');
        });
    },
    translate: (lang, text) => {
        return new Promise((resolve, reject) => {
            $.post('https://translate.yandex.net/api/v1.5/tr.json/translate', {
                key: settings.yandexTranslate,
                text: text,
                lang: lang,
                format: 'plain'
            }, (res) => {
                if (res.code !== 200) {
                    reject(`Translation failed. Error code: ${res.code}`);
                } else {
                    let translated = res.text.join('\n');
                    resolve(translated);
                }
            }, 'json');
        });
    }
};