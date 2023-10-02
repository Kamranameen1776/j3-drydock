All the migration added to this folder will run only on production
hotfix for prod will be given in this folder
and migration path for prod will be
"migrations": [
			"build/migration/common/**/*.js"
			"build/migration/prod/**/*.js"
],