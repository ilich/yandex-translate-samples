# Web Speech API and Yandex.Translate Example

## Installation

* Register Yandex.Translate API key on https://tech.yandex.com/translate/.

* Restore NPM packages.
```npm install```

* Create **./src/settings.js** file and add Yandex.Translate API key there.
```js
export default {
    yandexTranslate: "trnsl.1.1.XXXX...XXX.XXXXXXXX.....XXX"
};
```

* Build the project.
```npm run build```

* Start the project and open http://localhost:8080/ in your browser.
```npm run start```