---
description: Optimize all jpeg photos in the image/travel directory
---

Search the public images directory for all jpeg photos and optimize them to webp using the optimize-images script.

Instructions:

1. Find all jpeg photos
2. Optimize them using the script, keeping quality as high as possible
3. View the images, make sure the file name makes sense and is prepended with "andrew-alagna-". Change the file names if you think it is needed in order to describe the image better, making sure to prepend with "andrew-alagna-" before the new file name (for SEO)
4. Add the optimized images to the trips content data. Avoid words such as "posing" or "people"
5. Clean/remove the old images that are no longer needed
6. Commit using the /push command after completing optimizing and adding to data, but without deploying or pushing to remote. Only make the commits

Guidelines:

- Make sure the images stay as high quality as possible
- Make sure the captions are descriptive, creative, and cool for a 30 year old man to say

After finishing, check the trip data and clean it by making sure there is no content data for photos that do not exist. Also make sure all existing photos are linked to a piece of trip content data so that they will be displayed. Then output the photos names that you optimized and their captions,like "photo name": "caption added to content data". Also output any content data that was removed (if it did not have a corresponding photo)
