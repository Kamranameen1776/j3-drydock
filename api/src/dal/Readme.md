Do not use complex sql queries in this layer, that inserts/updates data in several tables.
Keep this layer thin. 


One table == one repository.

If there are no data, return empty not null collection.