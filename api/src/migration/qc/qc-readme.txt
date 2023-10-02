all the migration added to this folder will be run only on qc and dev
all migration file runs on qc
therefore migration path for qc will be
"migrations": [
			"build/migration/**/*.js"
],