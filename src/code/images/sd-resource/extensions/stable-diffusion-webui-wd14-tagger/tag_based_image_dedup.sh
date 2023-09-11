#!/bin/bash

# this script is for deduping images based on tags after they have been interrogated using this extension
#
# the file removal instructions are written to remove_instructions.sh
# you have to manually run remove_instructions.sh to remove the files
# this script requires exiftool and feh
# TODO: implement this in the extension
#
# Usage:
# repo_dir=/path/to/repo
# cd /path/to/images
#

# use tabs as field separator
while read -r -d '\t' first_file second_file etc; do
  # images may be jpg jpeg or png
  first_image=$(basename "$first_file" ".txt")
  if [[ -f "$first_image.jpg" ]]; then
    first_image="$first_image.jpg"
  elif [[ -f "$first_image.jpeg" ]]; then
    first_image="$first_image.jpeg"
  elif [[ -f "$first_image.png" ]]; then
    first_image="$first_image.png"
  else
    echo "No image file found for $first_file" 1>&2
    continue
  fi
  second_image=$(basename "$second_file" ".txt")
  if [[ -f "$second_image.jpg" ]]; then
    second_image="$second_image.jpg"
  elif [[ -f "$second_image.jpeg" ]]; then
    second_image="$second_image.jpeg"
  elif [[ -f "$second_image.png" ]]; then
    second_image="$second_image.png"
  else
    echo "No image file found for $second_file" 1>&2
    continue
  fi
  feh -g 950x800+5+30 -Z --scale-down -d -S filename --title "$first_image" "$first_image"&
  pid1=$!
  feh -g 950x800+963+30 -Z --scale-down -d -S filename --title "$second_image" "$second_image"&
  pid2=$!
  read -p "Are $first_image and $second_image the same? " -n 1 -r REPLY </dev/tty 1>&2
  if  [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Not the same" 1>&2
    continue
  fi
  # keep file with largest dimensions
  first_width=$(exiftool "$first_image" | grep -E '^Image Width' | cut -d ':' -f 2)
  first_height=$(exiftool "$first_image" | grep -E '^Image Height' | cut -d ':' -f 2)
  second_width=$(exiftool "$second_image" | grep -E '^Image Width' | cut -d ':' -f 2)
  second_height=$(exiftool "$second_image" | grep -E '^Image Height' | cut -d ':' -f 2)
  echo -e "$first_image: ${first_width}x${first_height}\t-\t$second_image: ${second_width}x${second_height}" 1>&2
  first_product=$((first_width * first_height))
  second_product=$((second_width * second_height))

  if [ $first_product -eq $second_product ]; then
    read -p "Same size for 1) $first_image and 2) $second_image. Which one do you want to keep? (1/2) [skip]" -n 1 -r REPLY </dev/tty 1>&2
    if [[ $REPLY =~ ^[1]$ ]]; then
      echo "Keeping $first_file" 1>&2
      echo rm "$second_file" "$second_image"
    elif [[ $REPLY =~ ^[2]$ ]]; then
      echo "Keeping $second_file" 1>&2
      echo rm "$first_file" "$first_image"
    else
      echo "Skipping" 1>&2
    fi
  elif [ $((first_width * first_height)) -gt $((second_width * second_height)) ]; then
    echo "Keeping $first_file" 1>&2
    echo rm "$second_file" "$second_image"
  else
    echo "Keeping $second_file" 1>&2
    echo rm "$first_file" "$first_image"
  fi
  kill $pid1 $pid2
done < <(
ls -1 *.txt | while read f; do
  sed 's/, /\n/g' "$f" | sort | tr '\n' ',' | sed "s~,$~\t$f\n~"
done | sort | awk -F'\t' '{
  a[$1] = a[$1] == "" ? $2 : a[$1]"\t"$2;
} END {
  for (i in a) {
    if (index(a[i], "\t") != 0) {
      print a[i];
    }
  }
}') > remove_instructions.sh
