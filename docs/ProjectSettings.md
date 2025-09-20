# Основные настройки

## Установить Biome

- Для vs code установить плагин - [visualstudio/biomejs](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
- Основная документация по настройке - [reference/vscode](https://biomejs.dev/reference/vscode/)
- Конфигурация для авто сохранения и исправления ошибок - при желании, это уберёт стандартные настройки
    - Что бы открыть пользовательские настройки в `settings.json`:
        1. Нажать `ctrl+shift+p` - откроется меню
        2. Написать `open user settings (json)` - и выбрать пункт меню с таким названием
        3. Там вписать следующий `JSON` -

```JSON
  "editor.codeActionsOnSave": {
    "source.removeUnusedImports": "always",
    "source.fixAll": "explicit",
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.includeLanguages": {
    "javascript": "javascript",
    "html": "HTML"
  },
```

## Установить Tailwindcss

-  Для vs code установить плагин - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- Основная документация как пользоваться находится так же по ссылке, надо пролистать вниз

## Использование шаблонов .vscode/cch-template

- Данные шаблоны помогают быстро создать основной скелет раздела
- Для vs code установить плагин - [visualstudio/Component Creator](https://marketplace.visualstudio.com/items?itemName=dsbasko.create-component-helper)
- Основная документация как пользоваться находится так же по ссылке, надо пролистать вниз
