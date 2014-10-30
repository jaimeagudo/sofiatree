#!/bin/sh
# It uploads a 3mb dictionary of words (about 350.000 words) and launches 1500 searches 
# with 100 parallel threads in parallel to test SofiaTree performance
#
curl -H "Content-Type: Application/json"  -X POST 'http://127.0.0.1:8000/dictionary/' -d @dictionary.json

start_time=`date +%s`
parallel -j 100 < searches.sh
echo run time is $(expr `date +%s` - $start_time) 