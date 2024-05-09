
# per-site configuration file

One folder per site in `sites/`, its name will now be called *site_id*.

Each site folder must contain a `config.json` file.

| key  | value meaning  |  example |
|---|---|---|
| tech |
| domain_name | domain of the website, for which you are able to define DNS records | |
| sheet_id  | This is the id of the google sheet that will be taken as source for  artworks data. This can be found in the google sheet editor URL : https://docs.google.com/spreadsheets/d/1xBYqjQpYiq0765Ftt3hRCo4qQFugmFchQA-78LnvWnM |  1xBYqjQpYiq0765Ftt3hRCo4qQFugmFchQA-78LnvWnM |
| bucket_name | name of the bucket that contain all file for the site |  named whatever-you-want, provided no bucket exists with the same name  WORLWIDE, try another name if terraform provisionning failed becasue of that |
| content |
| title | main title of the gallery | "My gallery" |
| subtitle | main title of the gallery | "My subtitle" |
| presentation | Text presenting the gallery / the author | "This is my gallery.\nAnd that's pretty much it." |

