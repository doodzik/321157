# [321157](http://321157.eu)

[click here to see what this site looks like](http://321157.eu)

## Setup
```bash
git clone https://github.com/doodzik/321157
cd 321157
npm install
```

## Running
```bash
make serve
```

## Liking
run like $video_url from anywhere to like a video
run `like_batch $file_path` from anywhere to like a file of likes
run `echo "$like_url" >> $file_to_save_to` to add a liked video to file

```bash
# add this to your .zshrc
export YOUTUBE_KEY=[token]
export VIMEO_CLIENT_ID=[token]
export VIMEO_CLIENT_SECRET=[token]
export VIMEO_ACCESS_TOKEN=[token]

alias like=~/321157/bin/H941000
alias like_batch=~/321157/bin/H941000_BATCH

# LINK can be a youtube link or vimeo link
./bin/H941000 $LINK

# If you are finnished liking. push your changes.
# the commit is made for you
git push
```

The post markup is defiend in build
