# emagazynBackendMEN

## It's alive
Taak wreszcie projekt stanął, może dzięki zdalnemu nauczniu, ale mniejsza.
## o programie
Jest to aplikacja webowa służąca do zarządzania magazynem(w przyszłości archiwum i biblioteką) Hufca ZHP Gorlice, a w przyszłości mam nadzieję że też innych hufców.
## struktura pliku .env
```
MONGO_URI=
PORT=
DROP_COLLECTION=
REGEX_STORE=
REGEX_ARCHIVE=
REGEX_LIBRARY=
STORE_PREFIX=
ARCHIVE_PREFIX=
LIBRARY_PREFIX=
EMAIL_REGEX=
TOKEN_SECRET=
EMAIL_SECRET=
ADRESS=
EMAIL_LOGIN=
EMAIL_PASSWORD=
EMAIL_SMTP_HOST=
EMAIL_SMTP_PORT=
```
## dla frontu
autoryzacja odbywa się poprzez dodanie tokena do requestów w headerze AUTH-TOKEN
