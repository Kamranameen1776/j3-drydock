All this migration which is needed on stg are to be added in the folder in the sequential order of their execution.
All the migration added to this folder will be run on stg2test, stg, qc and dev
"migrations": [
			"build/migration/common/**/*.js"
			"build/migration/stg2test/**/*.js"
],