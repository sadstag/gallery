# gallery speadsheets

Every site managed by Gallery needs a googler spreadsheet datasource.

You can either create a spreadsheet from scratch visiting [https://docs.google.com/spreadsheets](https://docs.google.com/spreadsheets) or duplicate the demo spreadshit and customize the copy.

TODO create the demo speadsheet.

## speadsheets conventions

All speadsheet sources must obey these conventions so that data ingestion can work properly.

### the very first row : your header row

the first row is your working column header, it is only for you, ignored by Gallery.

You can use it to name your column as you wish without fearing to break anything.

## the second row : gallery header row

the second row maps artwork properties. It's a row to tell which information a column bring to Gallery.

  - columns without value on this row will be ignored, and left free for your entire usage
    - for instance you may want to put on that column the name of the current owner of the artwork, and you don't want it to be exposed on the site. In that case you let the cell empty in that row for that column, and Gallery will simply ignore the column.
  - no artwork property can appear more than once in the row.

There must be one column for special properties *id* and one column for *publish*.

## remaing row : potential artwork rows

The third line is for the first artwork.

Lines with no id will be ignored.

3 consécutives rows with empty id cell is considered as a stop for the ingestion task, the sheet won't be read further.
 
You can leave blank sections in your sheet to organize your file, but no more than 2 in a row.

## available artwork properties

Column identifiers you can use in the gallery header row.

A spreedsheet don't have to map every available artwork properties. Only *id* and *publish* are mandatories.

| column id  | value meaning  |  examples |
|---|---|---|
| id  | The unique identifier of the artwork.<br>It can follow any convention you have for referencing the artworks.<br>It just has to be unique in the column and be non-empty.<br>At least one column must be mapped to the column id `id`. |  REF123, 456, _NF1 |
| publish | Use a **checkbox** in the spreadsheet cells for this one.<br>If TRUE then the artwork will be part of the generated artwork database.<br>if FALSE (or any value different from TRUE) it will be ignored.|TRUE|
| title |...|...|
| description |Long description, just test for now|...|
| remarks| additional (technical) information about the artwork|...|
| year | when was the artwork produced | 1999 |
| support |||
| technic |||
| width | integer, centimeters||
| height | integer, centimeters||
| depth | integer, centimeters||
| available |Use a **checkbox** in the spreadsheet cells for this one.<br>Tells whether the artwork is available for purchase / donation|TRUE|