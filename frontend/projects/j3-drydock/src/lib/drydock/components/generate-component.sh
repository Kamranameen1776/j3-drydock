#!/bin/sh

# Execute this script to generate a new component in the drydock library
#
# Usage: ./generate-component.sh <component-name>
#
# Ex: ./generate-component.sh example-projects
# Ex: ./generate-component.sh example-projects/example-projects-grid
#

../../../../../../node_modules/@angular/cli/bin/ng generate component $1