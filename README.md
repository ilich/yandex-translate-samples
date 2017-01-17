# speech-api-ndc-london-2017
HTML 5 Speech API demo for NDC London 2017

## Installation

1. Register Yandex.Translate API key on https://tech.yandex.com/translate/

2. Restore NPM packages.

```npm install```

3. Create **./src/settings.js** file and add Yandex.Translate API key there.

```js
export default {
    yandexTranslate: "trnsl.1.1.XXXX...XXX.XXXXXXXX.....XXX"
};
```

4. Build the project.

```npm run build```

5. Start the project and open http://localhost:8080/ in your browser.

```npm run start```