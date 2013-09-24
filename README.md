# Hive BitCoinstore

## Installation

```
npm install
bower install
```

To workaround CORS problem launch chrome with:

```
google-chrome --user-data-dir=/tmp/.browser-profile --disable-web-security
```

#### Config
Run:

```
cp config/development.json{.example,}
cp config/production.json{.example,}
```

You need to provide API server URL, username, password and root category ID which subcategories are displayed in category list view.
