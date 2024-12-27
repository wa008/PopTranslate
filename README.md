# Introduction
A chrome extension that instantly pop translation by selecting text without any other click, no extra clicks needed, Making translation more intuitive and efficient.

There are three main features
+ Pop translation immediately after selecting text, don't need to click the icon like other translation extension.
+ Pop a frame in top right corner of current window to show the translation, which don't cover the contents you are browsing
+ Show dictionary content for single word, which is suitable for new language learner. This feature is turned off by default.


<div id="pictures">
  <img src="images/readme-demo-1.png" width="400px" >
  <img src="images/readme-demo-2.png" width="400px" >
</div>

https://github.com/user-attachments/assets/b34098fd-0a6f-4b52-9c01-10ab57b2ab34

# Install

Install Link: https://chromewebstore.google.com/detail/poptranslate/moejenjdfpgijcnbddoeokjflkfighla

# Realization
The translation function is from ~~Google api~~ self-hosted [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate). 

Dictionary is from [Free Dictionary API](https://dictionaryapi.dev), Thanks a lot.

Any suggestions and feedback are welcome.

# verison
+ 1.0: first verison
+ 1.1: add target language translate when dictionary open
+ 1.2: fix bugs. 1) works on chatgpt.com 2) works on reddit comments 3) keep slience for special characters
+ 2.0: add features. 1) adding switch for this extension. 2) Making manually adjusted height persist.
+ 2.1: making front size stable
+ 2.2: fix bug. fix porblem that clicking selected text can not close pop window
+ 3.0: replace Google translation API with self-hosted translation service 
+ 3.1: add speicial for chinese to reduce the pressure of service -- 2024.10.22
+ 3.2: don't translate for numbers -- 2024.10.23
+ 3.3: 1) update libertranslate into Gemini flash 2.0. 2) update check selection valid function -- 2024.12.27

# TODO
- [x] To make manually adjusted height of translate windows persist.
- [ ] Disable when selecting websites
- [ ] Fix bugs: This is not a mature product, it need more time to find bug and fix them.
- [ ] Add block option for specific website or domain, like github.
- [ ] More languages support for dictionary: English is only language to support temporary.
- [x] Make dictionary result continuous scrolling
- [ ] Ollama is so quick, maybe it's a better solution to provide translation service.


# Thanks
+ [Free Dictionary API](https://dictionaryapi.dev)
+ [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate)
